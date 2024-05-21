const { Web3 } = require("web3");

const fs = require("fs");
const path = require("path");

// Load ABI and contract address
const contractJson = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../smart-contract/build/contracts/TodoList.json"),
        "utf8"
    )
);
const abi = contractJson.abi;
const contractAddress = "0xCc8620C1f0cC56851CD2D605266aC5f5e26AcB78";

const web3 = new Web3("http://127.0.0.1:7545");

module.exports = { abi, contractAddress, web3 };
