import { lazy } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import ChangePassword from "../views/changepassword/ChangePassword";
import DepartmentInfo from "../views/infomanage/DepartmentInfo";
import PostInfo from "../views/infomanage/PostInfo";
import Login from "../views/login/Login";
import SignUp from "../views/signup/SignUp";
import { useAuthState } from "../context/auth";
import StuMain from "../views/stuViews/main/StuMain";
import PostDepartment from "../views/stuViews/department/PostDepartment";
import StuPersonalInfo from "../views/stuViews/person/StuPersonalInfo";
import DepartmentDetail from "../views/stuViews/department/DepartmentDetail";
import DepartmentManage from "../views/headerViews/manage/DepartmentManage";
import PersonManage from "../views/headerViews/manage/PersonManage";
import ActivityManage from "../views/headerViews/manage/ActivityManage";
import Judge from "../views/headerViews/fileManage/Judge";
import FileManage from "../views/headerViews/fileManage/FileManage";
import UserManage from "../views/Admin/LevelManage/UserManage";
import RealDepartment from "../views/stuViews/department/RealDepartment";
import ResourceView from "../views/stuViews/Resource/ResourceView";
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
  // {
  //   element: <ForgetPassword />,
  //   path: "/forget",
  // },
  {
    element: <ChangePassword />,
    path: "/changepassword",
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
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    path: "/stu",
    children: [
      {
        element: <StuMain />,
        index: true,
        path: "dashboard",
      },
      {
        element: <PostDepartment />,
        path: "postdepartments",
      },
      {
        element: <StuPersonalInfo />,
        path: "myinfo",
      },
      {
        element: <DepartmentDetail />,
        path: "department/:id",
      },
    ],
  },
  {
    element: (
      <Layout>
        <DepartmentManage />
      </Layout>
    ),
    path: "app/header/departmentmanage",
  },
  {
    element: (
      <Layout>
        <ActivityManage />
      </Layout>
    ),
    path: "app/header/departmentmanage/activity",
  },
  {
    element: (
      <Layout>
        <PersonManage />
      </Layout>
    ),
    path: "app/header/departmentmanage/person",
  },
  {
    element: (
      <Layout>
        <Judge />
      </Layout>
    ),
    path: "/app/filemanage/judge",
  },
  {
    element: (
      <Layout>
        <FileManage />
      </Layout>
    ),
    path: "/app/filemanage/manage",
  },
  {
    element: (
      <Layout>
        <UserManage />
      </Layout>
    ),
    path: "/app/level",
  },
  {
    element: (
      <Layout>
        <RealDepartment />
      </Layout>
    ),
    path: "/stu/department/main/:id",
  },
  {
    element: (
      <Layout>
        <ResourceView />
      </Layout>
    ),
    path: "/stu/department/resources/:id",
  },
]);

export default router;
