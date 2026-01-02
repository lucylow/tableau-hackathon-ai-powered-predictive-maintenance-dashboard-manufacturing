import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Factory, 
  BarChart3, 
  Wrench, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Factory, label: "Equipment", path: "/equipment" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Wrench, label: "Maintenance", path: "/maintenance" },
  { icon: Bell, label: "Alerts", path: "/alerts", badge: 3 },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">PredictAI</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-secondary/80",
                  isActive && "bg-primary/10 text-primary border border-primary/20",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!collapsed && (
                  <span className={cn("flex-1", isActive && "font-medium")}>{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("w-full", collapsed && "px-2")}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-16" : "ml-64"
      )}>
        {children}
      </main>
    </div>
  );
};
