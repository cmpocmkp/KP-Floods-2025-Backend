export class LivestockRecord {
  division: string;
  district: string;
  department: string;
  bigCattlePerished: number;
  smallCattlePerished: number;
}

export class DocumentProcessingResponse {
  records: LivestockRecord[];
}