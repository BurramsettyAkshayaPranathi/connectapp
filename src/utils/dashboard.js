export function formatLabel(value) {
  return String(value || 'n/a').replaceAll('_', ' ').toLowerCase();
}

export function matchesSearch(item, searchTerm, fields) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) {
    return true;
  }

  return fields.some((field) => String(item?.[field] || '').toLowerCase().includes(normalizedSearch));
}

export function buildFilterOptions(items, key, fallbackLabel = 'N/A') {
  const labels = Array.from(new Set(items.map((item) => formatLabel(item?.[key] || fallbackLabel))))
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  return ['all', ...labels];
}
