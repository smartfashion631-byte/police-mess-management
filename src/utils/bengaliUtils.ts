// Bengali Number & Currency Conversion Helpers

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === undefined || num === null) return '০';
  const str = num.toString();
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function formatTaka(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('en-IN');
  return `৳ ${toBengaliNumber(formatted)}`;
}

export function formatTakaRaw(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('en-IN');
  return toBengaliNumber(formatted);
}
