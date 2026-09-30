import React from 'react';
import { themes } from '../data/themes.js';
export default function SearchBar({ query, setQuery, onSearch, onTheme, activeTheme, loading }) {
  return <section className="search-panel" aria-label="사진 검색">
    <div className="chips">{themes.map(theme => <button key={theme.label} className={`chip ${activeTheme === theme.label ? 'active' : ''}`} aria-pressed={activeTheme === theme.label} onClick={() => onTheme(theme)}>{theme.label}</button>)}</div>
    <form className="search-row" onSubmit={event => { event.preventDefault(); onSearch(); }}><input aria-label="사진 검색어" value={query} onChange={event => setQuery(event.target.value)} placeholder="나만의 분위기를 검색하세요" /><button disabled={loading || !query.trim()}>{loading ? '검색 중…' : 'Search'}</button></form>
  </section>;
}
