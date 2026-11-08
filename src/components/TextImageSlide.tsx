import { useState } from 'react';
import type { TextImageNode } from '../types';
import { useSpeech } from '../hooks/useSpeech';

export default function TextImageSlide({ node, photoUrl, photoAlt, audioUrl, speechEnabled }: { node: TextImageNode; photoUrl: string; photoAlt: string; audioUrl: string | null; speechEnabled: boolean }) {
  useSpeech(audioUrl, speechEnabled);
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 1020, width: '100%', padding: 60 }}>
      <span id="ti-badge" className="step-badge" style={{ marginBottom: 20, display: 'inline-block' }}>{node.step_badge}</span>
      <div className="slide-grid-text-image" style={{ gap: 48 }}>
        <div>
          <h2 id="ti-title" style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 14px', letterSpacing: '-0.3px' }}>{node.title}</h2>
          <p id="ti-body" style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 24px' }}>{node.body}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="point-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span id="ti-point1" style={{ fontSize: 14, color: 'var(--text-2)' }}>{node.ti_point1}</span>
            </div>
            <div className="point-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span id="ti-point2" style={{ fontSize: 14, color: 'var(--text-2)' }}>{node.ti_point2}</span>
            </div>
          </div>
        </div>
        <div className="char-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'var(--surface2)', minHeight: 290, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!imgErr ? (
              <img src={photoUrl} alt={photoAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border2)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <button onClick={() => setImgErr(false)} style={{ fontSize: 11, color: 'var(--purple)', background: 'none', border: '1px solid rgba(107,70,193,0.3)', borderRadius: 20, padding: '4px 12px', cursor: 'pointer' }}>↺ Retry</button>
              </div>
            )}
          </div>
          <div style={{ padding: '14px 16px' }}>
            <p id="char-name" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 3px' }}>{node.character_name}</p>
            <p id="char-role" style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{node.character_title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
