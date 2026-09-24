export type FeedbackCooldownEntry = {
  createdAt: Date | string;
};

export const FEEDBACK_INTERVAL_MS = 10 * 60 * 1000;

export function checkFeedbackCooldown(entries: FeedbackCooldownEntry[], now = new Date()) {
  if (!entries.length) return;

  const latest = entries
    .map((entry) => new Date(entry.createdAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => right.getTime() - left.getTime())[0];

  if (!latest) return;

  const diffMs = now.getTime() - latest.getTime();
  if (diffMs < FEEDBACK_INTERVAL_MS) {
    const remainingMs = FEEDBACK_INTERVAL_MS - diffMs;
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    throw new Error(`Çok sık geri bildirim gönderdiniz. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.`);
  }
}
