export function formatDays(value) {
  const days = Number(value || 5);
  const lastTwo = days % 100;
  const last = days % 10;
  const word = lastTwo >= 11 && lastTwo <= 14
    ? 'дней'
    : last === 1
      ? 'день'
      : last >= 2 && last <= 4
        ? 'дня'
        : 'дней';
  return `${days} ${word}`;
}
