import { textColor } from './color.js';
export const sizes = { '1:1': [1080, 1080], '4:5': [1080, 1350], '9:16': [1080, 1920] };
let cachedUrl;
let cachedImage;
export function loadImage(url) {
  if (url === cachedUrl) return cachedImage;
  cachedUrl = url;
  cachedImage = new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => { cachedUrl = null; reject(new Error('사진을 불러오지 못했습니다.')); };
    image.src = url;
  });
  return cachedImage;
}

export function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    // Keep English words together; split long words and Korean text when needed.
    for (const token of paragraph.match(/\S+\s*|\s+/gu) || ['']) {
      if (line && ctx.measureText(line + token).width > maxWidth) {
        lines.push(line.trimEnd());
        line = '';
      }
      for (const character of token) {
        if (line && ctx.measureText(line + character).width > maxWidth) {
          lines.push(line.trimEnd());
          line = '';
        }
        line += character;
      }
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

export function drawCard(canvas, image, photo, settings) {
  const [width, height] = sizes[settings.ratio];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas를 사용할 수 없습니다.');
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  ctx.drawImage(image, (image.naturalWidth - sourceWidth) / 2, (image.naturalHeight - sourceHeight) / 2, sourceWidth, sourceHeight, 0, 0, width, height);
  ctx.fillStyle = `rgba(0,0,0,${settings.overlay})`;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = textColor(photo.color);
  ctx.textAlign = settings.align;
  ctx.textBaseline = 'top';
  const padding = 90;
  const maxWidth = width - padding * 2;
  const x = settings.align === 'left' ? padding : settings.align === 'right' ? width - padding : width / 2;
  const font = size => `${size}px Arial, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
  let size = settings.fontSize;
  let quoteLines, authorLines, authorSize, blockHeight;
  // Fit long text within the card while preserving the chosen size for normal quotes.
  do {
    ctx.font = font(size);
    quoteLines = wrapText(ctx, settings.quote, maxWidth);
    authorSize = Math.max(14, size * 0.5);
    ctx.font = font(authorSize);
    authorLines = settings.author.trim() ? wrapText(ctx, `— ${settings.author.trim()}`, maxWidth) : [];
    blockHeight = quoteLines.length * size * 1.5 + (authorLines.length ? size * 0.7 + authorLines.length * authorSize * 1.5 : 0);
    if (blockHeight <= height - padding * 2 || size <= 12) break;
    size -= 1;
  } while (true);
  let y = Math.max(padding, (height - blockHeight) / 2);
  ctx.save();
  ctx.beginPath(); ctx.rect(padding, padding, maxWidth, height - padding * 2); ctx.clip();
  ctx.font = font(size);
  for (const line of quoteLines) { ctx.fillText(line, x, y); y += size * 1.5; }
  y += size * 0.7;
  ctx.font = font(authorSize);
  for (const line of authorLines) { ctx.fillText(line, x, y); y += authorSize * 1.5; }
  ctx.restore();
}

export async function createPng(photo, settings) {
  if (!photo) throw new Error('먼저 사진을 선택하세요.');
  try {
    const image = await loadImage(photo.urls.regular);
    const canvas = document.createElement('canvas');
    drawCard(canvas, image, photo, settings);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error()), 'image/png'));
  } catch { throw new Error('Canvas PNG 내보내기에 실패했습니다. 사진을 다시 선택하고 시도하세요.'); }
}
