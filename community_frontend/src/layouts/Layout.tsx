import React, { useContext, useEffect } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

import { Box, IconButton, Link } from "@mui/material";
import classNames from "classnames";
import { useLayoutState } from "../context/layout";
import useStyles from "./styles";

import {
  mdiFacebook as FacebookIcon,
  mdiGithub as GithubIcon,
  mdiTwitter as TwitterIcon,
} from "@mdi/js";
import Icon from "@mdi/react";
import { UserStoreContext } from "../store/UserStore";
import { useLocation } from "react-router";

interface Props {
  children: JSX.Element;
}

const Layout: React.FC<Props> = ({ children }) => {
  const userStore = useContext(UserStoreContext);
  let classes = useStyles();
  let layoutState = useLayoutState();
  const location = useLocation();

  // console.log(
  //   location.pathname,
  //   location.pathname.startsWith("stu/department/main")
  // );

  return (
    <div className={classes.root}>
      <>
        <Header />
        {!userStore.isUserAndStudent && <Sidebar />}
        <div
          className={classNames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          {children}
          {/* <Outlet /> */}
          <Box
            mt={5}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <div>
              <Link
                color={"primary"}
                href={"https://flatlogic.com/"}
                target={"_blank"}
                className={classes.link}
              >
                Flatlogic
              </Link>
              <Link
                color={"primary"}
                href={"https://flatlogic.com/about"}
                target={"_blank"}
                className={classes.link}
              >
                About Us
              </Link>
              <Link
                color={"primary"}
                href={"https://flatlogic.com/blog"}
                target={"_blank"}
                className={classes.link}
              >
                Blog
              </Link>
            </div>
            <div>
              <Link
                href={"https://www.facebook.com/flatlogic"}
                target={"_blank"}
              >
                <IconButton aria-label="facebook">
                  <Icon path={FacebookIcon} size={1} color="#6E6E6E99" />
                </IconButton>
              </Link>
              <Link href={"https://twitter.com/flatlogic"} target={"_blank"}>
                <IconButton aria-label="twitter">
                  <Icon path={TwitterIcon} size={1} color="#6E6E6E99" />
                </IconButton>
              </Link>
              <Link href={"https://github.com/flatlogic"} target={"_blank"}>
                <IconButton aria-label="github" style={{ marginRight: -12 }}>
                  <Icon path={GithubIcon} size={1} color="#6E6E6E99" />
                </IconButton>
              </Link>
            </div>
          </Box>
        </div>
      </>
    </div>
  );
};

export default Layout;
