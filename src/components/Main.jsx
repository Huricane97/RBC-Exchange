import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import "./Main.css";

import { useState, useEffect } from "react";
import Popup from './popup';

import Web3 from "web3";
import abi from "./new.json";
import abi2 from "./old.json";
require("dotenv").config();


const  REACT_APP_CONTRACT_ADDRESS  = '0x6f4bA4e9d5930A5bD29738211042198781Fa5180';
const  REACT_APP_CONTRACT_ADDRESS_old  = '0x391e6Cdae4fFbB01b1bdbAf08a8E7EB0aa081fE6';
const SELECTEDNETWORKNAME = "Ethereum Maintnet";
const SELECTEDNETWORK = "5";
let metaMaskAccount;

const navigation = () => {


    const [MetaData, setMetadata] = useState([]);


    const [connectedAccount, setConnectedAccount] = useState("Connect Dapp");
    const [errormsg, setErrorMsg] = useState(false);
    const [state, setstate] = useState(0);

    var contractaddress;
    
    let tokenidArr = [];

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    let ct;

    useEffect(async () => {
        window.web3 = new Web3(window.ethereum);
        const web3 = window.web3;
        contractaddress = REACT_APP_CONTRACT_ADDRESS;
        ct = new web3.eth.Contract(abi, contractaddress);
    }, []);


    async function loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            // await eth_requestAccounts();
            const web3 = window.web3;
            if (await web3.eth.net.getId() == SELECTEDNETWORK) {
                // Meta Mask Connected Account Address
                metaMaskAccount = await web3.eth.getAccounts();
                metaMaskAccount = metaMaskAccount[0];
                let splitedMetaMaskAddress;
                console.log("contract");
                if (metaMaskAccount) {
                    splitedMetaMaskAddress =
                        metaMaskAccount[0].substring(0, 6) +
                        "......" +
                        metaMaskAccount[0].substring(
                            metaMaskAccount[0].length - 4,
                            metaMaskAccount[0].length
                        );
                }
                document.getElementById("wallet").innerHTML = metaMaskAccount;
                setConnectedAccount(splitedMetaMaskAddress);
                submitreqhandler();
                setstate(1);
            }
            else {
                setstate(2);
                setErrorMsg("Please select Ethereum Testnet in Metamask");
            }
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {

            { setErrorMsg("Non-Ethereum browser detected. You should consider trying MetaMask!") }
        }
    }

    const getMetadata = (async (nftarr) => {
        let str = [];
        for (let link_ of nftarr) {
            console.log(link_ + "  metadata func");
            let jsn_ = await fetch(link_.toString());
            jsn_ = await jsn_.json();
            str.push(jsn_);
        }

        return str;

    });

    const submitreqhandler = (async () => {
        const web3 = new Web3(window.ethereum);
        let nftArr = [];

        console.log(REACT_APP_CONTRACT_ADDRESS);
        const ct = new web3.eth.Contract(abi2, REACT_APP_CONTRACT_ADDRESS_old); // change the contract address to your deployed address
        const new_ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS); // change the contract address to your deployed address

        const addressArr = await window.ethereum.request({ method: "eth_requestAccounts", });
        ct.defaultAccount = addressArr[0];
        const totalNumberOfTokens = await ct.methods.totalSupply().call();
        const balanceof = await ct.methods.balanceOf(addressArr[0]).call();
        console.log("balanceof", balanceof)

        let StakedNFTsMetadata = [];


        for (let i = 0; i < balanceof; i++) {
            tokenidArr[i] = await ct.methods.tokensOfOwner(metaMaskAccount).call()

            let TokeARRtoNum = Number(tokenidArr[i][i]);
            let tokenMetadataUri = await ct.methods
                .tokenURI(TokeARRtoNum)
                .call();
            console.log(tokenMetadataUri)
            if (tokenMetadataUri.startsWith("ipfs")) {
                tokenMetadataUri =
                    'https://ipfs.io/ipfs/${tokenMetadataUri.split("ipfs://")[1]}';
            }

            const ttokenMetadata = await fetch(tokenMetadataUri).then((response) =>
                response.json()
            );
            StakedNFTsMetadata[i] = ttokenMetadata;

        }
        setMetadata(StakedNFTsMetadata);

        let metaObj = await getMetadata(nftArr);
        // console.log(metaObj)
        // console.log(setNftMetadata(metaObj));

    });

    async function transferNfts(){
        const web3 = new Web3(window.ethereum);
        const old_ct = new web3.eth.Contract(abi2, REACT_APP_CONTRACT_ADDRESS_old);
        const ct = new web3.eth.Contract(abi, REACT_APP_CONTRACT_ADDRESS);

        const addressArr = await window.ethereum.request({ method: "eth_requestAccounts", });
        old_ct.defaultAccount = addressArr[0];
        const totalNumberOfTokens = await old_ct.methods.totalSupply().call();
        const balanceof = await old_ct.methods.balanceOf(addressArr[0]).call();
        console.log("balanceof", balanceof)



        for (let i = 0; i < balanceof; i++) {
            tokenidArr[i] = await old_ct.methods.tokensOfOwner(metaMaskAccount).call();
            let TokeARRtoNum = Number(tokenidArr[i][i]);
            
            await old_ct.methods.setApprovalForAll(metaMaskAccount, true).send({from:metaMaskAccount});
            await ct.methods.claim().send({from:metaMaskAccount});

        }

    };



    return (
        <div className="container-fluid maindiv m-0 p-0">
            <div className="row row1">
                <div className="col-6 middlediv">
                    <p className="fonts  websitename">Royalty Black Card</p>
                </div>
            </div>
{/*            <div className="row row2">
                <div className="col-61 middlediv">

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {MetaData.map((element, index) => {
                            return (<div style={{ display: "flex", flexDirection: "column", width: "14rem", color: "white" }} key={index}>
                                <div>{element.name}</div>
                                <div style={{ display: "flex", justifyContent: "center" }} >

                                    <img src={element.image} style={{ height: "8rem", width: "8rem", }}></img>
                                </div>
                                {/* <div style={{ color: "white" }}>{element.description}</div> */}
{/*                            </div>)
                        })}

                    </div>

                </div>
                    </div>  */}
            <div className="row row3">
                <div className="col-62 middlediv">
                    <h4 className="fonts">SELECT THE NFT YOU WOULD LIKE TO EXCHANGE AND CLICK THE EXCHANGE BUTTON BELOW</h4>

                    <div>
                        {
                            state == 0 ? (<button className="btn" onClick={() => { loadWeb3(); }}>CONNECT</button>)
                                : state == 1 ? (<button className="btn" onClick={togglePopup} >VIEW</button>)
                                    : <h5 className='fonts'><b>{errormsg}</b></h5>
                        }
                    </div>

                    <h4 className='fonts1' id="wallet">Not Connected</h4>

                    <div >
                        {isOpen && <Popup
                            content={<>
                                <h4 className='fonts2'>Your NFT's</h4>
                                <div className='ppopup'>
                                {MetaData.map((element, index) => {
                                    return (<div key={index}>
                                        <div >{element.name}</div>
                                        <div style={{ display: "flex", justifyContent: "center" }} >
                                            <img src={element.image} style={{ height: "8rem", width: "8rem", }}></img>
                                        </div>
                                        
                                    </div>)
                                })} </div>
                                <div><button className="btn1" onClick={() => { transferNfts(); }}>EXCHANGE</button></div>
                            </>}
                            handleClose={togglePopup}
                        />}
                    </div>


                </div>
            </div>

        </div >


    );

}
export default navigation;