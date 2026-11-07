interface Props { title: string; body: string; retryLabel: string; onRetry: () => void; }

export default function ErrorState({ title, body, retryLabel, onRetry }: Props) {
  return (
    <div className="main-card slide-enter" style={{ maxWidth: 480, width: '100%', padding: 48, textAlign: 'center' }}>
      <div className="error-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', margin: '0 0 8px' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '0 0 24px', lineHeight: 1.6 }}>{body}</p>
      <button onClick={onRetry} className="btn-primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
        {retryLabel}
      </button>
    </div>
  );
}
