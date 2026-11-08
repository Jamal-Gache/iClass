import SpeechToggle from './SpeechToggle';

interface HeaderProps {
  simTitle: string;
  progress: number;
  slideLabel: string;
  timerSecs: number;
  lang: string | null;
  ethnicity: string | null;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function Header({ simTitle, progress, slideLabel, timerSecs, lang, ethnicity, speechEnabled, onToggleSpeech }: HeaderProps) {
  return (
    <header className="header-bar" style={{ height: 56, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div className="logo-mark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)', letterSpacing: '-0.3px' }}>SchoolSims</span>
        <div style={{ width: 1, height: 18, background: 'var(--border2)', flexShrink: 0 }} />
        <span id="hdr-sim-title" style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{simTitle}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 200, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span id="hdr-pct" style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{progress}%</span>
          <span id="hdr-slide-label" style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 600 }}>{slideLabel}</span>
        </div>
        <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
          <div id="progress-fill" style={{ width: `${progress}%`, height: '100%', borderRadius: 9999 }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {lang && <span id="badge-lang" className="step-badge" style={{ color: 'var(--text-2)', background: 'var(--surface2)', borderColor: 'var(--border2)' }}>{lang}</span>}
        {ethnicity && <span id="badge-eth" className="step-badge">{ethnicity}</span>}
        <SpeechToggle enabled={speechEnabled} onToggle={onToggleSpeech} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span id="timer" className="tabular" style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', fontFamily: "'DM Mono', monospace" }}>{fmt(timerSecs)}</span>
        </div>
      </div>
    </header>
  );
}
