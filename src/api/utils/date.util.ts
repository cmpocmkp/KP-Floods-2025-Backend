import { GroupBy } from '../dtos/trends.dto';

export function buildDateRange(
  from: string,
  to: string,
  groupBy: GroupBy = GroupBy.DAILY,
): Date[] {
  const dates: Date[] = [];
  const current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    if (groupBy === GroupBy.WEEKLY) {
      // Align to Monday
      const day = current.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Sunday = 0, Monday = 1
      current.setDate(current.getDate() + diff);
    }
    dates.push(new Date(current));
    
    if (groupBy === GroupBy.WEEKLY) {
      current.setDate(current.getDate() + 7);
    } else {
      current.setDate(current.getDate() + 1);
    }
  }

  return dates;
}

export function alignAndFill(
  seriesMap: Map<string, number>,
  from: string,
  to: string,
  groupBy: GroupBy = GroupBy.DAILY,
  fillMissing = true,
): { date: string; value: number }[] {
  const dates = buildDateRange(from, to, groupBy);
  
  return dates.map((date) => {
    const key = date.toISOString().split('T')[0];
    return {
      date: key,
      value: fillMissing ? seriesMap.get(key) || 0 : seriesMap.get(key) ?? 0,
    };
  });
}