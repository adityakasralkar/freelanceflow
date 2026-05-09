import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import ClientSidebar from './ClientSidebar';
import TopBar from './TopBar';
import { useAuthStore } from '../../store/authStore';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string }[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  actions,
  breadcrumb,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
}: PageLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const SidebarComponent = user?.role === 'client' ? ClientSidebar : Sidebar;

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      <SidebarComponent />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          subtitle={subtitle}
          actions={actions}
          breadcrumb={breadcrumb}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
