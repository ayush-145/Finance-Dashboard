/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, darkMode } = ownerState;

  const { dark, white, text, transparent } = palette;
  const { xxl } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem, rgba } = functions;

  return {
    background: active && transparentSidenav 
      ? (darkMode ? "#1e1e30" : white.main) 
      : transparent.main,
    color: active 
      ? (darkMode ? "#e0e0e0" : dark.main) 
      : (darkMode ? "#b0b0c0" : text.main),
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(10.8)} ${pxToRem(12.8)} ${pxToRem(10.8)} ${pxToRem(16)}`,
    margin: `0 ${pxToRem(16)}`,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active && transparentSidenav 
      ? (darkMode ? "0 4px 24px rgba(0, 0, 0, 0.4)" : xxl) 
      : "none",
    [breakpoints.up("xl")]: {
      boxShadow: () => {
        if (active) {
          return transparentSidenav 
            ? (darkMode ? "0 4px 24px rgba(0, 0, 0, 0.4)" : xxl) 
            : "none";
        }

        return "none";
      },
      transition: transitions.create("box-shadow", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
    "&:hover, &:focus": {
      backgroundColor: active 
        ? undefined 
        : (darkMode ? rgba(white.main, 0.05) : rgba(dark.main, 0.05)),
    },
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, color, darkMode } = ownerState;

  const { white, info, light, gradients } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: () => {
      if (active) {
        return color === "default" ? info.main : palette[color].main;
      }

      return darkMode ? "#2a2a45" : light.main;
    },
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    borderRadius: borderRadius.md,
    display: "grid",
    placeItems: "center",
    boxShadow: md,
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up("xl")]: {
      background: () => {
        let background;

        if (!active) {
          background = transparentSidenav 
            ? (darkMode ? "#2a2a45" : white.main) 
            : (darkMode ? "#2a2a45" : light.main);
        } else if (color === "default") {
          background = info.main;
        } else if (color === "warning") {
          background = gradients.warning.main;
        } else {
          background = palette[color].main;
        }

        return background;
      },
    },

    "& svg, svg g": {
      fill: active ? white.main : (darkMode ? "#b0b0c0" : gradients.dark.state),
    },
  };
}

const collapseIcon = ({ palette: { white, gradients } }, { active, darkMode }) => ({
  color: active ? white.main : (darkMode ? "#b0b0c0" : gradients.dark.state),
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightMedium, fontWeightRegular } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(12.8),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(12.8),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontWeight: active ? fontWeightMedium : fontWeightRegular,
      fontSize: size.sm,
      lineHeight: 0,
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
