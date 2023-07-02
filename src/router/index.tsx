import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import PrivateRoute from "@/components/PrivateRoute";

import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import ForgotPage from "@/pages/Forgot";
import ModulePage from "@/pages/Module";
import ErrorPage from "@/pages/Error";

const routes = [
  {
    path: "/",
    element: HomePage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/module/:id?",
    element: ModulePage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/login",
    element: LoginPage,
    layout: DefaultLayout,
  },
  {
    path: "/forgot",
    element: ForgotPage,
    layout: DefaultLayout,
  },
  {
    path: "*",
    element: ErrorPage,
    layout: DefaultLayout,
  },
].map((route) => {
  const Layout = route.layout || DefaultLayout;
  if (route.private) {
    return {
      ...route,
      element: (
        <PrivateRoute>
          <Layout>
            <route.element />
          </Layout>
        </PrivateRoute>
      ),
    };
  }
  return {
    ...route,
    element: (
      <Layout>
        <route.element />
      </Layout>
    ),
  };
});

const router = createBrowserRouter(routes);
export default router;
