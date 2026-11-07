export default function LoadingState() {
  return (
    <div className="main-card" style={{ maxWidth: 760, width: '100%', padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="shimmer" style={{ height: 24, width: '40%', borderRadius: 8 }} />
      <div className="shimmer" style={{ height: 36, width: '70%', borderRadius: 8 }} />
      <div className="shimmer" style={{ height: 80, borderRadius: 8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="shimmer" style={{ height: 48, borderRadius: 8 }} />
          <div className="shimmer" style={{ height: 48, borderRadius: 8 }} />
        </div>
        <div className="shimmer" style={{ borderRadius: 12, height: 240 }} />
      </div>
    </div>
  );
}
