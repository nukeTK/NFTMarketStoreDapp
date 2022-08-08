import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MenuIcon from "@mui/icons-material/Menu";
const NavBar = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <AppBar
    position="absolute"
      sx={{
        display: "flex",
        width: {
          xs: "100%",
          sm: "100%",
          md: "80%",
          xl: "80%",
        },
        mx: "auto",
        bgcolor: "#fafafa",
        p: 0.5,
        borderRadius: "20px",
        left: "0%",
        right: "0%",
      }}
    >
      <Toolbar  >
        <IconButton sx={{ display: "flex" }} aria-label="logo" disabled>
          <img src={logo} alt="logo" style={{ width: "60px" }} />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          color="black"
          sx={{
            display: "flex",
          }}
        >
          SpaceRocket
        </Typography>
        <Box sx={{ display: { xs: "flex", md: "none" }}}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "flex",sm:"flex", md: "none" } ,ml:{xs:"30px",sm:"400px"} }}
  
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: "40%" },
            }}
          >
            <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ my: 2 }}>
                SpaceRocket
              </Typography>
              <Divider />
              <Typography variant="body1" component="p">
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                  HOME
                </Link>
              </Typography>
              <Divider />
              <Typography variant="body2" component="p">
                <Link
                  to="NFTMarketStoreDapp/space-collection"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  SPACE COLLECTION
                </Link>
              </Typography>
              <Divider />
              <Typography variant="body1" component="p">
                <Link
                  to="NFTMarketStoreDapp/Create-nft"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  CREATE
                </Link>
              </Typography>
              <Divider />
              <Typography variant="body1" component="p">
                <Link
                  to="NFTMarketStoreDapp/my-space"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  MY SPACE
                </Link>
              </Typography>
            </Box>
          </Drawer>
        </Box>
        <Stack
        spacing={5}
          direction="row"
          mx="auto"
          sx={{  display: { xs: "none", md: "flex" }}}
        >
          <Typography variant="h6" component="h1">
            <Link to="" style={{ textDecoration: "none", color: "black" }}>
              HOME
            </Link>
          </Typography>
          <Typography variant="h6" component="h1">
            <Link
              to="NFTMarketStoreDapp/space-collection"
              style={{ textDecoration: "none", color: "black" }}
            >
              SPACE COLLECTION
            </Link>
          </Typography>
          <Typography variant="h6" component="h1">
            <Link
              to="NFTMarketStoreDapp/Create-nft"
              style={{ textDecoration: "none", color: "black" }}
            >
              CREATE
            </Link>
          </Typography>
          <Typography variant="h6" component="h1">
            <Link
              to="NFTMarketStoreDapp/my-space"
              style={{ textDecoration: "none", color: "black" }}
            >
              MY SPACE
            </Link>
          </Typography>
        </Stack>
       <Button
          sx={{ display: { xs: "none", sm: "none", md: "flex " },width:{md:"12%"} }}
          size="small"
          variant="contained"
          onClick={props.connect}
          endIcon={<AccountBalanceWalletIcon />}
        >
         {props.account?`${props.account.slice(0, 6)}.....${props.account.slice(38, 42)}` :"Connect To Wallet"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
