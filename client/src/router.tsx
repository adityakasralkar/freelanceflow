import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import type { UserRole } from './types';
import { useAuthStore } from './store/authStore';

import FreelancerLoginPage from './pages/auth/FreelancerLoginPage';
import ClientLoginPage from './pages/auth/ClientLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CashFlowPage from './pages/dashboard/CashFlowPage';
import ProposalsPage from './pages/proposals/ProposalsPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage';
import ClientsPage from './pages/clients/ClientsPage';
import ClientProfilePage from './pages/clients/ClientProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import ClientDashboardPage from './pages/client-portal/ClientDashboardPage';
import ClientProjectsPage from './pages/client-portal/ClientProjectsPage';
import ClientProjectDetailPage from './pages/client-portal/ClientProjectDetailPage';
import ClientInvoicesPage from './pages/client-portal/ClientInvoicesPage';
import ClientInvoiceDetailPage from './pages/client-portal/ClientInvoiceDetailPage';

// -----------------------------------------------------------------------------
// Route guard helper
// -----------------------------------------------------------------------------
function requireAuth(role: UserRole) {
  const state = useAuthStore.getState();
  if (!state.isAuthenticated || !state.user) {
    throw redirect({ to: role === 'client' ? '/client/login' : '/login' });
  }
  if (state.user.role !== role) {
    throw redirect({
      to: state.user.role === 'client' ? '/client/dashboard' : '/dashboard',
    });
  }
}

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
const rootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' });
  },
  component: () => null,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: FreelancerLoginPage,
});

const clientLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client/login',
  component: ClientLoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-email/$token',
  component: VerifyEmailPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Freelancer routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => requireAuth('freelancer'),
  component: DashboardPage,
});

const cashFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/cashflow',
  beforeLoad: () => requireAuth('freelancer'),
  component: CashFlowPage,
});

const proposalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proposals',
  beforeLoad: () => requireAuth('freelancer'),
  component: ProposalsPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  beforeLoad: () => requireAuth('freelancer'),
  component: ProjectsPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  beforeLoad: () => requireAuth('freelancer'),
  component: ProjectDetailPage,
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices',
  beforeLoad: () => requireAuth('freelancer'),
  component: InvoicesPage,
});

const invoiceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices/$invoiceId',
  beforeLoad: () => requireAuth('freelancer'),
  component: InvoiceDetailPage,
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  beforeLoad: () => requireAuth('freelancer'),
  component: ClientsPage,
});

const clientProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/$clientId',
  beforeLoad: () => requireAuth('freelancer'),
  component: ClientProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  beforeLoad: () => requireAuth('freelancer'),
  component: SettingsPage,
});

// Client portal routes
const clientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client/dashboard',
  beforeLoad: () => requireAuth('client'),
  component: ClientDashboardPage,
});

const clientProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client/projects',
  beforeLoad: () => requireAuth('client'),
  component: ClientProjectsPage,
});

const clientProjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client/projects/$projectId',
  beforeLoad: () => requireAuth('client'),
  component: ClientProjectDetailPage,
});

const clientInvoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client/invoices',
  beforeLoad: () => requireAuth('client'),
  component: ClientInvoicesPage,
});

const clientInvoiceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client/invoices/$invoiceId',
  beforeLoad: () => requireAuth('client'),
  component: ClientInvoiceDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  clientLoginRoute,
  registerRoute,
  verifyEmailRoute,
  forgotPasswordRoute,
  dashboardRoute,
  cashFlowRoute,
  proposalsRoute,
  projectsRoute,
  projectDetailRoute,
  invoicesRoute,
  invoiceDetailRoute,
  clientsRoute,
  clientProfileRoute,
  settingsRoute,
  clientDashboardRoute,
  clientProjectsRoute,
  clientProjectDetailRoute,
  clientInvoicesRoute,
  clientInvoiceDetailRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
