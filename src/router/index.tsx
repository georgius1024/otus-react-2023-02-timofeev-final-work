import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import PrivateRoute from "@/components/PrivateRoute";

import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ForgotPage from "@/pages/Forgot";
import ProfilePage from "@/pages/ProfilePage";
import ModulePage from "@/pages/Module";
import StudentsPage from "@/pages/Students";
import LearningPage from "@/pages/Learning";
import CoursePage from "@/pages/Learning/CoursePage";
import LessonPage from "@/pages/Learning/LessonPage";
import LessonStepPage from "@/pages/Learning/LessonStepPage";
import RepetitionPage from "@/pages/Learning/RepetitionPage";
import RepetitionStepPage from "@/pages/Learning/RepetitionStepPage";
import RepetitionAddWordOrPhrasePage from "@/pages/Learning/RepetitionAddWordOrPhrasePage";
import StatsPage from "@/pages/StatsPage";
import ErrorPage from "@/pages/Error";

const routes = [
  {
    path: "/",
    element: HomePage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/learning",
    element: LearningPage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/learning/course/:id",
    element: CoursePage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/learning/course/:course/lesson/:id",
    element: LessonPage,
    layout: DefaultLayout,
    private: true,
    children: [
      {
        path: "step/:step",
        element: <LessonStepPage/>,
        private: true,
      },
    ],
  },
  {
    path: "/learning/repetition/add",
    element: RepetitionAddWordOrPhrasePage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/learning/repetition",
    element: RepetitionPage,
    layout: DefaultLayout,
    private: true,
    children: [
      {
        path: ":step",
        element: <RepetitionStepPage/>,
        private: true,
      },
    ],
  },
  {
    path: "/stats",
    element: StatsPage,
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
    path: "/students",
    element: StudentsPage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/profile",
    element: ProfilePage,
    layout: DefaultLayout,
    private: true,
  },
  {
    path: "/login",
    element: LoginPage,
    layout: DefaultLayout,
  },
  {
    path: "/register",
    element: RegisterPage,
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
  const children = route.children
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
      children
    };
  }
  return {
    ...route,
    element: (
      <Layout>
        <route.element />
      </Layout>
    ),
    children
  };
});

const router = createBrowserRouter(routes);
export default router;
