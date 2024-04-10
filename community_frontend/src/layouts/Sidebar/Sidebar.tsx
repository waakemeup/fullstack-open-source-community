import { useState, useEffect } from "react";
import { Drawer, IconButton, List, Theme } from "@mui/material";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  ForumOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./SidebarLink/SidebarLink";
import Dot from "./SidebarLink/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/layout";
import { useLocation, useNavigate } from "react-router";

const structure = [
  {
    id: 0,
    label: "系统首页",
    // headerOnly: true,
    // adminOnly: true,
    link: "/app/dashboard",
    icon: <HomeIcon />,
  },
  // {
  //   id: 15,
  //   label: "社团首页",
  //   link: "/stu/department/main/main",
  //   icon: <HomeIcon />,
  // },
  // {
  //   id: 16,
  //   label: "话题",
  //   link: "/stu/department/main/main/discuss",
  //   icon: <ForumOutlined />,
  //   children: [
  //     {
  //       label: "话题讨论",
  //       link: "/stu/department/main/main/discuss",
  //     },
  //     {
  //       label: "组队参赛",
  //       link: "/stu/department/main/main/game",
  //     },
  //     {
  //       label: "公开求助",
  //       link: "/stu/department/main/main/help",
  //     },
  //   ],
  // },
  {
    id: 1,
    label: "信息管理",
    link: "/app/infomanage",
    icon: <TypographyIcon />,
    adminOnly: true,
    children: [
      {
        label: "公告信息",
        link: "/app/infomanage/post",
      },
      {
        label: "社团信息",
        link: "/app/infomanage/department",
      },
    ],
  },
  {
    id: 2,
    label: "社团管理",
    link: "/app/header/departmentmanage",
    icon: <TableIcon />,
    headerOnly: true,
    children: [
      {
        label: "成员管理",
        link: "/app/header/departmentmanage/person",
      },
      {
        label: "活动管理",
        link: "/app/header/departmentmanage/activity",
      },
      // {
      //   label: "我的社团",
      //   link: "/app/header/departmentmanage/mydepartment",
      // },
    ],
  },
  {
    id: 3,
    label: "资源管理",
    link: "/app/filemanage",
    icon: <NotificationsIcon />,
    headerOnly: true,
    children: [
      {
        label: "资源审批",
        link: "/app/filemanage/judge",
      },
      {
        label: "资源管理",
        link: "/app/filemanage/manage",
      },
    ],
  },
  {
    id: 4,
    label: "用户权限",
    link: "/app/level",
    adminOnly: true,
    icon: <UIElementsIcon />,
    // children: [
    //   { label: "权限管理", link: "/app/level/level" },
    //   { label: "用户管理", link: "/app/level/user" },
    // ],
  },
  { id: 5, type: "divider" },
  { id: 6, type: "title", label: "HELP" },
  {
    id: 7,
    label: "Library",
    link: "https://flatlogic.com/templates",
    icon: <LibraryIcon />,
  },
  {
    id: 8,
    label: "Support",
    link: "https://flatlogic.com/forum",
    icon: <SupportIcon />,
  },
  {
    id: 9,
    label: "FAQ",
    link: "https://flatlogic.com/forum",
    icon: <FAQIcon />,
  },
  { id: 10, type: "divider" },
  { id: 11, type: "title", label: "PROJECTS" },
  {
    id: 12,
    label: "My recent",
    link: "",
    icon: <Dot size="small" color="warning" />,
  },
  {
    id: 13,
    label: "Starred",
    link: "",
    icon: <Dot size="small" color="primary" />,
  },
  {
    id: 14,
    label: "Background",
    link: "",
    icon: <Dot size="small" color="secondary" />,
  },
];

function Sidebar() {
  var classes = useStyles();
  var theme = useTheme<Theme>();
  // const navigate = useNavigate();
  const location = useLocation();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    // console.log(theme.mixins.toolbar);
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default Sidebar;
