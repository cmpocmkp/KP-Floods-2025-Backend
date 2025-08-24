export const districtToDivisionMap: Record<string, string> = {
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
  const normalizedDistrict = district.toLowerCase().trim();
  return districtToDivisionMap[normalizedDistrict] || 'Unknown';
}