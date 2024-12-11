// hw3/backend/services/contractService.js
const { ethers } = require('ethers');
const { rpcUrl, contractAddress, privateKey } = require('../config');
const abi = require('../utils/abi.json'); // 從剛剛存的abi.json載入ABI

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, signer);

module.exports = {
  async startDraw(addresses, points) {
    // 呼叫合約的startDraw函式
    const tx = await contract.startDraw(addresses, points);
    // 等待交易完成
    const receipt = await tx.wait();
    console.log('startDraw transaction completed:', receipt.transactionHash);
    return receipt;
  },

  async getResults() {
    // 呼叫合約的getResults查看抽選結果
    const [resAddresses, resPoints, resOrders] = await contract.getResults();
    return { addresses: resAddresses, points: resPoints, orders: resOrders };
  }
};
