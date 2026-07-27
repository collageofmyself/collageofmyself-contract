import * as dotenv from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, task } from "hardhat/config";

import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatChaiMatchers from "@nomicfoundation/hardhat-ethers-chai-matchers";
import hardhatMocha from "@nomicfoundation/hardhat-mocha";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(__dirname, ".env.development") });

// Local plugin that filters Foundry-style `.t.sol` files out of the Hardhat
// build so we can keep Foundry's own test tree inside `contracts/test/`.
const foundryTestFilter = {
  id: "foundry-test-filter",
  hookHandlers: {
    solidity: () => import("./hardhat/hooks/exclude-foundry-tests.js"),
  },
};

// `task()` uses the declarative builder API required by Hardhat 3. It is
// registered via the `tasks` array so the plugin system can pick it up.
const printAccounts = task("accounts", "Prints the list of accounts")
  .setInlineAction(async (_taskArguments, hre) => {
    const { provider } = await hre.network.create();
    const accounts = (await provider.send("eth_accounts", [])) as string[];
    for (const account of accounts) {
      console.log(account);
    }
  })
  .build();

export default defineConfig({
  plugins: [foundryTestFilter, hardhatEthers, hardhatChaiMatchers, hardhatMocha],
  paths: {
    sources: {
      solidity: ["contracts"],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  tasks: [printAccounts],
});
