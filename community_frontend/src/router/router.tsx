import { lazy } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import ForgetPassword from "../views/forgetpassword/ForgetPassword";
import DepartmentInfo from "../views/infomanage/DepartmentInfo";
import PostInfo from "../views/infomanage/PostInfo";
import Login from "../views/login/Login";
import SignUp from "../views/signup/SignUp";
import { useAuthState } from "../context/auth";
// import Main from "../views/main/Main";

const Main = lazy(() => import("../views/main/Main"));

const router = createBrowserRouter([
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: <SignUp />,
    path: "/signup",
  },
  {
    element: <ForgetPassword />,
    path: "/forget",
  },
  {
    element: (
      <Layout>
        <Main />
      </Layout>
    ),
    path: "/app/dashboard",
  },
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    path: "/app/infomanage",
    children: [
      {
        element: <PostInfo />,
        path: "post",
        index: true,
      },
      {
        element: <DepartmentInfo />,
        path: "department",
      },
    ],
  },
]);

export default router;
