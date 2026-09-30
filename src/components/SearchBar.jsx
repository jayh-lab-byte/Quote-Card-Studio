import React from 'react';
export default function SearchBar({ query, setQuery, onSearch, loading }) {
  return <div className="search-bar">
    <label htmlFor="search">1. 사진 검색</label>
    <div className="search-row"><input id="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="autumn, forest, sunlight…" />
      <button onClick={onSearch} disabled={loading || !query.trim()}>{loading ? '검색 중…' : 'Search'}</button></div>
    <small>검색 버튼을 눌렀을 때만 Unsplash를 검색합니다.</small>
  </div>;
}
