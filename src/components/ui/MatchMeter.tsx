export function MatchMeter({ score, reasons }: { score: number; reasons?: string[] }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="match-meter">
      <div className="match-meter-row">
        <span className="badge badge-match">{clamped}% eşleşme</span>
        <span className="match-bar" aria-hidden="true">
          <span style={{ width: `${clamped}%` }} />
        </span>
      </div>
      {reasons?.length ? (
        <ul className="match-reasons">
          {reasons.slice(0, 4).map((reason) => <li key={reason}>✓ {reason}</li>)}
        </ul>
      ) : null}
    </div>
  );
}
