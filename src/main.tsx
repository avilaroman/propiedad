import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { PropertiesPage } from '@/pages/PropertiesPage';
import { MapPage } from '@/pages/MapPage';
import { AppLayout } from './components/layout/AppLayout';
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout container><HomePage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/properties",
    element: <AppLayout container><PropertiesPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/map",
    element: <AppLayout className="h-screen py-0" contentClassName="h-full flex flex-col"><MapPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)