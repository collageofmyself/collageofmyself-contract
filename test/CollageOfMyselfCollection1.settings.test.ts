import { expect } from 'chai'
import { network } from 'hardhat'
// import { expectEvent, expectRevert, BN, time } from "@openzeppelin/test-helpers";
import BigNumber from 'bignumber.js'
import Chance from 'chance'
import chalk from 'chalk'
import figlet from 'figlet'

const ContractTitle = `CollageOfMyself`
const ContractName = `Collage of Myself`
const ContractSymbol = `MYSELF`

const SetInitNotRevealedUri = 'ipfs://'
const SetInitBaseURI = 'ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/'

let provider: any

describe('CollageOfMyself Contract - Settings', function () {
  let ethers: any
  let CollageOfMyself: any
  let collageOfMyself: any
  let MockERC20: any
  let mockERC20: any

  let owner: any
  let addr1: any
  let addr2: any
  let addr3: any

  before(async function () {
    ;({ ethers } = await network.create())
    provider = ethers.provider
  })

  beforeEach(async function () {
    ;[owner, addr1, addr2, addr3] = await ethers.getSigners()
    CollageOfMyself = await ethers.getContractFactory(ContractTitle)
    collageOfMyself = await CollageOfMyself.deploy(SetInitNotRevealedUri, SetInitBaseURI)
    await collageOfMyself.waitForDeployment()
  })

  describe('Admin', function () {
    beforeEach(async function () {
      await collageOfMyself.pause(false)
      // Mint
      await collageOfMyself.mint(2)
      await collageOfMyself.connect(addr1).mint(2, { value: ethers.parseEther('2') })
      await collageOfMyself.connect(addr2).mint(3, { value: ethers.parseEther('3') })

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(2)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(2)
      expect(await collageOfMyself.balanceOf(addr2.address)).to.equal(3)

      // Test contract received ether
      expect(await provider.getBalance(collageOfMyself.target)).to.equal(ethers.parseEther('5'))

      // Deploy Mock ERC20
      MockERC20 = await ethers.getContractFactory('MockERC20')
      mockERC20 = await MockERC20.deploy()
      await mockERC20.waitForDeployment()

      await mockERC20.mint(owner.address, ethers.parseEther('1000'))
    })

    it('It should widthdraw', async function () {
      const ownerEthBalance = await provider.getBalance(owner.address)

      await collageOfMyself.withdraw()

      expect(parseInt((await provider.getBalance(owner.address)).toString())).to.be.greaterThan(parseInt(ownerEthBalance.toString()))
    })

    it('It should setBaseExtension', async function () {
      await collageOfMyself.setBaseExtension('https://')

      expect(await collageOfMyself.baseExtension()).to.be.equal('https://')
    })

    it('It should setWmatic', async function () {
      await collageOfMyself.setWmatic(mockERC20.target)

      expect(await collageOfMyself.wmatic()).to.be.equal(mockERC20.target)
    })

    it('It should setmaxMintAmount', async function () {
      await collageOfMyself.setmaxMintAmount(2)

      expect(await collageOfMyself.maxMintAmount()).to.be.equal(2)

      await collageOfMyself.connect(addr1).mint(2, { value: ethers.parseEther('2') })

      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(4)

      let msg
      try {
        await collageOfMyself.connect(addr2).mint(3, { value: ethers.parseEther('3') })
      } catch (error) {
        msg = 'Mint amount must be less than or equal to 20'
      }

      expect(msg).to.equal('Mint amount must be less than or equal to 20')
    })

    it('It should setCost', async function () {
      await collageOfMyself.setCost(ethers.parseEther('2'), ethers.parseEther('1'))

      expect(await collageOfMyself.mintCost()).to.be.equal(ethers.parseEther('2'))
    })

    it('It should setApplyTransferFee', async function () {
      await collageOfMyself.setWmatic(mockERC20.target)

      expect(await collageOfMyself.wmatic()).to.be.equal(mockERC20.target)

      await collageOfMyself.setCost(ethers.parseEther('2'), ethers.parseEther('1'))

      expect(await collageOfMyself.transferCost()).to.be.equal(ethers.parseEther('1'))

      await collageOfMyself.setApplyTransferFee(true)

      await mockERC20.approve(collageOfMyself.target, ethers.parseEther('200000'))

      let msg
      try {
        await collageOfMyself.transferFrom(owner.address, addr1.address, 1)
      } catch (error) {
        msg = 'ERC20: transfer amount exceeds balance'
      }

      expect(msg).to.equal('ERC20: transfer amount exceeds balance')

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(2)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(2)
    })

    it('It should withdrawERC20', async function () {
      const ownerWmaticBalance = await mockERC20.balanceOf(owner.address)

      expect(ownerWmaticBalance.toString()).to.equal('1000000000000000000000')

      await mockERC20.transfer(collageOfMyself.target, ethers.parseEther('1'))

      expect(await mockERC20.balanceOf(collageOfMyself.target)).to.equal(ethers.parseEther('1'))

      await collageOfMyself.withdrawERC20(mockERC20.target)

      expect((await mockERC20.balanceOf(owner.address)).toString()).to.equal('1000000000000000000000')
    })

    it('It should transferOwnership', async function () {
      await collageOfMyself.transferOwnership(addr1.address)

      let msg
      try {
        await collageOfMyself.transferOwnership(addr1.address)
      } catch (error) {
        msg = 'Ownable: caller is not the owner'
      }
      expect(msg).to.equal('Ownable: caller is not the owner')
    })

    it('It should renounceOwnership', async function () {
      await collageOfMyself.renounceOwnership()

      let msg
      try {
        await collageOfMyself.renounceOwnership()
      } catch (error) {
        msg = 'Ownable: caller is not the owner'
      }
      expect(msg).to.equal('Ownable: caller is not the owner')
    })

    it('It should reveal URI', async function () {
      const currentURI = await collageOfMyself.tokenURI(1)

      expect(currentURI).to.equal(SetInitBaseURI)

      await collageOfMyself.reveal()

      const revealedURI = await collageOfMyself.tokenURI(1)

      expect(revealedURI).to.equal(SetInitNotRevealedUri + '1' + '.json')
    })
  })
})
