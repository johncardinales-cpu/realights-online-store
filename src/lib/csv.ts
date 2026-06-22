export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const esc = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((h) => esc(row[h])).join(','))].join('\n');
}

export function parseCsv(text: string) {
  const lines = text.replace(/\r/g, '').split('\n').filter(Boolean);
  const [headerLine, ...body] = lines;
  if (!headerLine) return [] as Record<string, string>[];
  const headers = headerLine.split(',').map((h) => h.trim());
  return body.map((line) => {
    const cells = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
  });
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
