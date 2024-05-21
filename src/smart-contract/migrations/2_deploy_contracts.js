var TodoList = artifacts.require("./TodoList.sol");
var NFT = artifacts.require("./NFT.sol");

module.exports = function (deployer) {
    deployer.deploy(TodoList);
    deployer.deploy(NFT);
};
