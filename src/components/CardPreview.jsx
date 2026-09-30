import React, { useEffect, useRef, useState } from 'react';
import { drawCard, loadImage, sizes } from '../utils/canvas.js';
import { Attribution } from './PhotoGrid.jsx';
export default function CardPreview({ photo, settings, setSettings, loading }) {
  const ref = useRef(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    let active = true;
    if (!photo) { drawCard(ref.current, null, null, settings); return; }
    setStatus('미리보기 준비 중…');
    Promise.all([loadImage(photo.urls.regular), document.fonts.ready]).then(([image]) => {
      if (!active) return;
      drawCard(ref.current, image, photo, settings); setStatus('');
    }).catch(() => { if (active) setStatus('Canvas 미리보기를 만들 수 없습니다. 사진을 다시 선택하세요.'); });
    return () => { active = false; };
  }, [photo, settings]);
  const [width, height] = sizes[settings.ratio];
  return <section className="preview-panel"><div className="panel-heading"><h2>Live Preview</h2><span className="live-dot">{loading ? '사진 로딩 중' : '실시간 미리보기'}</span></div>
    <div className="canvas-stage"><canvas ref={ref} style={{ aspectRatio: `${width}/${height}` }} aria-label={`${settings.quote} ${settings.showAuthor ? settings.author : ''}`} /></div>
    <div className="preview-toolbar"><div className="segmented">{Object.keys(sizes).map(ratio => <button key={ratio} className={settings.ratio === ratio ? 'active' : ''} aria-pressed={settings.ratio === ratio} onClick={() => setSettings(previous => ({ ...previous, ratio }))}>{ratio}</button>)}</div><small>{width} × {height} px</small></div>
    <p className="preview-status" role="status">{status || (!photo ? '사진을 불러오면 카드에 자동으로 적용됩니다.' : '')}</p>
    {photo && <Attribution photo={photo} />}
  </section>;
}
