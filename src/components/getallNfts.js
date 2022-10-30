import React from "react";
import web3 from "./web3/web3";
import rbc from "./web3/RBCcollection";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "./Main.css";

import { useState, useEffect } from "react";

function getallNfts() {
  const { ethereum } = window;
  const [account, setAccount] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        setAccount(accounts[0]);
        console.log(account);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [account]);

  return <div></div>;
}

export default getallNfts;
