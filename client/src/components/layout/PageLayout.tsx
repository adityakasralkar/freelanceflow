import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import ClientSidebar from './ClientSidebar';
import TopBar from './TopBar';
import { useAuthStore } from '../../store/authStore';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function PageLayout({ title, subtitle, actions, children }: PageLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const SidebarComponent = user?.role === 'client' ? ClientSidebar : Sidebar;

  return (
    <div className="flex h-screen bg-[#F6F7F9]">
      <SidebarComponent />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} subtitle={subtitle} actions={actions} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
