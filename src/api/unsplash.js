const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
export const hasApiKey = Boolean(key && key !== 'YOUR_ACCESS_KEY');
const cache = new Map();

async function request(url) {
  if (!hasApiKey) throw new Error('.env에 Unsplash Access Key를 넣고 서버를 다시 실행하세요.');
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' },
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    throw new Error('Unsplash 요청에 실패했습니다. 키, 네트워크 또는 API 사용 한도를 확인하세요.');
  }
}

export async function searchPhotos(query) {
  const normalized = query.trim().toLowerCase();
  if (cache.has(normalized)) return cache.get(normalized);
  const url = new URL('https://api.unsplash.com/search/photos');
  url.search = new URLSearchParams({ query: normalized, per_page: '12' });
  const data = await request(url);
  const photos = data.results.map(({ id, color, alt_description, urls, links, user }) => ({
    id, color, alt_description, urls: { small: urls.small, regular: urls.regular },
    links: { html: links.html, download_location: links.download_location },
    user: { name: user.name, links: { html: user.links.html } },
  }));
  cache.set(normalized, photos);
  return photos;
}

export function trackDownload(photo) {
  return request(photo.links.download_location);
}

export function attributionUrl(url) {
  const link = new URL(url);
  link.searchParams.set('utm_source', 'quote_card_studio');
  link.searchParams.set('utm_medium', 'referral');
  return link.href;
}
