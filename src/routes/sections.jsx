import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const RolesPage = lazy(() => import('src/pages/roles'));
export const PermissionsPage = lazy(() => import('src/pages/permissions'));
export const RoomsPage = lazy(() => import('src/pages/rooms'));
export const TasksPage = lazy(() => import('src/pages/tasks'));
export const EmployeeTaskPage = lazy(() => import('src/pages/employeetaskPage'));


// ----------------------------------------------------------------------

export default function Router() {
  const role = localStorage.getItem('role');
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
      index: true
    },
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <IndexPage /> },
        // { element: <IndexPage />, index: true },
        { path: 'users', element: role === "admin" ? <UserPage /> : <Page404 />},
        { path: 'roles', element: role === "admin" ? <RolesPage /> : <Page404 />},
        { path: 'permissions', element: role === "admin" ? <PermissionsPage /> : <Page404 />},
        { path: 'rooms', element: <RoomsPage /> },
        { path: 'tasks', element: role === "admin" ? <TasksPage /> : <EmployeeTaskPage />},
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'dashboard',
      element: <IndexPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
