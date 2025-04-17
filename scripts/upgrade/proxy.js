const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🔨 部署 V1...");
  const MyContractV1 = await ethers.getContractFactory("MyContractV1");
  const instance = await upgrades.deployProxy(MyContractV1, [10], {
    initializer: "initialize",
  });
  await instance.waitForDeployment();
  console.log("✅ V1 部署成功，地址：", await instance.getAddress());

  const valueBefore = await instance.getValue();
  console.log("🔍 初始化后的值：", valueBefore.toString()); // 应该是 10

  console.log("🚀 开始升级到 V2...");
  const MyContractV2 = await ethers.getContractFactory("MyContractV2");
  const upgraded = await upgrades.upgradeProxy(await instance.getAddress(), MyContractV2);
  await upgraded.waitForDeployment();
  console.log("✅ 升级完成，地址（应相同）：", await upgraded.getAddress());

  console.log("⚙️ 执行 V2 新函数 doubleValue()...");
  const tx = await upgraded.doubleValue();
  await tx.wait();

  const valueAfter = await upgraded.getValue();
  console.log("✅ 升级后 getValue() =", valueAfter.toString()); // 应该是 20

  const signer = (await ethers.getSigners())[0]; // 当前账户，发交易时用
  new ethers.Contract()
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ 脚本出错:", err);
    process.exit(1);
  });