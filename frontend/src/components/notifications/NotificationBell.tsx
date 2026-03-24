import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useNotifications();
  const unreadCount = data?.unread_count ?? 0;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative rounded-md p-2 hover:bg-accent">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
