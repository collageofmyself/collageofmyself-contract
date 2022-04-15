import { ethers, addressBook, network } from 'hardhat'
import chalk from 'chalk'

async function main() {
  const [deployer] = await ethers.getSigners()

  // Get accounts balance
  const balance = await deployer.getBalance()
  console.log(chalk.green('Connecting to network: '), network.name)
  console.log(chalk.green('Account balance: '), balance.toString())

  // We get the contract to deploy
  const CollageOfMyself = await ethers.getContractFactory('CollageOfMyself')
  const collageOfMyself = await CollageOfMyself.connect(deployer).deploy('ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/', 'https://')

  await collageOfMyself.deployed()
  addressBook.saveContract('CollageOfMyself', collageOfMyself.address, network.name, deployer.address)

  console.log(chalk.blue('CollageOfMyself deployed to:', collageOfMyself.address))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
