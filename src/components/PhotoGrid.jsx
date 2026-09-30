import React from 'react';
import { attributionUrl } from '../api/unsplash.js';
export function Attribution({ photo }) {
  return <small>Photo by <a href={attributionUrl(photo.user.links.html)} target="_blank" rel="noreferrer">{photo.user.name}</a> / <a href={attributionUrl(photo.links.html)} target="_blank" rel="noreferrer">Unsplash</a></small>;
}
export default function PhotoGrid({ photos, selected, onSelect, loading }) {
  return <section className="browse-panel"><div className="panel-heading"><h2>이미지 탐색</h2><small>{loading ? '불러오는 중' : `${photos.length} photos`}</small></div><div className="photo-grid" aria-busy={loading}>{photos.map(photo => <article className={selected?.id === photo.id ? 'selected' : ''} key={photo.id}>
    <button className="photo" aria-pressed={selected?.id === photo.id} aria-label={`사진 선택: ${photo.alt_description || photo.user.name}`} onClick={() => onSelect(photo)}><img src={photo.urls.small} alt={photo.alt_description || 'Unsplash 사진'} loading="lazy" /></button>
    <div className="photo-credit"><Attribution photo={photo} /></div>
  </article>)}</div>{!photos.length && <p className="muted">{loading ? '분위기에 어울리는 사진을 찾고 있어요.' : '키워드를 선택해 사진을 찾아보세요.'}</p>}</section>;
}
