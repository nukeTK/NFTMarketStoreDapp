import { Alert, Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import bg from "../images/profile4.jpg";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CollectionsIcon from "@mui/icons-material/Collections";
import SellIcon from "@mui/icons-material/Sell";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";

const Home = (props) => {
  const [lastToken, setLastToken] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      const _token = await props.contract.currentTokenId();
      let item = _token[0].toNumber();
      let tokenURI = await props.contract.tokenURI(item);
      let meta = await axios.get(tokenURI);
      setLastToken(meta.data.image);
      setLoading(false);
    };
    props.contract && getToken();
  }, []);
  console.log(props.chainId)
  return (
    <Box>
      <img
        className="img"
        src={bg}
        alt="back"
        style={{
          width: 2200,
          height: "600px",
          position: "absolute",
          objectFit: "cover",
          zIndex: "-1",
        }}
      />
   {!props.chainId  &&  <Alert variant="filled" severity="warning" sx={{justifyContent:"center"}}>
        Install MetaMask Wallet, Switch to Goerli Network and Refresh the Page for further Options!! 
      </Alert>}
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "30%" },
          position: "absolute",
          ml: { xs: "0px", sm: "0px", md: "300px" },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "0.8cm", sm: "0.8cm", md: "1.2cm" },
            mt: { xs: "100px", md: "150px" },
            position: "absolute",
            color: "white",
            padding: { xs: "30px" },
          }}
        >
          Uncover the Space Store Collections, Create NFTs and Much More...
        </Typography>
      </Box>
      <Paper
        elevation={10}
        sx={{
          display: { xs: "none", sm: "none", md: "flex" },
          flexDirection: "column",
          border: "10px solid white",
          borderRadius: "20px",
          position: "absolute",
          mt: "100px",
          ml: "60%",
        }}
      >
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={400}
            height={350}
            sx={{ borderRadius: "20px" }}
          />
        ) : (
          <img
            src={lastToken}
            alt="nft"
            style={{
              width: "400px",
              height: "350px",
              borderRadius: "20px",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        )}
        <Button
          variant="contained"
          sx={{
            width: "60%",
            mx: "auto",
            mt: "10px",
            borderRadius: "20px",
            bgcolor: "error.light",
          }}
          endIcon={<StarIcon />}
        >
          Last Token Created
        </Button>
      </Paper>

      <Paper
        elevation={5}
        sx={{
          width: "80%",
          margin: "550px auto",
          left: "0",
          right: 0,
          borderRadius: "20px",
          zIndex: "0",
          position: "absolute",
        }}
      >
        <Stack
          spacing={3}
          direction={{ sm: "row" }}
          width="80%"
          mx="auto"
          p={5}
          sx={{ padding: { xs: "0", sm: "0", md: "50px" } }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography p={1} variant="h6" component="h5">
              Set up your wallet
            </Typography>
            <AccountBalanceWalletIcon
              sx={{ fontSize: "3rem", color: "primary.main" }}
            />
            <Typography
              p={1}
              variant="subtitle2"
              component="h6"
              width="80%"
              mx="auto"
            >
              Once you've set up MetaMask, connect it to SpaceRocket by clicking
              the wallet icon in the top right corner
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography p={1} variant="h6" component="h5">
              Create your NFTs
            </Typography>
            <CollectionsIcon sx={{ fontSize: "3rem", color: "primary.main" }} />
            <Typography
              p={1}
              variant="subtitle2"
              component="h6"
              width="80%"
              mx="auto"
            >
              Upload your work (image), add a title and description, and
              customize your NFTs with properties, stats, and unlockable
              content.
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography p={1} variant="h6" component="h5">
              List them for sale
            </Typography>
            <SellIcon sx={{ fontSize: "3rem", color: "primary.main" }} />
            <Typography
              p={1}
              variant="subtitle2"
              component="h6"
              width="80%"
              mx="auto"
            >
              Choose between auctions, fixed-price listings, You choose how you
              want to sell your NFTs, and we help you sell them!
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Home;
