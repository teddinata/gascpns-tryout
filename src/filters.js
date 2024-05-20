// filters.js
export function formatRupiah(value) {
  if (!value) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(value) {
  const date = new Date(value);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ', ' + date.toLocaleTimeString('id-ID') + ' WIB';
}