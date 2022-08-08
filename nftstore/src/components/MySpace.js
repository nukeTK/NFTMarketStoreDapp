import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TokenIcon from "@mui/icons-material/Token";
import { ethers } from "ethers";
const MySpace = (props) => {
  const [myNfts, setmyNfts] = useState();
  const [tokenArray, setTokenArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const _signer = props.web3.provider.getSigner();
      const contractInstance = props.web3.contract.connect(_signer);
      const myToken = await contractInstance.getMyNfts();
      setmyNfts(myToken);
    };
    props.web3.contract && getData();
  }, [props.web3.provider, props.web3.contract]);

  useEffect(() => {
    const data = async () => {
      let arrayNft = [];
      for (let i = 0; i < myNfts.length; i++) {
        let tokenURI = await props.web3.contract.tokenURI(
          myNfts[i].tokenId.toNumber()
        );
        let meta = await axios.get(tokenURI);
        let item = {
          tokenId: myNfts[i].tokenId.toNumber(),
          seller: myNfts[i].owner,
          owner: myNfts[i].seller,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          price: ethers.utils.formatEther(myNfts[i].price.toString()),
          isListed: myNfts[i].isListed,
          isPaid: myNfts[i].isPaid,
        };
        arrayNft.push(item);
      }
      setTokenArray(arrayNft);
      setLoading(false);
    };
    myNfts && data();
  }, [myNfts]);

  return (
    <Box
      component="div"
      sx={{
        backgroundImage:
          "linear-gradient(to right top, #020305, #161e27, #1c3545, #1a4f64, #056a82)",
        position: "absolute",
        width: "100%",
        height: "100%",
        maxHeight: "auto",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          marginTop: "90px",
          marginLeft: "200px",
          width: "20%",
          textAlign: "center",
          borderRadius: "20px",
          backgroundColor: "white",
          color: "#3B3B3B",
          border: "1px solid black",
          p: 1,
        }}
      >
        <TokenIcon sx={{ fontSize: "1.5cm", color: "primary.light" }} />
        <Stack direction="column">
          <Typography variant="h4">My Space</Typography>
          <Divider textAlign="left" sx={{ fontWeight: "500" }}>
            Account
          </Divider>
          <Typography variant="caption">{props.account}</Typography>
          <Divider />
        </Stack>
      </Paper>
      <Paper
        elevation={8}
        sx={{
          margin: "10px auto",
          width: "80%",
          padding: "20px",
          borderRadius: "50px",
          backgroundImage:
            "radial-gradient(circle, #74917f, #4f8c83, #178491, #007aa2, #006bab)",
        }}
      >
        <Grid container direction="row" spacing={1}>
          {(loading ? Array.from(new Array(10)) : tokenArray).map(
            (item, index) => (
              <Grid key={index} item sx={{ ml: "5px" }}>
                {item ? (
                  <Card
                    elevation={3}
                    sx={{ width: 380, height: 500, borderRadius: "20px" }}
                  >
                    <CardMedia
                      component="img"
                      alt="nft"
                      height="300"
                      image={item.image}
                      sx={{
                        objectFit: "cover",
                        objectPosition: "top",
                        transition: "0.4s ease",
                        borderStartStartRadius: "20px",
                        "&:hover": {
                          transform: "scale(1.10)",
                          cursor: "pointer",
                        },
                      }}
                    />
                    <Divider />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Divider />
                      <Typography variant="body2" color="text.secondary">
                        {item.description.substring(0, 80)}...etc.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Paper
                        elevation={1}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          height: "35px",
                          borderRadius: "10px",
                        }}
                      ></Paper>

                      <Link
                        to="/NFTMarketStoreDapp/my-space/mynft-space"
                        state={{ data: item }}
                        style={{ textDecoration: "none",margin: "auto" }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ borderRadius: "10px" }}
                        >
                          Update Price/Sell nft
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                ) : (
                  <Box
                    sx={{ border: "0.01mm solid grey", borderRadius: "20px" }}
                  >
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      width={380}
                      height={500}
                      sx={{ borderRadius: "20px" }}
                    />
                    <Skeleton animation="wave" width="100%" height="50px" />
                  </Box>
                )}
              </Grid>
            )
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default MySpace;
