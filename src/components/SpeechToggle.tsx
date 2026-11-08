interface Props {
  enabled: boolean;
  onToggle: () => void;
}

export default function SpeechToggle({ enabled, onToggle }: Props) {
  return (
    <button
      id="speech-toggle"
      onClick={onToggle}
      title={enabled ? 'Mute narration' : 'Enable narration'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border2)',
        background: enabled ? 'rgba(107,70,193,0.08)' : 'var(--surface2)',
        color: enabled ? 'var(--purple)' : 'var(--text-3)',
        cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
      }}
    >
      {enabled ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  );
}
