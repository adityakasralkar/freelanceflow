import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import {
  Home,
  Folder,
  Receipt,
  User,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn, getInitials } from '../../utils';

const NAV_ITEMS = [
  { to: '/client/dashboard', label: 'Dashboard',   icon: Home },
  { to: '/client/projects',  label: 'My Projects', icon: Folder },
  { to: '/client/invoices',  label: 'Invoices',    icon: Receipt },
  { to: '/client/dashboard', label: 'Profile',     icon: User }, // profile route TBD
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
    <aside
      className="flex h-screen shrink-0 flex-col border-r border-[var(--line)] bg-[#fbfcfe] px-3 pb-4 pt-[18px]"
      style={{ width: 232 }}
    >
      <div className="flex items-start gap-2 px-2 pb-[18px]">
        <div className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[7px] bg-[var(--green)] text-[13px] font-extrabold text-white">
          F
        </div>
        <div>
          <div className="text-[16px] font-extrabold tracking-[-0.01em] text-[var(--text)]">
            Freelance<span className="text-[var(--green)]">Flow</span>
          </div>
          <div className="text-[11px] font-medium text-[var(--muted)]">
            Client Portal
          </div>
        </div>
      </div>

      <div className="mx-2.5 mb-1.5 mt-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--faint)]">
        Client
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = path === item.to || path.startsWith(item.to + '/');
          return (
            <Link
              key={`${item.to}-${idx}`}
              to={item.to}
              className={cn(
                'group flex items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-[var(--green-soft)] text-[var(--green-dark)] font-semibold'
                  : 'text-[var(--muted)] hover:bg-[#f1f3f6] hover:text-[var(--text)]'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-[var(--green)]' : 'text-[var(--faint)]'
                )}
                strokeWidth={1.75}
              />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--line)] pt-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[#f1f3f6] cursor-pointer">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}
          >
            {getInitials(user?.name) || 'C'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-[var(--text)]">
              {user?.name || 'Client'}
            </div>
            <div className="truncate text-[11px] text-[var(--muted)]">
              {user?.email}
            </div>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-[var(--faint)]" strokeWidth={1.5} />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-[7px] px-2.5 py-1.5 text-[12px] text-[var(--muted)] transition-colors hover:bg-[#f1f3f6] hover:text-[var(--red)]"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} /> Sign out
        </button>
      </div>
    </aside>
  );
}
