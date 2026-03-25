export function formatMoneyString(val: string | number | bigint) {
  if (!val) return '0';
  const strVal = val.toString().replace(/\\D/g, '');
  if (!strVal) return '0';
  return strVal.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');
}
