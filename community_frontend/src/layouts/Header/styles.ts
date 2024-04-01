import { makeStyles, createStyles } from "@mui/styles";
import { Theme, alpha } from "@mui/material/styles";

export default makeStyles((theme: Theme) =>
  createStyles({
    logotype: {
      color: "white",
      marginLeft: theme.spacing(2.5) + "!important",
      marginRight: theme.spacing(2.5) + "!important",
      fontWeight: 500,
      fontSize: 18,
      whiteSpace: "nowrap",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    appBar: {
      width: "100vw",
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    toolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    grow: {
      flexGrow: 1,
    },
    search: {
      position: "relative",
      borderRadius: 100,
      paddingLeft: theme.spacing(2.5),
      width: 16,
      backgroundColor: alpha(theme.palette.common.black, 0),
      transition: theme.transitions.create(["background-color", "width"]),
      "&:hover": {
        cursor: "pointer",
        backgroundColor: alpha(theme.palette.common.black, 0.08),
      },
    },
    searchFocused: {
      backgroundColor: alpha(theme.palette.common.black, 0.08),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 250,
      },
    },
    searchIcon: {
      width: 36,
      right: 0,
      height: "100%",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: theme.transitions.create("right"),
      "&:hover": {
        cursor: "pointer",
      },
    },
    searchIconOpened: {
      right: theme.spacing(1.25),
    },
    inputRoot: {
      color: "inherit",
      width: "100%",
    },
    inputInput: {
      height: 36,
      padding: 0,
      paddingRight: 36 + theme.spacing(1.25),
      width: "100%",
    },
    messageContent: {
      display: "flex",
      flexDirection: "column",
    },
    headerMenu: {
      marginTop: theme.spacing(2.2),
    },
    headerMenuList: {
      display: "flex",
      flexDirection: "column",
    },
    headerMenuItem: {
      "&:hover, &:focus": {
        backgroundColor: theme.palette.background.paper,
        // color: "white",
      },
    },
    headerMenuButton: {
      marginLeft: theme.spacing(1) + "!important",
      [theme.breakpoints.down("md")]: {
        marginLeft: 0 + "!important",
      },
      padding: theme.spacing(0.5),
    },
    headerMenuButtonSandwich: {
      marginLeft: 9 + "!important",
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0 + "!important",
      },
      padding: theme.spacing(0.5) + "!important",
    },
    headerMenuButtonCollapse: {
      marginRight: theme.spacing(2) + "!important",
    },
    headerIcon: {
      fontSize: 28,
      color: "rgba(255, 255, 255, 0.35)",
    },
    headerIconCollapse: {
      color: "white",
    },
    profileMenu: {
      minWidth: 265,
    },
    profileMenuUser: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
    },
    profileMenuItem: {
      color: theme.palette.text.secondary,
    },
    profileMenuIcon: {
      marginRight: theme.spacing(2),
      color: theme.palette.text.secondary,
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    profileMenuLink: {
      fontSize: 16 + "!important",
      textDecoration: "none",
      "&:hover": {
        cursor: "pointer",
      },
    },
    messageNotification: {
      height: "auto",
      display: "flex",
      alignItems: "center",
      "&:hover, &:focus": {
        backgroundColor: theme.palette.background.paper,
      },
    },
    messageNotificationSide: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginRight: theme.spacing(2),
    },
    messageNotificationBodySide: {
      alignItems: "flex-start",
      marginRight: 0 + "!important",
    },
    sendMessageButton: {
      margin: theme.spacing(4) + "!important",
      marginTop: theme.spacing(2) + "!important",
      marginBottom: theme.spacing(2) + "!important",
      textTransform: "none",
    },
    sendButtonIcon: {
      marginLeft: theme.spacing(2),
    },
    purchaseBtn: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
      marginRight: theme.spacing(3) + "!important",
    },
  })
);
