import React, { useEffect, useRef, useState } from 'react';
import { drawCard, loadImage, sizes } from '../utils/canvas.js';
import { Attribution } from './PhotoGrid.jsx';
export default function CardPreview({ photo, settings }) {
  const ref = useRef(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    let active = true;
    if (!photo) return;
    setStatus('미리보기 준비 중…');
    loadImage(photo.urls.regular).then(image => {
      if (!active) return;
      drawCard(ref.current, image, photo, settings);
      setStatus('');
    }).catch(() => { if (active) setStatus('Canvas 미리보기를 만들 수 없습니다. 사진을 다시 선택하세요.'); });
    return () => { active = false; };
  }, [photo, settings]);
  const [width, height] = sizes[settings.ratio];
  return <section className="preview-panel"><h2>카드 미리보기</h2>
    {photo ? <><canvas ref={ref} style={{ aspectRatio: `${width}/${height}` }} aria-label={`${settings.quote} ${settings.author}`} /><p role="status">{status}</p><Attribution photo={photo} /></> : <div className="empty-preview">사진을 검색하고 선택하세요.</div>}
    <p className="muted">{width} × {height} px · PNG</p>
  </section>;
}
