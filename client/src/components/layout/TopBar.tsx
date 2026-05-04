import { Bell } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../shared/Avatar';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#E5E9F0] bg-white px-6">
      <div>
        <h1 className="text-base font-semibold text-[#111827]">{title}</h1>
        {subtitle && <p className="text-xs text-[#98A2B3]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button
          type="button"
          className="rounded-lg p-2 text-[#667085] transition-colors hover:bg-[#F3F6FA] hover:text-[#111827]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <Avatar name={user?.name} size="md" />
      </div>
    </header>
  );
}
