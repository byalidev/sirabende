export function MyTurnLoader() {
  return (
    <div className="my-turn-loader-shell" role="status" aria-live="polite" aria-label="Yükleniyor">
      <div className="my-turn-loader" aria-hidden="true">
        <span className="my-turn-loader-ring my-turn-loader-ring-a" />
        <span className="my-turn-loader-ring my-turn-loader-ring-b" />
        <span className="my-turn-loader-ring my-turn-loader-ring-c" />
      </div>
    </div>
  );
}
