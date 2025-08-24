export const districtToDivisionMap: Record<string, string> = {
  // Common variations
  'di khan': 'Dera Ismail Khan',
  'dir lower': 'Malakand',
  'dir upper': 'Malakand',
  'dikhan': 'Dera Ismail Khan',
  'dera ismail': 'Dera Ismail Khan',
  'dirlow': 'Malakand',
  'dirupp': 'Malakand',
  'waziristan north': 'Bannu',
  'waziristan south': 'Dera Ismail Khan',
  'kohistan lower': 'Hazara',
  'kohistan upper': 'Hazara',
  'kohistan kolai pallas': 'Hazara',
  // Peshawar Division
  'peshawar': 'Peshawar',
  'charsadda': 'Peshawar',
  'nowshera': 'Peshawar',
  'khyber': 'Peshawar',
  'mohmand': 'Peshawar',

  // Malakand Division
  'swat': 'Malakand',
  'upper dir': 'Malakand',
  'lower dir': 'Malakand',
  'chitral': 'Malakand',
  'upper chitral': 'Malakand',
  'lower chitral': 'Malakand',
  'malakand': 'Malakand',
  'buner': 'Malakand',
  'shangla': 'Malakand',
  'bajaur': 'Malakand',

  // Bannu Division
  'bannu': 'Bannu',
  'lakki marwat': 'Bannu',
  'north waziristan': 'Bannu',

  // Hazara Division
  'abbottabad': 'Hazara',
  'mansehra': 'Hazara',
  'battagram': 'Hazara',
  'kohistan': 'Hazara',
  'torghar': 'Hazara',
  'upper kohistan': 'Hazara',
  'lower kohistan': 'Hazara',
  'kolai palas': 'Hazara',

  // Mardan Division
  'mardan': 'Mardan',
  'swabi': 'Mardan',

  // Dera Ismail Khan Division
  'dera ismail khan': 'Dera Ismail Khan',
  'tank': 'Dera Ismail Khan',
  'south waziristan': 'Dera Ismail Khan',

  // Kohat Division
  'kohat': 'Kohat',
  'karak': 'Kohat',
  'hangu': 'Kohat',
  'orakzai': 'Kohat',
  'kurram': 'Kohat',
};

export function getDistrictDivision(district: string): string {
  if (!district) {
    console.warn('Empty district name provided');
    return 'Unknown';
  }
  
  // Normalize the district name by converting to lowercase, removing extra spaces
  const normalizedDistrict = district.toLowerCase().trim()
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Remove special characters and numbers
    .replace(/[^a-z\s]/g, '');

  const division = districtToDivisionMap[normalizedDistrict];
  
  if (!division) {
    // Log the normalized district name to help debug mapping issues
    console.warn(`Unknown district: ${district} (normalized: ${normalizedDistrict})`);
  }
  
  return division || 'Unknown';
}