// scripts/eip7702-simulate.js
const rlp = require("rlp");
const { ethers } = require("hardhat");

async function main() {
  // 获取必要的工具函数（v6 直接从 ethers 导出）
  const { keccak256, getBytes, Signature, JsonRpcProvider, FetchRequest } =
    ethers;

  const [signer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const signerAddress = await signer.getAddress();

  const logicAddress = "0x0B6CF3840d0E8DB89bd4088D55A612361983F11D";
  const gasLimit = 1000000;
  const value = 0;
  const data = "0x";
  const accessList = [];

  // Step 1: 构造授权元组
  const authNonce = await ethers.provider.getTransactionCount(signerAddress);
  const authMessage = rlp.encode([chainId, logicAddress, authNonce]);
  const msgHash = keccak256(
    Buffer.concat([Buffer.from("05", "hex"), authMessage])
  );

  // 使用 signMessage 签名（v6 自动处理 arrayify）
  const sig = await signer.signMessage(getBytes(msgHash));
  const sigSplit = Signature.from(sig); // 使用 Signature 类解析签名
  const authorization = [
    chainId,
    logicAddress,
    authNonce,
    sigSplit.v % 2, // y_parity
    sigSplit.r,
    sigSplit.s,
  ];

  const authorization_list = [authorization];

  // Step 2: 构造交易
  const txNonce = await ethers.provider.getTransactionCount(signerAddress);
  const maxPriorityFeePerGas = 1;
  const maxFeePerGas = 1e9;
  const unsignedTxPayload = [
    chainId,
    txNonce,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    signerAddress,
    value,
    data,
    accessList,
    authorization_list,
  ];
  console.log("Unsigned transaction payload:", unsignedTxPayload);
  const encodedTxPayload = rlp.encode(unsignedTxPayload);
  const txMsgHash = keccak256(
    Buffer.concat([Buffer.from("04", "hex"), encodedTxPayload])
  );

  const finalSig = await signer.signMessage(getBytes(txMsgHash));
  const finalSplit = Signature.from(finalSig);

  const finalTx = [
    ...unsignedTxPayload,
    finalSplit.v % 2, // y_parity
    finalSplit.r,
    finalSplit.s,
  ];

  const encodedFinalTx = rlp.encode(finalTx);
  const rawTx = "0x04" + Buffer.from(encodedFinalTx).toString("hex");
  console.log("Raw transaction:", rawTx);
  // 发送交易
  try {
    // 使用 provider
    const result = await signer.provider.send("eth_sendRawTransaction", [rawTx]);
    console.log("result:", result);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
