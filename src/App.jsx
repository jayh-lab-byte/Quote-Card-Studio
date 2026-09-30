import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import PhotoGrid from './components/PhotoGrid.jsx';
import Editor from './components/Editor.jsx';
import CardPreview from './components/CardPreview.jsx';
import { hasApiKey, searchPhotos, trackDownload } from './api/unsplash.js';
import { createPng } from './utils/canvas.js';
import { readStorage, writeStorage } from './utils/storage.js';
import quotes from './data/quotes.json';
const defaults = { quote: quotes[0].ko, author: '', ratio: '1:1', align: 'center', fontSize: 56, overlay: 0.3 };
export default function App() {
  const [query, setQuery] = useState('autumn');
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [settings, setSettings] = useState(() => ({ ...defaults, ...readStorage('settings', {}) }));
  const [favorites, setFavorites] = useState(() => readStorage('favorites', []));
  const [recent, setRecent] = useState(() => readStorage('recent', []).slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { writeStorage('settings', settings); }, [settings]);
  useEffect(() => { writeStorage('favorites', favorites); }, [favorites]);
  useEffect(() => { writeStorage('recent', recent); }, [recent]);
  async function search() {
    if (!query.trim() || loading) return;
    setLoading(true); setError(''); setMessage('');
    try {
      const results = await searchPhotos(query);
      setPhotos(results);
      setMessage(results.length ? `${results.length}장의 사진 · 사진을 선택하세요.` : '검색 결과가 없습니다. 다른 키워드를 입력하세요.');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  async function download() {
    if (!photo) { setError('먼저 사진을 선택하세요.'); return; }
    if (exporting) return;
    setExporting(true); setError(''); setMessage('');
    try {
      const blob = await createPng(photo, settings);
      // One tracking request per explicit export, never during search or preview.
      await trackDownload(photo);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `quote-card-${photo.id}-${settings.ratio.replace(':', 'x')}.png`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setRecent(previous => [{ id: Date.now(), photo, settings: { ...settings } }, ...previous].slice(0, 10));
      setMessage('PNG 다운로드가 준비되었습니다. 최근 작업에 저장했습니다.');
    } catch (err) { setError(err.message); }
    finally { setExporting(false); }
  }
  return <main><header><span className="eyebrow">사진 한 장, 마음에 남는 문장</span><h1>Quote Card Studio</h1><p>사진을 고르고, 문구를 담고, 나만의 카드를 저장하세요.</p></header>
    {!hasApiKey && <p className="error" role="alert">.env에 VITE_UNSPLASH_ACCESS_KEY를 설정한 뒤 서버를 다시 실행하세요.</p>}
    <section className="search-panel"><SearchBar query={query} setQuery={setQuery} onSearch={search} loading={loading} />
      <PhotoGrid photos={photos} selected={photo} onSelect={setPhoto} /></section>
    <div aria-live="polite">{error ? <p className="error" role="alert">{error}</p> : <p className="status">{message}</p>}</div>
    <div className="workspace"><CardPreview photo={photo} settings={settings} /><Editor settings={settings} setSettings={setSettings} favorites={favorites} setFavorites={setFavorites} onKeyword={setQuery} onExport={download} exporting={exporting} photo={photo} /></div>
    <section className="recent"><h2>최근 작업 <small>{recent.length} / 10</small></h2><p className="muted">내보낸 카드를 선택하면 다시 편집할 수 있습니다.</p>
      {recent.length ? <div className="recent-grid">{recent.map(work => <button className="recent-card secondary" key={work.id} onClick={() => { setPhoto(work.photo); setSettings(work.settings); setError(''); setMessage('최근 작업을 불러왔습니다.'); }}><img src={work.photo.urls.small} alt="" loading="lazy" /><span>{work.settings.quote || '(문구 없음)'}<small>{work.photo.user.name} / Unsplash · {work.settings.ratio}</small></span></button>)}</div> : <p>아직 저장한 작업이 없습니다.</p>}
    </section></main>;
}
