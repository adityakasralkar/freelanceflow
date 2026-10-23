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
    <aside className="pl-side shrink-0" style={{ width: 248 }}>
      {/* Brand */}
      <div className="flex items-start gap-[11px] px-2 pb-5">
        <div className="pl-brand-mark shrink-0">F</div>
        <div>
          <div className="pl-brand-name">
            Freelance<span>Flow</span>
          </div>
          <div className="text-[11px] font-medium text-[var(--muted)]">
            Client Portal
          </div>
        </div>
      </div>

      <div className="pl-side-label">Client</div>

      <nav className="pl-nav">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = path === item.to || path.startsWith(item.to + '/');
          return (
            <Link
              key={`${item.to}-${idx}`}
              to={item.to}
              className={cn('pl-nav-item', isActive && idx !== 3 && 'active')}
            >
              <span className="ic">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </span>
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pl-side-foot">
        <div className="pl-user">
          <div className="pl-ava b">{getInitials(user?.name) || 'C'}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-[var(--text)]">
              {user?.name || 'Client'}
            </div>
            <div className="truncate text-[11px] text-[var(--muted)]">
              {user?.email}
            </div>
          </div>
          <ChevronsUpDown className="h-[15px] w-[15px] text-[var(--faint)]" strokeWidth={1.5} />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-[12px] text-[var(--muted)] transition-colors hover:bg-[var(--panel-soft)] hover:text-[var(--red)]"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} /> Sign out
        </button>
      </div>
    </aside>
  );
}
