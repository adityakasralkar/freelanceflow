import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import {
  Home,
  TrendingUp,
  FileText,
  Folder,
  Receipt,
  Users,
  Settings as SettingsIcon,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn, getInitials } from '../../utils';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  badge?: number | string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',           label: 'Dashboard',  icon: Home },
  { to: '/dashboard/cashflow',  label: 'Cash Flow',  icon: TrendingUp },
  { to: '/proposals',           label: 'Proposals',  icon: FileText },
  { to: '/projects',            label: 'Projects',   icon: Folder },
  { to: '/invoices',            label: 'Invoices',   icon: Receipt },
  { to: '/clients',             label: 'Clients',    icon: Users },
  { to: '/settings',            label: 'Settings',   icon: SettingsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const path = location.pathname;

  function handleLogout() {
    logout();
    navigate({ to: '/login' });
  }

  return (
    <aside className="pl-side shrink-0" style={{ width: 248 }}>
      {/* Brand */}
      <div className="pl-brand">
        <div className="pl-brand-mark">F</div>
        <div className="pl-brand-name">
          Freelance<span>Flow</span>
        </div>
      </div>

      {/* Nav label */}
      <div className="pl-side-label">Workspace</div>

      {/* Nav */}
      <nav className="pl-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/dashboard'
              ? path === '/dashboard'
              : path === item.to || path.startsWith(item.to + '/');
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn('pl-nav-item', isActive && 'active')}
            >
              <span className="ic">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && <span className="pl-nav-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User card at bottom */}
      <div className="pl-side-foot">
        <div className="pl-user">
          <div className="pl-ava">{getInitials(user?.name) || 'U'}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-[var(--text)]">
              {user?.name || 'User'}
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
