import { Inbox as InboxIcon } from "@mui/icons-material";
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import classnames from "classnames";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

// styles
import useStyles from "./styles";

// components
import Dot from "./Dot";
import { UserStoreContext } from "../../../store/UserStore";
import RoleEnum from "../../../types/enums/RoleEnum";
import LevelEnum from "../../../types/enums/LevelEnum";

export default function SidebarLink({
  link,
  icon,
  label,
  children,
  location,
  isSidebarOpened,
  nested,
  type,
  headerOnly,
  adminOnly,
}: any) {
  var classes = useStyles();

  const userStore = useContext(UserStoreContext);
  const user = userStore.user;

  // local
  var [isOpen, setIsOpen] = useState(false);
  var isLinkActive =
    link &&
    (location.pathname === link || location.pathname.indexOf(link) !== -1);

  if (type === "title")
    return (
      <Typography
        className={classnames(classes.linkText, classes.sectionTitle, {
          [classes.linkTextHidden]: !isSidebarOpened,
        })}
      >
        {label}
      </Typography>
    );

  if (type === "divider") return <Divider className={classes.divider} />;
  if (link && link.includes("http")) {
    return (
      <ListItem
        button
        className={classes.link}
        classes={{
          root: classnames(classes.link, {
            [classes.linkActive]: isLinkActive && !nested,
            [classes.linkNested]: nested,
          }),
        }}
        disableRipple
      >
        <a className={classes.externalLink} href={link}>
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
          >
            {nested ? <Dot color={isLinkActive && "primary"} /> : icon}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classnames(classes.linkText, {
                [classes.linkTextActive]: isLinkActive,
                [classes.linkTextHidden]: !isSidebarOpened,
              }),
            }}
            primary={label}
          />
        </a>
      </ListItem>
    );
  }
  if (!children)
    return (
      (headerOnly && user?.level !== LevelEnum.HEADER) ||
      (adminOnly && user?.role !== RoleEnum.ADMIN) || (
        <ListItem
          button
          component={link && Link}
          to={link}
          className={classes.link}
          classes={{
            root: classnames(classes.link, {
              [classes.linkActive]: isLinkActive && !nested,
              [classes.linkNested]: nested,
            }),
          }}
          disableRipple
        >
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
          >
            {nested ? <Dot color={isLinkActive && "primary"} /> : icon}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classnames(classes.linkText, {
                [classes.linkTextActive]: isLinkActive,
                [classes.linkTextHidden]: !isSidebarOpened,
              }),
            }}
            primary={label}
          />
        </ListItem>
      )
    );

  return (
    (headerOnly && user?.level !== LevelEnum.HEADER) ||
    (adminOnly && user?.role !== RoleEnum.ADMIN) || (
      <>
        <ListItem
          button
          component={link && Link}
          onClick={toggleCollapse}
          className={classes.link}
          to={link}
          disableRipple
        >
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
          >
            {icon ? icon : <InboxIcon />}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classnames(classes.linkText, {
                [classes.linkTextActive]: isLinkActive,
                [classes.linkTextHidden]: !isSidebarOpened,
              }),
            }}
            primary={label}
          />
        </ListItem>
        {children && (
          <Collapse
            in={isOpen && isSidebarOpened}
            timeout="auto"
            unmountOnExit
            className={classes.nestedList}
          >
            <List component="div" disablePadding>
              {children.map((childrenLink: any) => (
                <SidebarLink
                  key={childrenLink && childrenLink.link}
                  location={location}
                  isSidebarOpened={isSidebarOpened}
                  classes={classes}
                  nested
                  {...childrenLink}
                />
              ))}
            </List>
          </Collapse>
        )}
      </>
    )
  );

  // ###########################################################

  function toggleCollapse(e: any) {
    if (isSidebarOpened) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  }
}
