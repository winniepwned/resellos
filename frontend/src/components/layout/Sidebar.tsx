import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Search, Settings, ChevronLeft, ChevronRight, FileEdit, Globe, DollarSign, Archive, PackageOpen } from "lucide-react";
import { useItemsStore } from "@/stores/items.store";
import { useItems } from "@/hooks/useItems";

const mainNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sourcing", label: "Sourcing", icon: Search },
];

const bottomNav = [
  { to: "/settings", label: "Einstellungen", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { statusFilter, setStatusFilter } = useItemsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useItems();

  const draftCount = data?.items?.filter((i) => ["draft", "analyzing", "ready"].includes(i.status)).length || 0;
  const listedCount = data?.items?.filter((i) => i.status === "listed").length || 0;
  const soldCount = data?.items?.filter((i) => i.status === "sold").length || 0;

  const inventoryStatuses = [
    { id: "draft", label: "Entwürfe", icon: FileEdit, badge: draftCount },
    { id: "listed", label: "Online", icon: Globe, badge: listedCount },
    { id: "sold", label: "Verkauft", icon: DollarSign, badge: soldCount },
    { id: "archived", label: "Archiv", icon: Archive },
  ];

  const handleInventoryClick = (statusId: string) => {
    setStatusFilter(statusId);
    if (!location.pathname.startsWith("/inventory")) {
      navigate("/inventory");
    }
  };

  const isInventoryActive = (statusId: string) => {
    return location.pathname.startsWith("/inventory") && statusFilter === statusId;
  };

  return (
    <aside className={cn("flex flex-col border-r bg-card/60 backdrop-blur transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">ResellOS</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 hover:bg-accent text-muted-foreground transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col py-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/80 hover:text-accent-foreground",
                  isActive ? "bg-accent/80 text-foreground shadow-sm" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="mt-8 mb-2 px-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <PackageOpen className="h-3 w-3" />
              Inventar
            </h4>
          </div>
        )}
        
        <nav className={cn("space-y-0.5 px-3", collapsed && "mt-4")}>
          {inventoryStatuses.map((status) => {
            const isActive = isInventoryActive(status.id);
            return (
              <button
                key={status.id}
                onClick={() => handleInventoryClick(status.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/80 hover:text-accent-foreground group",
                  isActive ? "bg-accent/80 text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <status.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                  {!collapsed && <span className="truncate">{status.label}</span>}
                </div>
                {!collapsed && status.badge !== undefined && (
                  <span className="flex h-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-muted-foreground px-2 group-hover:bg-background group-hover:text-foreground transition-colors">
                    {status.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t">
        {bottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/80 hover:text-accent-foreground",
                isActive ? "bg-accent/80 text-foreground shadow-sm" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
