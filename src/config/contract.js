const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const web3 = new Web3("http://127.0.0.1:7545");

// Utility function to load contract data
function loadContractData(contractName) {
    const contractJson = JSON.parse(
        fs.readFileSync(
            path.join(
                __dirname,
                `../../../smart-contract/build/contracts/${contractName}.json`
            ),
            "utf8"
        )
    );

    // console.log(contractJson);

    const abi = contractJson.abi;
    const contractAddress = contractJson.networks["5777"].address; // Adjust the network ID as per your setup
    return { abi, contractAddress };
}

const marketContractData = loadContractData("Market");
const tokenContractData = loadContractData("Token");

module.exports = { web3, marketContractData, tokenContractData };
