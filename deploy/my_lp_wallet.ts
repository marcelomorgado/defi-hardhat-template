import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Address } from "../helper";

const ContractName = "MyLpWallet";

const func: DeployFunction = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const MyToken = await get("MyToken");

  await deploy(ContractName, {
    from: deployer,
    args: [MyToken.address, Address.UNISWAP_V2_ROUTER02],
    log: true,
  });
};

export default func;
func.tags = [ContractName];
func.dependencies = ["MyToken"];
