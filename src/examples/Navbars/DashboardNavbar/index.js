import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import brand from "assets/images/logo-ct.png";

import { useFinance, toggleDark, setRole } from "context/FinanceContext";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const route = useLocation().pathname.split("/").slice(1);
  const [financeState, financeDispatch] = useFinance();
  const { role, darkMode } = financeState;

  const handleRoleChange = (e) => setRole(financeDispatch, e.target.value);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // Force the navbar to statically retain its glassy/styled background immediately
    // on load, completely eliminating any visual morphs or state shifts on scroll.
    setTransparentNavbar(dispatch, false);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => ({ ...navbarContainer(theme), padding: "0.5rem 1rem", minHeight: "auto" })}>
        <SoftBox color="inherit" display="flex" flexWrap={{ xs: "wrap", md: "nowrap" }} alignItems="center" justifyContent="space-between" width="100%" gap={1}>
          
          <SoftBox display="flex" alignItems="center" gap={1.5}>
            <IconButton
              size="small"
              color="inherit"
              sx={{
                width: 36,
                height: 36,
                display: { xs: "inline-flex", xl: "none" },
              }}
              onClick={handleMiniSidenav}
            >
              <Icon fontSize="medium" className={light ? "text-white" : "text-dark"}>
                {miniSidenav ? "menu" : "menu"}
              </Icon>
            </IconButton>
            <SoftBox component={Link} to="/finance" display="flex" alignItems="center" gap={1.5} sx={{ textDecoration: "none", color: "inherit" }}>
              <SoftBox component="img" src={brand} alt="Zorvyn Logo" width="auto" height={32} sx={{ filter: darkMode ? "brightness(0) invert(1)" : "none", transition: "filter 0.3s ease" }} />
              <SoftTypography variant="h6" fontWeight="bold" color="inherit" sx={{ whiteSpace: "nowrap" }}>
                Finance Dashboard
              </SoftTypography>
            </SoftBox>
          </SoftBox>

          <SoftBox display="flex" alignItems="center" gap={2} ml={3}>
            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
              <IconButton onClick={() => toggleDark(financeDispatch)} size="medium" sx={{ color: darkMode ? "#fdd835" : "#555", p: 0 }}>
                <Icon>{darkMode ? "light_mode" : "dark_mode"}</Icon>
              </IconButton>
            </Tooltip>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={role}
                onChange={handleRoleChange}
                displayEmpty
                sx={{
                  height: 36,
                  fontSize: "0.85rem",
                  borderRadius: "8px",
                  "& .MuiSelect-select": { py: 0.8, px: 1.5 },
                }}
              >
                <MenuItem value="admin">
                  <SoftBox display="flex" alignItems="center" gap={1}>
                    <Icon fontSize="small">admin_panel_settings</Icon>
                    Admin
                  </SoftBox>
                </MenuItem>
                <MenuItem value="viewer">
                  <SoftBox display="flex" alignItems="center" gap={1}>
                    <Icon fontSize="small">visibility</Icon>
                    Viewer
                  </SoftBox>
                </MenuItem>
              </Select>
            </FormControl>
          </SoftBox>

        </SoftBox>
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
