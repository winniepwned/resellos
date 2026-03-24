import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sourcing", label: "Sourcing", icon: Search },
  { to: "/inventory", label: "Inventar", icon: Package },
  { to: "/settings", label: "Einstellungen", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("flex flex-col border-r bg-card transition-all duration-200", collapsed ? "w-16" : "w-56")}>
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && <span className="text-lg font-bold text-primary">ResellOS</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded p-1 hover:bg-accent">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
