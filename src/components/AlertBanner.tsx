import { Bell, Loader2 } from "lucide-react";

interface AlertBannerProps {
  message: string;
}

export const AlertBanner = ({ message }: AlertBannerProps) => {
  if (!message) return null;

  return (
    <div className="p-4 rounded-xl glass-card border border-warning/30 animate-scale-in">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-warning animate-pulse" />
        <span className="flex-1 text-foreground">{message}</span>
        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
      </div>
    </div>
  );
};
