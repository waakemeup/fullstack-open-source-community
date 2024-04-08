import {
  Person as AccountIcon,
  ArrowBack as ArrowBackIcon,
  MailOutline as MailIcon,
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  Search as SearchIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Fab,
  IconButton,
  InputBase,
  Link,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";

// styles
import useStyles from "./styles";

// components
import Notification from "../Notification/Notification";
import UserAvatar from "../UserAvatar/UserAvatar";
import { Badge, Typography } from "../Wrappers/Wrappers";

// context
import { useLocation, useNavigate } from "react-router";
import { signOut, useAuthDispatch, useAuthState } from "../../context/auth";
import {
  toggleSidebar,
  useLayoutDispatch,
  useLayoutState,
} from "../../context/layout";
import { User } from "../../types/User";
import { UserStoreContext } from "../../store/UserStore";

const messages = [
  {
    id: 0,
    variant: "warning",
    name: "Jane Hew",
    message: "Hey! How is it going?",
    time: "9:32",
  },
  {
    id: 1,
    variant: "success",
    name: "Lloyd Brown",
    message: "Check out my new Dashboard",
    time: "9:18",
  },
  {
    id: 2,
    variant: "primary",
    name: "Mark Winstein",
    message: "I want rearrange the appointment",
    time: "9:15",
  },
  {
    id: 3,
    variant: "secondary",
    name: "Liana Dutti",
    message: "Good news from sale department",
    time: "9:09",
  },
];

const notifications = [
  { id: 0, color: "warning", message: "Check out this awesome ticket" },
  {
    id: 1,
    color: "success",
    type: "info",
    message: "What is the best way to get ...",
  },
  {
    id: 2,
    color: "secondary",
    type: "notification",
    message: "This is just a simple notification",
  },
  {
    id: 3,
    color: "primary",
    type: "e-commerce",
    message: "12 new orders has arrived today",
  },
];
// TODO:写学生前台
export default function Header(props: any) {
  var classes = useStyles();
  // console.log(classNames(classes.searchFocused));

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useAuthDispatch();
  const { user, authenticated, loading } = useAuthState();

  // local
  var [mailMenu, setMailMenu] = useState(null);
  var [isMailsUnread, setIsMailsUnread] = useState(true);
  var [notificationsMenu, setNotificationsMenu] = useState(null);
  var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const userStore = useContext(UserStoreContext);

  useEffect(() => {
    if (!userStore.authenticated) navigate("/login");
  }, [authenticated, loading, user]);

  const link1Active = location.pathname === "/stu/dashboard";
  const link2Active = location.pathname === "/stu/postdepartments";
  const link3Active = location.pathname === "/stu/myinfo";

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
      sx={{ backgroundColor: "#536DFE" }}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          开源社团管理系统
        </Typography>
        {userStore.isUserAndStudent && (
          <Box
            flex="row"
            alignItems={"center"}
            whiteSpace={"nowrap"}
            overflow="scroll"
          >
            <Link
              sx={{
                color: "white",
              }}
              underline="hover"
              component={Button}
              onClick={() => navigate("/stu/dashboard")}
              className={link1Active ? classes.linkActive : ""}
            >
              首页
            </Link>
            <Link
              sx={{
                color: "white",
              }}
              underline={"hover"}
              component={Button}
              className={link2Active ? classes.linkActive : ""}
              onClick={() => {
                navigate("/stu/postdepartments");
              }}
            >
              申请的社团
            </Link>
            <Link
              sx={{
                color: "white",
              }}
              underline="hover"
              component={Button}
              onClick={() => navigate("/stu/myinfo")}
              className={link3Active ? classes.linkActive : ""}
            >
              个人中心
            </Link>
          </Box>
        )}
        <div className={classes.grow} />
        <div
          className={classNames(classes.search, {
            [classes.searchFocused]: isSearchOpen,
          })}
        >
          <div
            className={classNames(classes.searchIcon, {
              [classes.searchIconOpened]: isSearchOpen,
            })}
            onClick={() => setSearchOpen(!isSearchOpen)}
          >
            <SearchIcon
              sx={{ fontSize: 30 }}
              classes={{ root: classes.headerIcon }}
            />
          </div>
          <InputBase
            placeholder={isSearchOpen ? "Search" : ""}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            hidden={!isSearchOpen}
          />
        </div>
        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={(e) => {
            // @ts-ignore
            setNotificationsMenu(e.currentTarget);
            setIsNotificationsUnread(false);
          }}
          className={classes.headerMenuButton}
        >
          <Badge
            badgeContent={isNotificationsUnread ? notifications.length : null}
            color="warning"
          >
            <NotificationsIcon
              sx={{ fontSize: 30 }}
              classes={{ root: classes.headerIcon }}
            />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="notifications-menu"
          onClick={(e) => {
            // @ts-ignore
            setMailMenu(e.currentTarget);
            setIsMailsUnread(false);
          }}
          className={classes.headerMenuButton}
        >
          <Badge
            badgeContent={isMailsUnread ? messages.length : null}
            color="secondary"
          >
            <MailIcon
              sx={{ fontSize: 30 }}
              classes={{ root: classes.headerIcon }}
            />
          </Badge>
        </IconButton>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          // @ts-ignore
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon
            sx={{ fontSize: 30 }}
            classes={{ root: classes.headerIcon }}
          />
        </IconButton>
        <Menu
          id="mail-menu"
          open={Boolean(mailMenu)}
          anchorEl={mailMenu}
          onClose={() => setMailMenu(null)}
          MenuListProps={{ className: classes.headerMenuList }}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              New Messages
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="secondary"
            >
              {messages.length} New Messages
            </Typography>
          </div>
          {messages.map((message) => (
            <MenuItem key={message.id} className={classes.messageNotification}>
              <div className={classes.messageNotificationSide}>
                <UserAvatar color={message.variant} name={message.name} />
                <Typography size="sm" color="text" colorBrightness="secondary">
                  {message.time}
                </Typography>
              </div>
              <div
                className={classNames(
                  classes.messageNotificationSide,
                  classes.messageNotificationBodySide
                )}
              >
                <Typography weight="medium" gutterBottom>
                  {message.name}
                </Typography>
                <Typography color="text" colorBrightness="secondary">
                  {message.message}
                </Typography>
              </div>
            </MenuItem>
          ))}
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.sendMessageButton}
          >
            Send New Message
            <SendIcon className={classes.sendButtonIcon} />
          </Fab>
        </Menu>
        <Menu
          id="notifications-menu"
          open={Boolean(notificationsMenu)}
          anchorEl={notificationsMenu}
          onClose={() => setNotificationsMenu(null)}
          className={classes.headerMenu}
          disableAutoFocusItem
        >
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => setNotificationsMenu(null)}
              className={classes.headerMenuItem}
            >
              <Notification {...notification} typographyVariant="inherit" />
            </MenuItem>
          ))}
        </Menu>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              {userStore.user?.username || user?.username}
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="primary"
              href="https://flatlogic.com"
            >
              {userStore.user?.email || user?.email}
            </Typography>
          </div>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Profile
          </MenuItem>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Tasks
          </MenuItem>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Messages
          </MenuItem>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => {
                signOut(userDispatch);
                navigate("/login");
                userStore.logout();
              }}
            >
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
