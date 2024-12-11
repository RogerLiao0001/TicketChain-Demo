// hw3/backend/config.js
require('dotenv').config(); // 載入.env

module.exports = {
  rpcUrl: process.env.RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  privateKey: process.env.PRIVATE_KEY,
  mongoURI: process.env.MONGODB_URI
};
