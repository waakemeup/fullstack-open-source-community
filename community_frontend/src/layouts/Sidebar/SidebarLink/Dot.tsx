import { Theme } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import classnames from "classnames";
import themes from "../../../themes";

// styles
var useStyles = makeStyles((theme: Theme) => ({
  dotBase: {
    width: 8,
    height: 8,
    backgroundColor: theme.palette.text.disabled,
    borderRadius: "50%",
    transition: theme.transitions.create("background-color"),
  },
  dotSmall: {
    width: 5,
    height: 5,
  },
  dotLarge: {
    width: 11,
    height: 11,
  },
}));

export default function Dot({
  size,
  color,
}: {
  size?: number | string;
  color: keyof typeof themes.default.palette;
}) {
  var classes = useStyles();
  var theme = useTheme<typeof themes.default>();

  return (
    <div
      className={classnames(classes.dotBase, {
        [classes.dotLarge]: size === "large",
        [classes.dotSmall]: size === "small",
      })}
      style={{
        backgroundColor:
          // @ts-ignore
          color && theme.palette[color] && theme.palette[color]?.main,
      }}
    />
  );
}
