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
  })

  describe('Admin', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 2)
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 3)
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 4)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 5)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 6)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 7)
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.connect(addr1).mint(3, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr1).mint(4, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(5, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(6, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(7, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(2)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(2)
      expect(await collageOfMyselfBridge.balanceOf(addr2.address)).to.equal(3)

      // Test contract received ether
      expect(await provider.getBalance(collageOfMyselfBridge.address)).to.equal(ethers.utils.parseEther('5'))

      // Deploy Mock ERC20
      MockERC20 = await ethers.getContractFactory('MockERC20')
      mockERC20 = await MockERC20.deploy()
      await mockERC20.deployed()

      await mockERC20.mint(owner.address, ethers.utils.parseEther('1000'))
    })

    it('It should widthdraw', async function () {
      const ownerEthBalance = await provider.getBalance(owner.address)

      await collageOfMyselfBridge.withdraw()

      expect(parseInt((await provider.getBalance(owner.address)).toString())).to.be.greaterThan(parseInt(ownerEthBalance.toString()))
    })

    it('It should setBaseExtension', async function () {
      await collageOfMyselfBridge.setBaseExtension('https://')

      expect(await collageOfMyselfBridge.baseExtension()).to.be.equal('https://')
    })

    it('It should setWmatic', async function () {
      await collageOfMyselfBridge.setWmatic(mockERC20.address)

      expect(await collageOfMyselfBridge.wmatic()).to.be.equal(mockERC20.address)
    })

    it('It should setMaxMintAmount', async function () {
      await collageOfMyselfBridge.setMaxMintAmount(2)

      expect(await collageOfMyselfBridge.maxMintAmount()).to.be.equal(2)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 8)
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 9)
      // Mint
      await collageOfMyselfBridge.connect(addr1).mint(8, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr1).mint(9, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(4)

      let msg
      try {
        await collageOfMyselfBridge.connect(addr2).mint(3, { value: ethers.utils.parseEther('3') })
      } catch (error) {
        msg = 'Mint amount must be less than or equal to 20'
      }

      expect(msg).to.equal('Mint amount must be less than or equal to 20')
    })

    it('It should setCost', async function () {
      await collageOfMyselfBridge.setCost(ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))

      expect(await collageOfMyselfBridge.mintCost()).to.be.equal(ethers.utils.parseEther('2'))
    })

    it('It should setApplyTransferFee', async function () {
      await collageOfMyselfBridge.setWmatic(mockERC20.address)

      expect(await collageOfMyselfBridge.wmatic()).to.be.equal(mockERC20.address)

      await collageOfMyselfBridge.setCost(ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))

      expect(await collageOfMyselfBridge.transferCost()).to.be.equal(ethers.utils.parseEther('1'))

      await collageOfMyselfBridge.setApplyTransferFee(true)

      await mockERC20.approve(collageOfMyselfBridge.address, ethers.utils.parseEther('200000'))

      await collageOfMyselfBridge.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(1)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(3)
    })

    it('It should withdrawERC20', async function () {
      const ownerWmaticBalance = await mockERC20.balanceOf(owner.address)

      expect(ownerWmaticBalance.toString()).to.equal('1000000000000000000000')

      await mockERC20.transfer(collageOfMyselfBridge.address, ethers.utils.parseEther('1'))

      expect(await mockERC20.balanceOf(collageOfMyselfBridge.address)).to.equal(ethers.utils.parseEther('1'))

      await collageOfMyselfBridge.withdrawERC20(mockERC20.address)

      expect((await mockERC20.balanceOf(owner.address)).toString()).to.equal('1000000000000000000000')
    })

    it('It should transferOwnership', async function () {
      await collageOfMyselfBridge.transferOwnership(addr1.address)

      let msg
      try {
        await collageOfMyselfBridge.transferOwnership(addr1.address)
      } catch (error) {
        msg = 'Ownable: caller is not the owner'
      }
      expect(msg).to.equal('Ownable: caller is not the owner')
    })

    it('It should renounceOwnership', async function () {
      await collageOfMyselfBridge.renounceOwnership()

      let msg
      try {
        await collageOfMyselfBridge.renounceOwnership()
      } catch (error) {
        msg = 'Ownable: caller is not the owner'
      }
      expect(msg).to.equal('Ownable: caller is not the owner')
    })

    it('It should reveal URI', async function () {
      const currentURI = await collageOfMyselfBridge.tokenURI(1)

      expect(currentURI).to.equal(SetInitBaseURI)

      await collageOfMyselfBridge.reveal()

      const revealedURI = await collageOfMyselfBridge.tokenURI(1)

      expect(revealedURI).to.equal(SetInitNotRevealedUri + '1' + '.json')
    })
  })
})
