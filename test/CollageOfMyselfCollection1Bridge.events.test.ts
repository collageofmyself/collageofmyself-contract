import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers, waffle } from 'hardhat'
// import { expectEvent, expectRevert, BN, time } from "@openzeppelin/test-helpers";
import BigNumber from 'bignumber.js'
import Chance from 'chance'
import chalk from 'chalk'
use(solidity)

const ContractTitle = `CollageOfMyselfBridge`
const ContractName = `Collage of Myself`
const ContractSymbol = `MYSELF`

const SetInitNotRevealedUri = 'ipfs://'
const SetInitBaseURI = 'ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/'
const zeroAddress = '0x0000000000000000000000000000000000000000'

const provider = waffle.provider

describe('CollageOfMyselfBridge Contract', function () {
  let CollageOfMyselfBridge: any
  let collageOfMyselfBridge: any
  let MockERC20: any
  let mockERC20: any

  let owner: any
  let addr1: any
  let addr2: any
  let addr3: any
  let bridge: any

  beforeEach(async function () {
    ;[owner, addr1, addr2, addr3, bridge] = await ethers.getSigners()
    CollageOfMyselfBridge = await ethers.getContractFactory(ContractTitle)
    collageOfMyselfBridge = await CollageOfMyselfBridge.deploy(SetInitNotRevealedUri, SetInitBaseURI)
    await collageOfMyselfBridge.deployed()
    await collageOfMyselfBridge.pause(false)
    await collageOfMyselfBridge.setBridgeAddress(bridge.address)
  })

  describe('ApprovalForAll', function () {
    it('setApprovalForAll emit ApprovalForAll event', async function () {
      const txn = await collageOfMyselfBridge.connect(addr1).setApprovalForAll(owner.address, true)
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.isApprovedForAll(addr1.address, owner.address)).to.equal(true)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyselfBridge, 'ApprovalForAll').withArgs(addr1.address, owner.address, true)
    })
  })

  describe('Approval', function () {
    it('approve emit Approval event', async function () {
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })
      const txn = await collageOfMyselfBridge.connect(addr1).approve(owner.address, 1)
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.getApproved(1)).to.equal(owner.address)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyselfBridge, 'Approval').withArgs(addr1.address, owner.address, 1)
    })
  })

  describe('Transfer', function () {
    it('mint emit Transfer event', async function () {
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      const txn = await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyselfBridge, 'Transfer').withArgs(zeroAddress, addr1.address, 1)
    })

    it('transferFrom emit Transfer event', async function () {
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)

      await collageOfMyselfBridge.connect(addr1).approve(addr3.address, 1)
      const txn = await collageOfMyselfBridge.connect(addr3).transferFrom(addr1.address, addr2.address, 1)
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.balanceOf(addr1.address), 'addr1.address').to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr2.address), 'addr2.address').to.equal(1)
      expect(receipt.events.length, 'receipt.events.length').to.equal(2)
      await expect(txn, 'receipt.events.args.0').to
        .emit(collageOfMyselfBridge, 'Approval').withArgs(addr1.address, zeroAddress, 1)
      await expect(txn, 'receipt.events.args.1').to
        .emit(collageOfMyselfBridge, 'Transfer').withArgs(addr1.address, addr2.address, 1)
    })

    it('safeTransferFrom emit Transfer event', async function () {
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)

      await collageOfMyselfBridge.connect(addr1).approve(addr3.address, 1)
      const txn = await collageOfMyselfBridge.connect(addr3)['safeTransferFrom(address,address,uint256)'](addr1.address, addr2.address, 1)
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.balanceOf(addr1.address), 'addr1.address').to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr2.address), 'addr2.address').to.equal(1)
      expect(receipt.events.length, 'receipt.events.length').to.equal(2)
      await expect(txn, 'receipt.events.args.0').to
        .emit(collageOfMyselfBridge, 'Approval').withArgs(addr1.address, zeroAddress, 1)
      await expect(txn, 'receipt.events.args.1').to
        .emit(collageOfMyselfBridge, 'Transfer').withArgs(addr1.address, addr2.address, 1)
    })

    it('safeTransferFrom emit Transfer event', async function () {
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)

      await collageOfMyselfBridge.connect(addr1).approve(addr3.address, 1)
      const txn = await collageOfMyselfBridge.connect(addr3)['safeTransferFrom(address,address,uint256,bytes)'](addr1.address, addr2.address, 1, "0x")
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.balanceOf(addr1.address), 'addr1.address').to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr2.address), 'addr2.address').to.equal(1)
      expect(receipt.events.length, 'receipt.events.length').to.equal(2)
      await expect(txn, 'receipt.events.args.0').to
        .emit(collageOfMyselfBridge, 'Approval').withArgs(addr1.address, zeroAddress, 1)
      await expect(txn, 'receipt.events.args.1').to
        .emit(collageOfMyselfBridge, 'Transfer').withArgs(addr1.address, addr2.address, 1)
    })
  })

  describe('OwnershipTransferred', function () {
    it('transferOwnership emit OwnershipTransferred event', async function () {
      const txn = await collageOfMyselfBridge.transferOwnership(addr1.address)
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.owner()).to.equal(addr1.address)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyselfBridge, 'OwnershipTransferred').withArgs(owner.address, addr1.address)
    })

    it('renounceOwnership emit OwnershipTransferred event', async function () {
      const txn = await collageOfMyselfBridge.renounceOwnership()
      const receipt = await txn.wait()

      expect(await collageOfMyselfBridge.owner()).to.equal(zeroAddress)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyselfBridge, 'OwnershipTransferred').withArgs(owner.address, zeroAddress)
    })
  })
})
