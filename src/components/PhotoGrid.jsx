import React from 'react';
import { attributionUrl } from '../api/unsplash.js';
export function Attribution({ photo }) {
  return <small>Photo by <a href={attributionUrl(photo.user.links.html)} target="_blank" rel="noreferrer">{photo.user.name}</a> on <a href={attributionUrl(photo.links.html)} target="_blank" rel="noreferrer">Unsplash</a></small>;
}
export default function PhotoGrid({ photos, selected, onSelect }) {
  return <div className="photo-grid">{photos.map(photo => <article key={photo.id}>
    <button className={`photo ${selected?.id === photo.id ? 'selected' : ''}`} aria-pressed={selected?.id === photo.id} aria-label={`사진 선택: ${photo.alt_description || photo.user.name}`} onClick={() => onSelect(photo)}><img src={photo.urls.small} alt={photo.alt_description || 'Unsplash 사진'} loading="lazy" /></button>
    <Attribution photo={photo} />
  </article>)}</div>;
}
