import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const ContractName = "MyLpWallet";

const func: DeployFunction = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const MyToken = await get("MyToken");

  await deploy(ContractName, {
    from: deployer,
    args: [MyToken.address],
    log: true,
  });
};

export default func;
func.tags = [ContractName];
func.dependencies = ["MyToken"];
