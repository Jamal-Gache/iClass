interface LeftRailProps {
  onBrief: () => void;
  onCast: () => void;
  onHelp: () => void;
  onReset: () => void;
  onToggleTestErr: () => void;
  testErr: boolean;
  briefTip: string;
  castTip: string;
  helpTip: string;
}

function RailBtn({ onClick, tip, children, className = '' }: { onClick: () => void; tip: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="has-tip" style={{ position: 'relative' }}>
      <button onClick={onClick} className={`rail-btn ${className}`} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </button>
      <div className="tip">{tip}</div>
    </div>
  );
}

export default function LeftRail({ onBrief, onCast, onHelp, onReset, onToggleTestErr, testErr, briefTip, castTip, helpTip }: LeftRailProps) {
  return (
    <aside className="rail-bar" style={{ width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 4, flexShrink: 0 }}>
      <RailBtn onClick={onBrief} tip={briefTip}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </RailBtn>
      <RailBtn onClick={onCast} tip={castTip}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </RailBtn>
      <RailBtn onClick={onHelp} tip={helpTip}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </RailBtn>
      <RailBtn onClick={onReset} tip="Reset" className="warn">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
      </RailBtn>

      <div style={{ flex: 1 }} />

      <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          id="test-err-btn"
          onClick={onToggleTestErr}
          style={{ fontSize: 10, fontWeight: 600, padding: '3px 6px', borderRadius: 6, border: '1px solid', cursor: 'pointer', background: testErr ? '#fef2f2' : 'var(--surface2)', color: testErr ? '#dc2626' : 'var(--text-3)', borderColor: testErr ? '#fecaca' : 'var(--border2)' }}
        >
          {testErr ? '🔴 Error ON' : '🧪 Test Error'}
        </button>
      </div>
    </aside>
  );
}
