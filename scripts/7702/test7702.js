// scripts/send7702Tx.js
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [sender] = await ethers.getSigners();

  // 1. 获取临时合约字节码
  const Temp = await ethers.getContractFactory("TemporaryLogic");
  const tempBytecode = Temp.bytecode;

  // 2. 部署目标合约（模拟目标）
  const Target = await ethers.getContractFactory("TargetContract");
  const target = await Target.deploy();
  await target.waitForDeployment();
  console.log("Target Contract:", await target.getAddress());

  // 3. 构造调用 setValue(uint256)
  const iface = new ethers.Interface(["function setValue(uint256)"]);
  const calldata = iface.encodeFunctionData("setValue", [42]);

  // 4. 构造一笔"EIP-7702 风格"的交易（注：目前以注释形式表达）
  const tx = {
    from: await sender.getAddress(),
    to: await target.getAddress(),
    data: calldata,
    gasLimit: 500000,
    // 假设 EVM 支持 EIP-7702 的字段：
    contract_code: tempBytecode, // 🔥 这是关键字段，当前链还不支持
  };

  // ⚠️ 目前 ethers.js 不支持 contract_code 字段，这里模拟发送
  console.log("🚀 模拟发送包含 contract_code 的交易：");
  console.log({
    ...tx,
    note: "contract_code 为模拟字段，仅用于 EIP-7702 解释演示"
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});