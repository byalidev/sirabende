export function formatMessageReadState({ sentByMe, readAt }: { sentByMe: boolean; readAt: string | null | undefined }) {
  if (!sentByMe) return "none";
  return readAt ? "read" : "sent";
}

export function formatConversationTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Bugün";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) return "Bugün";
  if (diffHours < 48) return "Dün";

  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long" }).format(date);
}

export function getMessageDateLabel(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Bugün";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long" }).format(date);
}
