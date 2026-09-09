"use client";

import Link from "next/link";
import { useState } from "react";
import type { NotificationView } from "../../server/notifications/repository";

function notificationHref(notification: NotificationView) {
  return notification.type === "NEW_MESSAGE" ? "/mesajlar" : "/panel";
}

export function NotificationList({ initialNotifications }: { initialNotifications: NotificationView[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter((notification) => !notification.isRead).length;

  const markRead = async (id: string) => {
    const response = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    if (response.ok) setNotifications((items) => items.map((item) => item.id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item));
  };

  const markAllRead = async () => {
    const response = await fetch("/api/notifications/read-all", { method: "PATCH" });
    if (response.ok) setNotifications((items) => items.map((item) => ({ ...item, isRead: true, readAt: new Date().toISOString() })));
  };

  if (!notifications.length) return <div className="notification-empty"><span>✓</span><h2>Yeni bildirimin yok.</h2><p>Mesaj ve diğer hareketler burada görünecek.</p></div>;

  return <div className="notification-list-wrap">{unread > 0 ? <button className="notification-mark-all" type="button" onClick={markAllRead}>Tümünü okundu olarak işaretle</button> : null}<div className="notification-list">{notifications.map((notification) => <article className={`notification-item ${notification.isRead ? "read" : "unread"}`} key={notification.id}><span className="notification-dot" aria-hidden="true" /><div><Link href={notificationHref(notification)} onClick={() => { if (!notification.isRead) void markRead(notification.id); }}><strong>{notification.title}</strong><p>{notification.message}</p></Link><time dateTime={notification.createdAt}>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</time></div>{!notification.isRead ? <button type="button" onClick={() => void markRead(notification.id)}>Okundu</button> : null}</article>)}</div></div>;
}
