import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Home, Folder, Receipt, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils';
import Avatar from '../shared/Avatar';

const NAV_ITEMS = [
  { to: '/client/dashboard', label: 'Dashboard', icon: Home },
  { to: '/client/projects', label: 'My Projects', icon: Folder },
  { to: '/client/invoices', label: 'My Invoices', icon: Receipt },
];

export default function ClientSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const path = location.pathname;

  function handleLogout() {
    logout();
    navigate({ to: '/client/login' });
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-[#E5E9F0] bg-white">
      <div className="border-b border-[#E5E9F0] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F9F72] text-white">
            <span className="text-sm font-bold">F</span>
          </div>
          <span className="text-base font-semibold text-[#111827]">
            Freelance<span className="text-[#0F9F72]">Flow</span>
          </span>
        </div>
        <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#98A2B3]">
          Client Portal
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = path === item.to || path.startsWith(item.to + '/');
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#EAF8F2] text-[#0F9F72]'
                      : 'text-[#667085] hover:bg-[#F3F6FA] hover:text-[#111827]'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 h-5 w-0.5 rounded-r bg-[#0F9F72]" />
                  )}
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#E5E9F0] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar name={user?.name} size="md" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-[#111827]">
              {user?.name || 'Client'}
            </div>
            <div className="truncate text-xs text-[#98A2B3]">{user?.email}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[#667085] transition-colors hover:bg-[#F3F6FA] hover:text-[#DC2626]"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} /> Logout
        </button>
      </div>
    </aside>
  );
}
