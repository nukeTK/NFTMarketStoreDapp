import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/system";
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
  Typography,
} from "@mui/material";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Store = (props) => {
  const [totalNfts, setTotalNfts] = useState();
  const [tokenArray, setTokenArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const allToken = await props.contract.getAllNfts();
      setTotalNfts(allToken);
    };
    props.contract && getData();
  }, [props.contract]);

  useEffect(() => {
    const data = async () => {
      let arrayNft = [];
      for (let i = 0; i < totalNfts.length; i++) {
        let tokenURI = await props.contract.tokenURI(
          totalNfts[i].tokenId.toNumber()
        );
        let meta = await axios.get(tokenURI);
        let item = {
          tokenId: totalNfts[i].tokenId.toNumber(),
          seller: totalNfts[i].owner,
          owner: totalNfts[i].seller,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          price: ethers.utils.formatEther(totalNfts[i].price.toString()),
        };
        arrayNft.push(item);
      }
      setTokenArray(arrayNft);
      setLoading(false);
    };
    totalNfts && data();
  }, [props.contract, totalNfts]);

  return (
    <Box
      component="div"
      sx={{
        backgroundImage:
          "linear-gradient(to right top, #020305, #161e27, #1c3545, #1a4f64, #056a82)",
        position: "absolute",
        width: "100%",
        height: "auto",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          marginTop: "90px",
          marginLeft: "200px",
          width: "18%",
          textAlign: "center",
          borderRadius: "20px",
          backgroundColor: "white",
          color: "#3B3B3B",
          border: "1px solid black",
          p:2
        }}
      >
        <Typography variant="h4" fontFamily="monospace">Space Collections</Typography>
      </Paper>
      <Paper
        elevation={10}
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
                    sx={{ maxWidth: 300, maxHeight: 500, borderRadius: "20px" }}
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
                        {item.description.substring(0, 100)}...etc.
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
                      >
                        <Typography variant="body1" p={1}>
                          Price:{item.price} ETH
                        </Typography>
                      </Paper>
                      <Link
                        to="/NFTMarketStoreDapp/space-collection/nft-space"
                        state={{ data: item }}
                        style={{ textDecoration: "none", marginLeft: "auto" }}
                      >
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                          sx={{ borderRadius: "10px" }}
                        >
                          Buy
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
                      width={300}
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

export default Store;
