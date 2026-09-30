import React, { useState } from 'react';
import quotes from '../data/quotes.json';
export default function Editor({ settings, setSettings, favorites, setFavorites, onKeyword, onExport, exporting, photo }) {
  const [language, setLanguage] = useState('ko');
  const [quoteId, setQuoteId] = useState('');
  const change = (name, value) => setSettings(previous => ({ ...previous, [name]: value }));
  const selectQuote = (id, lang = language) => {
    setQuoteId(id);
    const quote = quotes.find(item => item.id === id);
    if (quote) { setSettings(previous => ({ ...previous, quote: quote[lang], author: '' })); onKeyword(quote.searchKeywords[0]); }
  };
  const favorite = favorites.some(item => item.quote === settings.quote && item.author === settings.author);
  const toggleFavorite = () => setFavorites(previous => favorite ? previous.filter(item => item.quote !== settings.quote || item.author !== settings.author) : [...previous, { quote: settings.quote, author: settings.author }]);
  return <section className="editor"><h2>2. 문구 선택 및 편집</h2>
    <div className="two-columns"><label>문구 언어<select value={language} onChange={event => { setLanguage(event.target.value); selectQuote(quoteId, event.target.value); }}><option value="ko">한국어</option><option value="en">English</option></select></label>
    <label>샘플 명언<select value={quoteId} onChange={event => selectQuote(event.target.value)}><option value="">직접 입력</option>{quotes.map(quote => <option key={quote.id} value={quote.id}>{quote.theme} · {quote[language]}</option>)}</select></label></div>
    <label>명언<textarea rows="5" maxLength="1500" value={settings.quote} onChange={event => { setQuoteId(''); change('quote', event.target.value); }} /></label>
    <label>저자<input maxLength="160" value={settings.author} onChange={event => change('author', event.target.value)} placeholder="저자명 (선택)" /></label>
    <button className="secondary" disabled={!settings.quote.trim()} onClick={toggleFavorite}>{favorite ? '★ 즐겨찾기 해제' : '☆ 명언 즐겨찾기'}</button>
    {favorites.length > 0 && <label>즐겨찾는 명언<select value="" onChange={event => { const item = favorites[Number(event.target.value)]; setQuoteId(''); setSettings(previous => ({ ...previous, ...item })); }}><option value="" disabled>저장한 명언 선택</option>{favorites.map((item, index) => <option key={index} value={index}>{item.quote} {item.author}</option>)}</select></label>}
    <div className="two-columns"><label>출력 비율<select value={settings.ratio} onChange={event => change('ratio', event.target.value)}><option>1:1</option><option>4:5</option><option>9:16</option></select></label>
    <label>텍스트 정렬<select value={settings.align} onChange={event => change('align', event.target.value)}><option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option></select></label></div>
    <label>글자 크기 · {settings.fontSize}px<input type="range" min="28" max="100" value={settings.fontSize} onChange={event => change('fontSize', Number(event.target.value))} /></label>
    <label>어두운 오버레이 · {Math.round(settings.overlay * 100)}%<input type="range" min="0" max="0.85" step="0.05" value={settings.overlay} onChange={event => change('overlay', Number(event.target.value))} /></label>
    <small>사진 대표색으로 글자색을 자동 선택합니다. 긴 문구는 카드에 맞춰 축소됩니다.</small>
    <button className="export" onClick={onExport} disabled={!photo || exporting}>{exporting ? '내보내는 중…' : '3. Download PNG'}</button>
  </section>;
}
