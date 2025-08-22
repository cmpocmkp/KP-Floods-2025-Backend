import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini"; // supports images + JSON mode

const LIVESTOCK_SCHEMA = {
  name: "LivestockExtraction",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      division: { type: "string" },
      district: { type: "string" },
      department: { type: "string" },
      big_cattle_perished: { type: "number" },
      small_cattle_perished: { type: "number" }
    },
    required: [
      "division",
      "district",
      "department",
      "big_cattle_perished",
      "small_cattle_perished"
    ]
  },
  strict: true
};
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';
// For DOCX files
const mammoth = require('mammoth');
import { DocumentProcessingResponse, LivestockRecord } from './dtos/document-processing.dto';

@Injectable()
export class DocumentProcessingService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('openai.apiKey'),
    });
  }

  private async extractTextFromPDF(buffer: Buffer): Promise<LivestockRecord[]> {
    const data = await pdfParse(buffer);
    // Format the text to match our expected pattern
    const lines = data.text.split('\n').map(line => line.trim()).filter(line => line);
    return this.formatExtractedText(lines);
  }

  private async extractTextFromExcel(buffer: Buffer): Promise<LivestockRecord[]> {
    const workbook = XLSX.read(buffer);
    let lines: string[] = [];
    
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const rows = csv.split('\n').map(row => row.trim()).filter(row => row);
      
      // Try to identify headers and values
      rows.forEach((row, index) => {
        const cells = row.split(',').map(cell => cell.trim());
        cells.forEach((cell, cellIndex) => {
          const nextRow = rows[index + 1];
          const nextCells = nextRow?.split(',').map(c => c.trim()) || [];
          
          // Look for our target fields
          if (cell.toLowerCase().includes('division')) {
            lines.push(`Division → ${nextCells[cellIndex] || ''}`);
          }
          if (cell.toLowerCase().includes('district')) {
            lines.push(`District → ${nextCells[cellIndex] || ''}`);
          }
          if (cell.toLowerCase().includes('department')) {
            lines.push(`Department → ${nextCells[cellIndex] || ''}`);
          }
          if (cell.toLowerCase().includes('big') && cell.toLowerCase().includes('cattle')) {
            lines.push(`Big cattle perished → ${nextCells[cellIndex] || '0'}`);
          }
          if (cell.toLowerCase().includes('small') && cell.toLowerCase().includes('cattle')) {
            lines.push(`Small cattle perished → ${nextCells[cellIndex] || '0'}`);
          }
        });
      });
    });
    
    return this.formatExtractedText(lines);
  }

  private async extractTextFromDocx(buffer: Buffer): Promise<LivestockRecord[]> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const lines = result.value.split('\n').map(line => line.trim()).filter(line => line);
      return this.formatExtractedText(lines);
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      // Fallback to basic text extraction
      const text = buffer.toString('utf-8');
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      return this.formatExtractedText(lines);
    }
  }

  private formatExtractedText(lines: string[]): LivestockRecord[] {
    // Initialize column indices
    let idCol = -1;
    let divisionCol = -1;
    let districtCol = -1;
    let departmentCol = -1;
    let bigCattleCol = -1;
    let smallCattleCol = -1;

    // Find the header row and identify columns
    const headerRow = 0; // Assume first row is header
    const headerLine = lines[headerRow]?.toLowerCase() || '';
    
    // Split the header into parts and find column indices
    const headerParts = headerLine.split(/\s+/);
    headerParts.forEach((part, index) => {
      if (part.includes('id')) idCol = index;
      if (part.includes('division') || part === 'divsion') divisionCol = index + 1;
      if (part.includes('district')) districtCol = index + 1;
      if (part.includes('department')) departmentCol = index + 1;
      if (part.includes('big') || part.includes('large')) bigCattleCol = index + 1;
      if (part.includes('small')) smallCattleCol = index + 1;
    });

    // If we couldn't find the columns in space-separated format, try looking for combined words
    if (divisionCol === -1 || districtCol === -1) {
      headerParts.forEach((part, index) => {
        const lowerPart = part.toLowerCase();
        if (lowerPart.includes('division') || lowerPart.includes('divsion')) divisionCol = index;
        if (lowerPart.includes('district')) districtCol = index;
        if (lowerPart.includes('department')) departmentCol = index;
        if (lowerPart.includes('big') || lowerPart.includes('large')) bigCattleCol = index;
        if (lowerPart.includes('small')) smallCattleCol = index;
      });
    }

    console.log('Column positions:', {
      idCol,
      divisionCol,
      districtCol,
      departmentCol,
      bigCattleCol,
      smallCattleCol
    });

    const records: LivestockRecord[] = [];
    let currentDivision = '';

    // Process each line after the header
    lines.slice(headerRow + 1).forEach(line => {
      const parts = line.trim().split(/\s+/);
      console.log('Processing line parts:', parts);

      // Try to extract values from concatenated strings
      let division = '';
      let district = '';
      let department = 'Livestock';
      let bigCattle = 0;
      let smallCattle = 0;

      // First try to parse as separate columns
      if (parts.length > 1) {
        division = divisionCol !== -1 ? parts[divisionCol] || currentDivision : currentDivision;
        district = districtCol !== -1 ? parts[districtCol] || '' : '';
        department = departmentCol !== -1 ? parts[departmentCol] || 'Livestock' : 'Livestock';
        bigCattle = bigCattleCol !== -1 && parts[bigCattleCol] && /^\d+$/.test(parts[bigCattleCol]) 
          ? parseInt(parts[bigCattleCol]) 
          : 0;
        smallCattle = smallCattleCol !== -1 && parts[smallCattleCol] && /^\d+$/.test(parts[smallCattleCol])
          ? parseInt(parts[smallCattleCol])
          : 0;
      }

      // If we couldn't find values in columns, try to parse from concatenated string
      if (!division || !district) {
        const fullText = parts.join('');
        const divMatch = fullText.match(/(\d+)?([A-Za-z]+)([A-Za-z]+)Livestock/);
        if (divMatch) {
          const [_, id, div, dist] = divMatch;
          division = div;
          district = dist;
          
          // Look for numbers after "Livestock"
          const numbers = fullText.substring(fullText.indexOf('Livestock')).match(/\d+/g) || [];
          if (numbers.length >= 2) {
            bigCattle = parseInt(numbers[0]) || 0;
            smallCattle = parseInt(numbers[1]) || 0;
          }
        }
      }

      // Update current division for next rows
      if (division) {
        currentDivision = division;
      }

      // Add record if we have division and district
      if (division && district) {
        records.push({
          division,
          district,
          department,
          bigCattlePerished: bigCattle,
          smallCattlePerished: smallCattle
        });
      }
    });

    console.log('Extracted records:', records);
    return records;
  }

  private getImageMimeSubtype(buffer: Buffer): string {
    // Check for common image signatures
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'jpeg';
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'png';
    if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'gif';
    return 'jpeg'; // default to JPEG if unknown
  }

  private async getGPTResponse(input: string | Buffer | LivestockRecord[], isImage: boolean = false): Promise<DocumentProcessingResponse> {
    const systemPrompt = `You are a data extraction assistant for livestock data. You must extract EXACT values from text and images.

    CRITICAL INSTRUCTIONS:
    1. Look for EXACT phrases:
       - "Big cattle perished" followed by a number
       - "Small cattle perished" followed by a number
       - "Division" followed by text
       - "District" followed by text
       - "Department" followed by text
    
    2. When you see "Big cattle perished → X" or "Small cattle perished → X",
       the number after the arrow (→) is the exact count to use.

    3. NEVER return 0 for cattle counts if you see actual numbers in the text!

    Example:
    Division → Peshawar
    District → Mardan
    Big cattle perished → 49
    Small cattle perished → 90

    In this case:
    - bigCattlePerished = 49 (exact number after "Big cattle perished →")
    - smallCattlePerished = 90 (exact number after "Small cattle perished →")`;
    
    const userPrompt = `
    You are looking at a document showing livestock losses. Extract these EXACT fields:

    1. Look for these patterns:
       - "Division →" followed by text
       - "District →" followed by text
       - "Department →" followed by text
       - "Big cattle perished →" followed by a number
       - "Small cattle perished →" followed by a number

    2. VERY IMPORTANT:
       - When you see "Big cattle perished → X", use X as bigCattlePerished
       - When you see "Small cattle perished → Y", use Y as smallCattlePerished
       - The numbers after the arrows (→) are the exact values to use
       - DO NOT RETURN 0 if you see actual numbers!

    Return this JSON structure:
    {
      "division": "(text after Division →)",
      "district": "(text after District →)",
      "department": "(text after Department → or empty string)",
      "bigCattlePerished": (number after Big cattle perished →),
      "smallCattlePerished": (number after Small cattle perished →)
    }

    FINAL CHECK: If you see "Big cattle perished → 49" and "Small cattle perished → 90",
    you MUST return bigCattlePerished: 49 and smallCattlePerished: 90 in your response!
    `;

    const content = isImage ? [
      {
        type: "text" as const,
        text: userPrompt
      },
      {
        type: "image_url" as const,
        image_url: {
          url: `data:image/${this.getImageMimeSubtype(input as Buffer)};base64,${(input as Buffer).toString("base64")}`
        }
      }
    ] : userPrompt + "\n\nText to analyze:\n" + input;

    const completion = await this.openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 500
    });

    try {
      console.log('OpenAI Response:', completion.choices[0].message.content);
      if (Array.isArray(input)) {
        return { records: input };
      } else {
        const response = JSON.parse(completion.choices[0].message.content);
        console.log('Parsed response:', response);
        return {
          records: [{
            division: response.division || '',
            district: response.district || '',
            department: response.department || '',
            bigCattlePerished: Number(response.bigCattlePerished) || 0,
            smallCattlePerished: Number(response.smallCattlePerished) || 0
          }]
        };
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      return {
        records: [{
          division: '',
          district: '',
          department: '',
          bigCattlePerished: 0,
          smallCattlePerished: 0
        }]
      };
    }
  }

  async processDocument(file: Express.Multer.File): Promise<DocumentProcessingResponse> {
    try {
      // Check if it's an image
      const isImage = file.mimetype.startsWith('image/');
      
      if (isImage) {
        return await this.getGPTResponse(file.buffer, true);
      }

      // For non-image files, extract records directly
      let records: LivestockRecord[];
      switch (file.mimetype) {
        case 'application/pdf':
          records = await this.extractTextFromPDF(file.buffer);
          break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-excel':
        case 'text/csv':
          records = await this.extractTextFromExcel(file.buffer);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          records = await this.extractTextFromDocx(file.buffer);
          break;
        default:
          // For other file types, try to extract text directly
          const lines = file.buffer.toString('utf-8').split('\n').map(line => line.trim()).filter(line => line);
          records = this.formatExtractedText(lines);
      }

      console.log('Extracted records:', records);
      return { records };
    } catch (error) {
      console.error('Error processing document:', error);
      return {
        records: [{
          division: '',
          district: '',
          department: '',
          bigCattlePerished: 0,
          smallCattlePerished: 0
        }]
      };
    }
  }
}