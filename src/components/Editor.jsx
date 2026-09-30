import React, { useState } from 'react';
import quotes from '../data/quotes.json';
import { fonts } from '../utils/canvas.js';
export default function Editor({ settings, setSettings, favorites, setFavorites, activeTheme, onExport, exporting, photo }) {
  const [tab, setTab] = useState('추천');
  const [language, setLanguage] = useState('ko');
  const change = (name, value) => setSettings(previous => ({ ...previous, [name]: value }));
  const choose = item => setSettings(previous => ({ ...previous, quote: item[language] || item.quote, author: item.author || 'Unknown' }));
  const recommendations = activeTheme ? quotes.filter(item => item.theme === activeTheme) : quotes;
  const favorite = favorites.some(item => item.quote === settings.quote && item.author === settings.author);
  const toggleFavorite = () => setFavorites(previous => favorite ? previous.filter(item => item.quote !== settings.quote || item.author !== settings.author) : [...previous, { quote: settings.quote, author: settings.author }]);
  const toggle = (name, label) => <label className="toggle"><span>{label}</span><input type="checkbox" checked={settings[name]} onChange={event => change(name, event.target.checked)} /></label>;
  return <section className="editor"><div className="panel-heading"><h2>카드 편집</h2><small>Make it yours</small></div>
    <div className="editor-section"><div className="segmented">{['추천', '즐겨찾기', '직접 입력'].map(value => <button key={value} aria-pressed={tab === value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{value}</button>)}</div>
    {tab === '추천' && <><label className="language">언어<select value={language} onChange={event => { const next = event.target.value; const current = quotes.find(item => item.ko === settings.quote || item.en === settings.quote); setLanguage(next); if (current) change('quote', current[next]); }}><option value="ko">한국어</option><option value="en">English</option></select></label><div className="quote-list">{recommendations.map(item => <button className={`quote-option ${settings.quote === item[language] ? 'active' : ''}`} key={item.id} onClick={() => choose(item)}>{item[language]}<small>{item.author || 'Unknown'}</small></button>)}</div></>}
    {tab === '즐겨찾기' && <div className="quote-list">{favorites.length ? favorites.map((item, index) => <button className="quote-option" key={index} onClick={() => choose(item)}>{item.quote}<small>{item.author || 'Unknown'}</small></button>) : <p className="muted">마음에 드는 문구를 즐겨찾기에 담아보세요.</p>}</div>}
    <label>명언<textarea rows="4" maxLength="1500" value={settings.quote} onChange={event => change('quote', event.target.value)} /></label>
    <label>출처 / 저자<input maxLength="160" value={settings.author} onChange={event => change('author', event.target.value)} placeholder="Unknown, 직접 작성, 저자명" /></label>
    <button className="secondary favorite" disabled={!settings.quote.trim()} onClick={toggleFavorite}>{favorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기에 저장'}</button></div>
    <details open><summary>Typography <span>글자와 배치</span></summary><div className="editor-section">
    <label>폰트<select value={settings.font} onChange={event => change('font', event.target.value)}>{Object.entries(fonts).map(([key, font]) => <option key={key} value={key}>{font.label}</option>)}</select></label>
    <label>글자 크기 <output>{settings.fontSize}px</output><input type="range" min="28" max="100" value={settings.fontSize} onChange={event => change('fontSize', Number(event.target.value))} /></label>
    <div className="two-columns"><label>가로 정렬<select value={settings.align} onChange={event => change('align', event.target.value)}><option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option></select></label><label>세로 위치<select value={settings.position} onChange={event => change('position', event.target.value)}><option value="top">상단</option><option value="center">중앙</option><option value="bottom">하단</option></select></label></div>
    {toggle('autoColor', '글자색 자동 선택')}<label className="color-control">텍스트 색상<input type="color" value={settings.textColor} onChange={event => setSettings(previous => ({ ...previous, autoColor: false, textColor: event.target.value }))} /></label></div></details>
    <details><summary>Background <span>이미지와 오버레이</span></summary><div className="editor-section"><div className="two-columns"><label>오버레이 모드<select value={settings.overlayMode} onChange={event => change('overlayMode', event.target.value)}><option value="auto">자동</option><option value="manual">수동</option></select></label><label>스타일<select value={settings.overlayStyle} onChange={event => change('overlayStyle', event.target.value)}><option value="solid">단색</option><option value="gradient">그라디언트</option></select></label></div>
    <label>오버레이 강도 <output>{Math.round(settings.overlay * 100)}%</output><input type="range" min="0" max="0.85" step="0.05" value={settings.overlay} onChange={event => setSettings(previous => ({ ...previous, overlayMode: 'manual', overlay: Number(event.target.value) }))} /></label><small>{settings.overlayMode === 'auto' ? '사진 대표색에 맞춰 강도를 자동 조절합니다.' : '슬라이더로 배경 밝기를 조절합니다.'}</small></div></details>
    <details><summary>Display <span>카드 정보</span></summary><div className="editor-section">{toggle('showAuthor', '명언 출처 표시')}{toggle('showCredit', '카드 안 사진 크레딧 표시')}</div></details>
    <button className="export" onClick={onExport} disabled={!photo || exporting}>{exporting ? '내보내는 중…' : 'Download PNG ↓'}</button>
  </section>;
}
