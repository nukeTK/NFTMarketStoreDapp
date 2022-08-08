import { Box } from "@mui/system";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useLocation } from "react-router";
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
  InputAdornment,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";

const MuiSwitchLarge = styled(Switch)(({ theme }) => ({
  width: 70,
  height: 34,
  padding: 8,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(5px)",
    "&.Mui-checked": {
      transform: "translateX(35px)",
    },
  },
  "& .MuiSwitch-thumb": {
    width: 30,
    height: 30,
  },
  "& .MuiSwitch-track": {
    borderRadius: 5,
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "green",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "green",
  },
}));
///////////////////////////////////
const UpdatePage = (props) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [openSnack1, setOpenSnack1] = useState(false);
  const [newPrice, setNewPrice] = useState();
  const [reList, setReList] = useState(false);
  const [change, setChange] = useState(false);
  const [change1, setChange1] = useState(false);
  
  const handleclose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
    setOpenSnack1(false);
  };

  const updatePrice = async () => {
    setOpen(true);
    const signer = await props.web3.provider.getSigner();
    const contractInstance = props.web3.contract.connect(signer);
    const _price = ethers.utils.parseEther(newPrice);
    const updating = await contractInstance.updateTokenPrice(
      location.state.data.tokenId,
      _price
    );
    await updating.wait();
    setTimeout(() => {
      setChange(false);
      setOpen(false);
      setOpenSnack(true);
    }, 1000);
  };

  const relisiting = async () => {
    setOpen(true);
    const signer = props.web3.provider.getSigner();
    const contractInstance = props.web3.contract.connect(signer);
    const listingPrice = await contractInstance.getListingPrice();
    if(!location.state.data.isPaid)
    {
    const updatingPaid = await contractInstance.relisiting(
      location.state.data.tokenId,
      reList,
      {
        value:listingPrice.toString()
      }
    );
    await updatingPaid.wait();
    }
    else{
    const updatingAlreadyPaid = await contractInstance.relisiting(
      location.state.data.tokenId,
      reList
    );
    await updatingAlreadyPaid.wait();
    }
    setTimeout(() => {
      setChange1(false);
      setOpen(false);
      setOpenSnack1(true);
    }, 1000);
  };
  const handlePrice = (event) => {
    setNewPrice(event.target.value);
  };

  const handleToggle = (event) => {
    setReList(event.target.checked);
  };

  return (
    <Box
      sx={{ backgroundColor: "#3B3B3B", position: "absolute", width: "100%" }}
    >
      <Stack direction="row" spacing={3} sx={{ my: "100px", mx: "400px" }}>
        <Card
          elevation={10}
          sx={{
            width: 600,
            height: 800,
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
              <Stack spacing={22} direction="row" sx={{ alignItems: "center" }}>
                <Typography variant="h6">
                  Price: {location.state.data.price} ETH
                </Typography>
                <Stack
                  spacing={0}
                  direction="row"
                  sx={{ alignItems: "center" }}
                >
                  <Typography variant="button">NOT SELLING</Typography>
                 {change1?<MuiSwitchLarge
                    checked={reList}
                    onChange={handleToggle}
                    inputProps={{ "aria-label": "controlled" }}
                  /> :<MuiSwitchLarge
                    checked={location.state.data.isListed}
                    onChange={handleToggle}
                    inputProps={{ "aria-label": "controlled" }}
                  />}
                  <Typography variant="button">SELLING</Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Stack spacing={25} direction="row">
              <Stack spacing={1}>
                {change ? (
                  <Stack direction="row" spacing={1}>
                    <TextField
                      name="price"
                      label="Price"
                      type="text"
                      variant="standard"
                      InputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        endAdornment: (
                          <InputAdornment position="end">ETH</InputAdornment>
                        ),
                      }}
                      value={newPrice}
                      onChange={handlePrice}
                      required
                    />
                    <Button
                      variant="contained"
                      size="medium"
                      color="success"
                      onClick={() => updatePrice()}
                    >
                      Submit
                    </Button>
                    <Button color="error" onClick={() => setChange()}>
                      Cancel
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setChange(!change)}
                  >
                    Update Price
                  </Button>
                )}
                <Typography variant="caption" fontWeight={500}>
                  Click Above for Updating Price
                </Typography>
              </Stack>
              {/* Listing */}
              <Stack spacing={1}>
                {change1 ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => relisiting()}
                  >
                    Update Listing
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setChange1(!change1)}
                  >
                    {location.state.data.isListed ? "DeListing" : "ReListing"}
                  </Button>
                )}
                <Typography variant="caption" fontWeight={500}>
                  Click Above for listing NFT
                </Typography>
              </Stack>
            </Stack>
          </CardActions>
          <Divider />
          <Divider sx={{ marginTop: "100px" }} />
          <Typography
            variant="caption"
            fontWeight={400}
            fontStyle="italic"
            mx="40px"
          >
            Note:User has to Pay lisiting Price Only one time When they buy new
            Item!!
          </Typography>
          <Divider />
        </Card>
      </Stack>

      {/* BackDrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* SnackBar For Updating Price */}
      <Stack spacing={8} direction="column">
        <Snackbar
          open={openSnack}
          autoHideDuration={3000}
          onClose={handleclose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            variant="filled"
            elevation={10}
            onClose={handleclose}
            severity="success"
            sx={{ width: "100%" }}
          >
          Price Successfully Updated!!!
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSnack}
          autoHideDuration={5000}
          onClose={handleclose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            variant="filled"
            elevation={10}
            onClose={handleclose}
            severity="info"
            sx={{ width: "100%" }}
          >
            Revisit This Page!!
          </Alert>
        </Snackbar>
      </Stack>
      {/* SnackBar For Lisitng */}
      <Stack spacing={8} direction="column">
        <Snackbar
          open={openSnack1}
          autoHideDuration={3000}
          onClose={handleclose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            variant="filled"
            elevation={10}
            onClose={handleclose}
            severity="success"
            sx={{ width: "100%" }}
          >
        {location.state.data.isListed?"NFT Successfully DeLisited!!!":"NFT Successfully Lisited!!!"}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSnack1}
          autoHideDuration={5000}
          onClose={handleclose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            variant="filled"
            elevation={10}
            onClose={handleclose}
            severity="info"
            sx={{ width: "100%" }}
          >
            Check The Space Collection Page!!
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default UpdatePage;
