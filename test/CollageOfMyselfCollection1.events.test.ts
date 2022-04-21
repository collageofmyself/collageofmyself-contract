import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers, waffle } from 'hardhat'
// import { expectEvent, expectRevert, BN, time } from "@openzeppelin/test-helpers";
import BigNumber from 'bignumber.js'
import Chance from 'chance'
import chalk from 'chalk'
import figlet from 'figlet'
use(solidity)

const ContractTitle = `CollageOfMyself`
const ContractName = `Collage of Myself`
const ContractSymbol = `MYSELF`

const SetInitNotRevealedUri = 'ipfs://'
const SetInitBaseURI = 'ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/'
const zeroAddress = '0x0000000000000000000000000000000000000000'

const provider = waffle.provider

describe('CollageOfMyself Contract - Events', function () {
  let CollageOfMyself: any
  let collageOfMyself: any
  let MockERC20: any
  let mockERC20: any

  let owner: any
  let addr1: any
  let addr2: any
  let addr3: any

  beforeEach(async function () {
    ;[owner, addr1, addr2, addr3] = await ethers.getSigners()
    CollageOfMyself = await ethers.getContractFactory(ContractTitle)
    collageOfMyself = await CollageOfMyself.deploy(SetInitNotRevealedUri, SetInitBaseURI)
    await collageOfMyself.deployed()
    await collageOfMyself.pause(false)
  })

  describe('ApprovalForAll', function () {
    it('setApprovalForAll emit ApprovalForAll event', async function () {
      const txn = await collageOfMyself.connect(addr1).setApprovalForAll(owner.address, true)
      const receipt = await txn.wait()

      expect(await collageOfMyself.isApprovedForAll(addr1.address, owner.address)).to.equal(true)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyself, 'ApprovalForAll').withArgs(addr1.address, owner.address, true)
    })
  })

  describe('Approval', function () {
    it('approve emit Approval event', async function () {
      await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })
      const txn = await collageOfMyself.connect(addr1).approve(owner.address, 1)
      const receipt = await txn.wait()

      expect(await collageOfMyself.getApproved(1)).to.equal(owner.address)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyself, 'Approval').withArgs(addr1.address, owner.address, 1)
    })
  })

  describe('Transfer', function () {
    it('mint emit Transfer event', async function () {
      const txn = await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })
      const receipt = await txn.wait()

      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyself, 'Transfer').withArgs(zeroAddress, addr1.address, 1)
    })

    it('transferFrom emit Transfer event', async function () {
      await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)

      await collageOfMyself.connect(addr1).approve(addr3.address, 1)
      const txn = await collageOfMyself.connect(addr3).transferFrom(addr1.address, addr2.address, 1)
      const receipt = await txn.wait()

      expect(await collageOfMyself.balanceOf(addr1.address), 'addr1.address').to.equal(0)
      expect(await collageOfMyself.balanceOf(addr2.address), 'addr2.address').to.equal(1)
      expect(receipt.events.length, 'receipt.events.length').to.equal(2)
      await expect(txn, 'receipt.events.args.0').to
        .emit(collageOfMyself, 'Approval').withArgs(addr1.address, zeroAddress, 1)
      await expect(txn, 'receipt.events.args.1').to
        .emit(collageOfMyself, 'Transfer').withArgs(addr1.address, addr2.address, 1)
    })

    it('safeTransferFrom emit Transfer event', async function () {
      await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)

      await collageOfMyself.connect(addr1).approve(addr3.address, 1)
      const txn = await collageOfMyself.connect(addr3)['safeTransferFrom(address,address,uint256)'](addr1.address, addr2.address, 1)
      const receipt = await txn.wait()

      expect(await collageOfMyself.balanceOf(addr1.address), 'addr1.address').to.equal(0)
      expect(await collageOfMyself.balanceOf(addr2.address), 'addr2.address').to.equal(1)
      expect(receipt.events.length, 'receipt.events.length').to.equal(2)
      await expect(txn, 'receipt.events.args.0').to
        .emit(collageOfMyself, 'Approval').withArgs(addr1.address, zeroAddress, 1)
      await expect(txn, 'receipt.events.args.1').to
        .emit(collageOfMyself, 'Transfer').withArgs(addr1.address, addr2.address, 1)
    })

    it('safeTransferFrom emit Transfer event', async function () {
      await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)

      await collageOfMyself.connect(addr1).approve(addr3.address, 1)
      const txn = await collageOfMyself.connect(addr3)['safeTransferFrom(address,address,uint256,bytes)'](addr1.address, addr2.address, 1, "0x")
      const receipt = await txn.wait()

      expect(await collageOfMyself.balanceOf(addr1.address), 'addr1.address').to.equal(0)
      expect(await collageOfMyself.balanceOf(addr2.address), 'addr2.address').to.equal(1)
      expect(receipt.events.length, 'receipt.events.length').to.equal(2)
      await expect(txn, 'receipt.events.args.0').to
        .emit(collageOfMyself, 'Approval').withArgs(addr1.address, zeroAddress, 1)
      await expect(txn, 'receipt.events.args.1').to
        .emit(collageOfMyself, 'Transfer').withArgs(addr1.address, addr2.address, 1)
    })
  })

  describe('OwnershipTransferred', function () {
    it('transferOwnership emit OwnershipTransferred event', async function () {
      const txn = await collageOfMyself.transferOwnership(addr1.address)
      const receipt = await txn.wait()

      expect(await collageOfMyself.owner()).to.equal(addr1.address)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyself, 'OwnershipTransferred').withArgs(owner.address, addr1.address)
    })

    it('renounceOwnership emit OwnershipTransferred event', async function () {
      const txn = await collageOfMyself.renounceOwnership()
      const receipt = await txn.wait()

      expect(await collageOfMyself.owner()).to.equal(zeroAddress)
      expect(receipt.events.length).to.equal(1)
      await expect(txn).to.emit(collageOfMyself, 'OwnershipTransferred').withArgs(owner.address, zeroAddress)
    })
  })
})
