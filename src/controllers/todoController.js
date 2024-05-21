const { abi, contractAddress, web3 } = require("../config/contract");

// Create contract instance
const todoList = new web3.eth.Contract(abi, contractAddress);

const get = async (req, res) => {
    const taskCount = await todoList.methods.taskCount().call();
    console.log("Task Count:", taskCount);

    // // Create a new task
    // const receipt = await todoList.methods
    //     .createTask("New Task from Node.js")
    //     .send({ from: defaultAccount });
    // console.log("Task Created:", receipt);

    // Retrieve the task
    const task = await todoList.methods.tasks(0).call();
    console.log("Task:", task);

    res.send("ok");
};

module.exports = {
    get,
};
