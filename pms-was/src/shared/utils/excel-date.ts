/**
 * Converts Excel serial date number to JS Date object
 * @param serial Excel serial date (e.g. 46101)
 * @returns Date object or null if invalid
 */
export function excelSerialToDate(serial: number | string | undefined | null): Date | null {
  if (serial === undefined || serial === null || serial === '') return null;
  
  const serialNum = typeof serial === 'string' ? parseFloat(serial) : serial;
  if (isNaN(serialNum)) return null;

  // Excel base date: 1899-12-30 (accounting for 1900 leap year bug)
  // Use UTC to avoid timezone issues during conversion
  const baseDate = new Date(Date.UTC(1899, 11, 30));
  const date = new Date(baseDate.getTime() + serialNum * 86400000);
  
  return date;
}
