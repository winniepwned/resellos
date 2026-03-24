import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import type { Notification } from "@/types";

interface Props { onClose: () => void; }

export function NotificationPanel({ onClose }: Props) {
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const notifications = data?.notifications ?? [];

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b p-3">
        <h3 className="text-sm font-semibold">Benachrichtigungen</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Schliessen</button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">Keine Benachrichtigungen.</p>
        ) : (
          notifications.map((n: Notification) => (
            <button
              key={n.id}
              onClick={() => { if (!n.is_read) markRead.mutate(n.id); }}
              className={`w-full border-b p-3 text-left hover:bg-accent ${n.is_read ? "opacity-60" : ""}`}
            >
              <p className="text-sm font-medium">{n.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
