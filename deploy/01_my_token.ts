import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { DeployResult } from "hardhat-deploy/dist/types";

const { DEPLOY_LOG } = process.env;

const ContractName = "MyToken";

const func: DeployFunction = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const { address }: DeployResult = await deploy(ContractName, {
    from: deployer,
    args: [],
    log: DEPLOY_LOG === "true",
  });

  console.log(`${ContractName} deployed to ${address}`);
};

export default func;
func.tags = [ContractName];
