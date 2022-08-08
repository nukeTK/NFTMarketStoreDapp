import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import nftstoreABI from "./artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import CreateNFT from "./components/CreateNFT";
import Store from "./components/Store";
import { BuyPage } from "./components/BuyPage";
import MySpace from "./components/MySpace";
import UpdatePage from "./components/UpdatePage";
import Error404 from "./components/Error404";

const contractAddress = "0x116E7747766d0a283e6e85da8b8E1d7b28b575C8";

const App = () => {
  const [web3, setWeb3] = useState({
    provider: "",
    contract: "",
  });
  const [chainID, setChainID] = useState(false);
  const [account, setAccount] = useState("");
  const web3Connection = async () => {
    try {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      if (_provider) {
        await _provider.send("eth_requestAccounts", []);
        const _signer = _provider.getSigner();
        const _account = await _signer.getAddress();
        const _contract = new ethers.Contract(
          contractAddress,
          nftstoreABI.abi,
          _provider
        );
        setWeb3({
          provider: _provider,
          contract: _contract,
        });
        setAccount(_account);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const accountsChanged = () => {
      window.ethereum.on("accountsChanged", async (acc) => {
        if (acc.length === 0) console.log("please connect to accounts");
        else if (acc[0] !== account) setAccount(acc[0]);
      });
    };
    web3.provider && accountsChanged();
  }, [web3.provider, account]);

  useEffect(() => {
    const checkChainID = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chain = parseInt(currentChainId);
        if (chain.toString() === "5") setChainID(true);
        else setChainID(false);
      }
    };
    web3.provider && checkChainID();
  }, [web3.provider, account, chainID]);

  useEffect(() => {
    web3Connection();
  }, []);

  return (
    <BrowserRouter basename="/NFTMarketStoreDapp">
      {chainID && <NavBar account={account} connect={web3Connection} />}
      <Routes>
        <Route
          path=""
          element={<Home contract={web3.contract} chainId={chainID} />}
        />
        <Route path="Create-nft" element={<CreateNFT web3={web3} />} />
        <Route
          path="space-collection"
          element={<Store contract={web3.contract} />}
        />
        <Route
          path="space-collection/nft-space"
          element={<BuyPage web3={web3} address={account} />}
        />
        <Route
          path="my-space"
          element={<MySpace web3={web3} account={account} />}
        />
        <Route
          path="my-space/mynft-space"
          element={<UpdatePage web3={web3} address={account} />}
        />
        <Route path="*" element={<Error404/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
