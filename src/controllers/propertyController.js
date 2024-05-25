const {
    web3,
    marketContractData,
    tokenContractData,
} = require("../config/contract");
const Property = require("../models/property");

const Token = new web3.eth.Contract(
    tokenContractData.abi,
    tokenContractData.contractAddress
);

async function getTokensOfOwner(ownerAddress) {
    const tokens = await Token.methods.getTokensOfOwner(ownerAddress).call();
    return tokens.map((tokenId) => parseInt(tokenId, 10));
}

const get = async (req, res) => {
    try {
        const properties = await Property.find(
            {},
            {
                _id: 0,
                id: "$_id",
                title: 1,
                tokenCount: 1,
                value: 1,
            }
        );

        res.json(properties);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

const getTokens = async (req, res) => {
    const propertyId = req.params.id;
    try {
        const property = await Property.findById(propertyId);

        console.log(property);

        res.json([]);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

const submit = async (req, res) => {
    try {
        const { title, userAccount, tokenCount, value } = req.body;

        const accounts = await web3.eth.getAccounts();
        const ownerAddress = accounts[0];

        const gasEstimate = await Token.methods
            .mint(userAccount, tokenCount, value)
            .estimateGas({ from: ownerAddress });

        let receipt = await Token.methods
            .mint(userAccount, tokenCount, value)
            .send({
                from: ownerAddress,
                gas: gasEstimate + BigInt(10000),
            });

        let tokenIds = receipt.events.TokensMinted.returnValues.tokenIds;

        tokenIds = tokenIds.map((id) => Number(id));

        const newProperty = new Property({
            title,
            tokenCount,
            value,
            tokenIds,
        });
        await newProperty.save();

        res.status(200).json({ message: "Property added successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = {
    get,
    getTokens,
    submit,
};
