export function textColor(color = '#333333') {
  const rgb = color.replace('#', '').match(/.{2}/g)?.map(value => parseInt(value, 16));
  if (!rgb || rgb.length !== 3) return '#ffffff';
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.55 ? '#111111' : '#ffffff';
}
