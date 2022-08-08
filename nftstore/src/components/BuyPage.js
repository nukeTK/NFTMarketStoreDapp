import {
  Alert,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useLocation } from "react-router";

export const BuyPage = (props) => {
  const [openSnack, setOpenSnack] = useState(false);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const buyNFT = async () => {
    setOpen(true);
    const signer = props.web3.provider.getSigner();
    const contractInstance = props.web3.contract.connect(signer);
    const price = ethers.utils.parseEther(location.state.data.price);
    const transaction = await contractInstance.executeSell(
      location.state.data.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    setTimeout(() => {
      setOpen(false);
      setOpenSnack(true);
    }, 1000);
  };
  const handleclose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <Box
      sx={{ backgroundColor: "#3B3B3B", position: "absolute", width: "100%" }}
    >
      <Stack direction="row" spacing={3} sx={{ my: "100px", mx: "400px" }}>
        <Card
          elevation={10}
          sx={{
            maxWidth: 600,
            maxHeight: 800,
            borderRadius: "20px",
            backgroundColor: "#F2ECFF",
          }}
        >
          <CardMedia
            component="img"
            alt="nft"
            height="800"
            image={location.state.data.image}
            sx={{
              objectFit: "contain",
              objectPosition: "center",
              borderRadius: "20px",
            }}
          />
        </Card>
        <Card
          elevation={10}
          sx={{
            width: 800,
            height: 800,
            borderRadius: "20px",
            border: "10px solid #F2ECFF ",
            p: 5,
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              <Stack spacing={1} direction="column">
                <Typography variant="h4" fontFamily="sans-serif">
                  {location.state.data.name}
                </Typography>
                <Typography variant="h6">
                  TokenId: #{location.state.data.tokenId}
                </Typography>
              </Stack>
              <Divider />
              <Stack spacing={0}>
                <Typography variant="h6">Description:</Typography>
                <Typography variant="subtitle1">
                  {location.state.data.description}
                </Typography>
              </Stack>
              <Divider />
              <Typography variant="subtitle1">
                Owned by: {location.state.data.owner}
              </Typography>
              <Divider />
              <Typography variant="h6">
                Price: {location.state.data.price} ETH
              </Typography>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Stack spacing={1}>
              {props.address === location.state.data.owner ||
              props.address === location.state.data.seller ? (
                <Typography variant="h6" color="error.light">
                  Owned By You!!!
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => buyNFT()}
                >
                  Buy
                </Button>
              )}
              <Typography variant="overline" fontWeight={500}>
                Check Purchased item in my space
              </Typography>
            </Stack>
          </CardActions>
          <Divider />
        </Card>
      </Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleclose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleclose}
          variant="filled"
          severity="success"
          sx={{ width: "100%" }}
        >
          Token Successfully Purchased!!!
        </Alert>
      </Snackbar>
    </Box>
  );
};
