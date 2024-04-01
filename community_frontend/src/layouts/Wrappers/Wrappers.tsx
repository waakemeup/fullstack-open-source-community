import {
  Badge as BadgeBase,
  Button as ButtonBase,
  Typography as TypographyBase,
} from "@mui/material";
// import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles, useTheme, withStyles } from "@mui/styles";
import classnames from "classnames";

// styles
var useStyles = makeStyles((theme: any) =>
  createStyles({
    badge: {
      fontWeight: 600,
      height: 16,
      minWidth: 16,
    },
  })
);

function Badge({ children, colorBrightness, color, ...props }: any) {
  var classes = useStyles();
  var theme = useTheme();
  var Styled = createStyled(
    {
      badge: {
        backgroundColor: getColor(color, theme, colorBrightness),
      },
    },
    {}
  );

  return (
    <Styled>
      {(styledProps: any) => (
        <BadgeBase
          classes={{
            badge: classnames(classes.badge, styledProps.classes.badge),
          }}
          {...props}
        >
          {children}
        </BadgeBase>
      )}
    </Styled>
  );
}

function Typography({
  children,
  weight,
  size,
  colorBrightness,
  color,
  ...props
}: any) {
  var theme = useTheme();

  return (
    <TypographyBase
      style={{
        color: getColor(color, theme, colorBrightness),
        fontWeight: getFontWeight(weight),
        fontSize: getFontSize(size, props.variant, theme),
      }}
      {...props}
    >
      {children}
    </TypographyBase>
  );
}

function Button({ children, color, className, ...props }: any) {
  var theme = useTheme<any>();

  var Styled = createStyled(
    {
      root: {
        color: getColor(color, theme),
      },
      contained: {
        backgroundColor: getColor(color, theme),
        boxShadow: theme.customShadows.widget,
        color: `${color ? "white" : theme.palette.text.primary} !important`,
        "&:hover": {
          backgroundColor: getColor(color, theme, "light"),
          boxShadow: theme.customShadows.widgetWide,
        },
        "&:active": {
          boxShadow: theme.customShadows.widgetWide,
        },
      },
      outlined: {
        color: getColor(color, theme),
        borderColor: getColor(color, theme),
      },
      select: {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
      },
    },
    {}
  );

  return (
    <Styled>
      {({ classes }: any) => (
        <ButtonBase
          classes={{
            contained: classes.contained,
            root: classes.root,
            outlined: classes.outlined,
          }}
          {...props}
          className={classnames(
            {
              [classes.select]: props.select,
            },
            className
          )}
        >
          {children}
        </ButtonBase>
      )}
    </Styled>
  );
}

export { Badge, Button, Typography };

// ########################################################################

function getColor(color: any, theme: any, brigtness = "main") {
  if (color && theme.palette[color] && theme.palette[color][brigtness]) {
    return theme.palette[color][brigtness];
  }
}

function getFontWeight(style: any) {
  switch (style) {
    case "light":
      return 300;
    case "medium":
      return 500;
    case "bold":
      return 600;
    default:
      return 400;
  }
}

function getFontSize(size: any, variant = "", theme: any) {
  var multiplier;

  switch (size) {
    case "sm":
      multiplier = 0.8;
      break;
    case "md":
      multiplier = 1.5;
      break;
    case "xl":
      multiplier = 2;
      break;
    case "xxl":
      multiplier = 3;
      break;
    default:
      multiplier = 1;
      break;
  }

  var defaultSize =
    variant && theme.typography[variant]
      ? theme.typography[variant].fontSize
      : theme.typography.fontSize + "px";

  return `calc(${defaultSize} * ${multiplier})`;
}

function createStyled(styles: any, options: any) {
  var Styled = function (props: any) {
    const { children, ...other } = props;
    return children(other);
  };

  return withStyles(styles, options)(Styled);
}
