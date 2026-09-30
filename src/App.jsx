import React, { useEffect, useRef, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import PhotoGrid from './components/PhotoGrid.jsx';
import Editor from './components/Editor.jsx';
import CardPreview from './components/CardPreview.jsx';
import { hasApiKey, searchPhotos, trackDownload } from './api/unsplash.js';
import { createPng } from './utils/canvas.js';
import { readStorage, writeStorage } from './utils/storage.js';
import quotes from './data/quotes.json';
import { themes } from './data/themes.js';
const defaults = { quote: quotes[0].ko, author: quotes[0].author, ratio: '1:1', align: 'center', fontSize: 56, overlay: 0.3, font: 'sans', position: 'center', autoColor: true, textColor: '#ffffff', overlayMode: 'auto', overlayStyle: 'gradient', showAuthor: true, showCredit: true };
export default function App() {
  const [query, setQuery] = useState('');
  const [activeTheme, setActiveTheme] = useState('도전');
  const searchId = useRef(0);
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [settings, setSettings] = useState(() => ({ ...defaults, ...readStorage('settings', {}), quote: defaults.quote, author: defaults.author }));
  const [favorites, setFavorites] = useState(() => readStorage('favorites', []));
  const [recent, setRecent] = useState(() => readStorage('recent', []).slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { writeStorage('settings', settings); }, [settings]);
  useEffect(() => { writeStorage('favorites', favorites); }, [favorites]);
  useEffect(() => { writeStorage('recent', recent); }, [recent]);
  useEffect(() => { runSearch(themes[0].query); }, []);
  async function runSearch(keyword) {
    const id = ++searchId.current;
    setLoading(true); setError(''); setMessage('');
    try {
      const results = await searchPhotos(keyword);
      if (id !== searchId.current) return;
      setPhotos(results);
      if (results.length) setPhoto(results[0]);
      setMessage(results.length ? '' : '검색 결과가 없습니다. 다른 키워드를 입력하세요.');
    } catch (err) { if (id === searchId.current) setError(err.message); }
    finally { if (id === searchId.current) setLoading(false); }
  }
  function selectTheme(theme) {
    setActiveTheme(theme.label); setQuery('');
    const quote = quotes.find(item => item.theme === theme.label);
    if (quote) setSettings(previous => ({ ...previous, quote: quote.ko, author: quote.author || 'Unknown' }));
    runSearch(theme.query);
  }
  function search() {
    if (!query.trim() || loading) return;
    setActiveTheme(''); runSearch(query.trim());
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
  return <main><header><div><span className="eyebrow">YOUR EVERYDAY CREATIVE SPACE</span><h1>Quote Card <span>Studio</span></h1></div><p>한 장의 사진, 나만의 문장.</p></header>
    {!hasApiKey && <p className="error" role="alert">.env에 VITE_UNSPLASH_ACCESS_KEY를 설정한 뒤 서버를 다시 실행하세요.</p>}
    <SearchBar query={query} setQuery={setQuery} onSearch={search} onTheme={selectTheme} activeTheme={activeTheme} loading={loading} />
    <div aria-live="polite">{error ? <p className="error" role="alert">{error}</p> : message && <p className="status">{message}</p>}</div>
    <div className="workspace"><PhotoGrid photos={photos} selected={photo} loading={loading} onSelect={selected => { searchId.current += 1; setLoading(false); setPhoto(selected); }} /><CardPreview photo={photo} settings={settings} setSettings={setSettings} loading={loading} /><Editor settings={settings} setSettings={setSettings} favorites={favorites} setFavorites={setFavorites} activeTheme={activeTheme} onExport={download} exporting={exporting} photo={photo} /></div>
    <section className="recent"><h2>최근 작업 <small>{recent.length} / 10</small></h2><p className="muted">내보낸 카드를 선택하면 다시 편집할 수 있습니다.</p>
      {recent.length ? <div className="recent-grid">{recent.map(work => <button className="recent-card secondary" key={work.id} onClick={() => { searchId.current += 1; setLoading(false); setActiveTheme(''); setPhoto(work.photo); setSettings({ ...defaults, ...work.settings }); setError(''); setMessage('최근 작업을 불러왔습니다.'); }}><img src={work.photo.urls.small} alt="" loading="lazy" /><span>{work.settings.quote || '(문구 없음)'}<small>{work.photo.user.name} / Unsplash · {work.settings.ratio}</small></span></button>)}</div> : <p>아직 저장한 작업이 없습니다.</p>}
    </section></main>;
}
