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

  describe('IERC165 && Ownable', function () {
    it('Deployer shoule be the owner', async function () {
      expect(await collageOfMyselfBridge.owner()).to.equal(owner.address)
    })

    it('Support Interface IERC165', async function () {
      expect(await collageOfMyselfBridge.supportsInterface(0x01ffc9a7)).to.equal(true)
    })

    it('Support Interface ERC721', async function () {
      expect(await collageOfMyselfBridge.supportsInterface(0x80ac58cd)).to.equal(true)
    })

    it('Support Interface ERC721Metadata', async function () {
      expect(await collageOfMyselfBridge.supportsInterface(0x5b5e139f)).to.equal(true)
    })

    it('Support Interface ERC721Enumerable', async function () {
      expect(await collageOfMyselfBridge.supportsInterface(0x780e9d63)).to.equal(true)
    })
  })

  describe('IERC721Metadata', function () {
    it('The name of the NFT Contract is ' + ContractName, async function () {
      expect(await collageOfMyselfBridge.name()).to.equal(ContractName)
    })

    it('The symbol of the NFT Contract is ' + ContractSymbol, async function () {
      expect(await collageOfMyselfBridge.symbol()).to.equal(ContractSymbol)
    })

    it('Total supply is 1 after minting 1', async function () {
      await collageOfMyselfBridge.pause(false)
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)

      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      expect(await collageOfMyselfBridge['isReserved(uint256)'](1)).to.equal(true)
      expect(await collageOfMyselfBridge['isReserved(address,uint256)'](owner.address, 1)).to.equal(true)
      await collageOfMyselfBridge.mint(1)

      expect(await collageOfMyselfBridge.totalSupply()).to.equal(1)
    })
  })

  describe('Supply', function () {
    it('Should set the right owner', async function () {
      expect(await collageOfMyselfBridge.owner()).to.equal(owner.address)
    })
  })

  describe('Mint', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.pause(false)
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 2)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 3)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 4)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 5)
    })

    it('It should activate and mint 5 nfts', async function () {
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.mint(3)
      await collageOfMyselfBridge.mint(4)
      await collageOfMyselfBridge.mint(5)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(5)
    })

    it('It should activate and mint 5 nfts', async function () {
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.mint(3)
      await collageOfMyselfBridge.mint(4)
      await collageOfMyselfBridge.mint(5)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(5)
    })

    it('It should mit 15 more nfts', async function () {
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.mint(3)
      await collageOfMyselfBridge.mint(4)
      await collageOfMyselfBridge.mint(5)
      // Reserve more nfts
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 6)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 7)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 8)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 9)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 10)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 11)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 12)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 13)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 14)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 15)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 16)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 17)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 18)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 19)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 20)
      await collageOfMyselfBridge.mint(6)
      await collageOfMyselfBridge.mint(7)
      await collageOfMyselfBridge.mint(8)
      await collageOfMyselfBridge.mint(9)
      await collageOfMyselfBridge.mint(10)
      await collageOfMyselfBridge.mint(11)
      await collageOfMyselfBridge.mint(12)
      await collageOfMyselfBridge.mint(13)
      await collageOfMyselfBridge.mint(14)
      await collageOfMyselfBridge.mint(15)
      await collageOfMyselfBridge.mint(16)
      await collageOfMyselfBridge.mint(17)
      await collageOfMyselfBridge.mint(18)
      await collageOfMyselfBridge.mint(19)
      await collageOfMyselfBridge.mint(20)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(20)
    })

    it('It should fail minting paused contract', async function () {
      await collageOfMyselfBridge.pause(true)
      let msg
      try {
        await collageOfMyselfBridge.mint(1)
      } catch (error) {
        msg = 'Minting is paused'
      }
      expect(msg).to.equal('Minting is paused')
    })
  })

  describe('Mint from Addr1', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
    })

    it('It should mint 1 nfts', async function () {
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      expect(await collageOfMyselfBridge['isReserved(uint256)'](1)).to.equal(true)
      expect(await collageOfMyselfBridge['isReserved(address,uint256)'](addr1.address, 1)).to.equal(true)
      // Mint
      await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.be.equal(1)
    })

    it('It should mint 1 nfts and set public username', async function () {
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 1)
      expect(await collageOfMyselfBridge['isReserved(uint256)'](1)).to.equal(true)
      expect(await collageOfMyselfBridge['isReserved(address,uint256)'](addr1.address, 1)).to.equal(true)
      // Mint
      await collageOfMyselfBridge.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr1).setPublicUsername('bob')

      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.be.equal(1)
      expect(await collageOfMyselfBridge.publicUsernameOfOwner(addr1.address)).to.equal('bob')
    })
  })

  describe('Mint from Addr2', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
    })

    it('It should mint 2 nfts', async function () {
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 2)
      // Mint
      await collageOfMyselfBridge.connect(addr2).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(2, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr2.address)).to.be.equal(2)
    })

    it('It should mint 3 nfts and set public username', async function () {
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 2)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 3)
      // Mint
      await collageOfMyselfBridge.connect(addr2).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(2, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(3, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).setPublicUsername('notBob')

      expect(await collageOfMyselfBridge.balanceOf(addr2.address)).to.be.equal(3)
      expect(await collageOfMyselfBridge.publicUsernameOfOwner(addr2.address)).to.equal('notBob')
    })
  })

  describe('Mint from Addr3', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
    })

    it('It should mint 1 nfts', async function () {
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr3.address, 1)
      // Mint
      await collageOfMyselfBridge.connect(addr3).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(addr3.address)).to.be.equal(1)
    })

    it('It should mint 1 nfts and set public username', async function () {
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(addr3.address, 1)
      // Mint
      await collageOfMyselfBridge.connect(addr3).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr3).setPublicUsername('Lisa')

      expect(await collageOfMyselfBridge.balanceOf(addr3.address)).to.be.equal(1)
      expect(await collageOfMyselfBridge.publicUsernameOfOwner(addr3.address)).to.be.equal('Lisa')
    })
  })

  describe('Transfer', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
      await collageOfMyselfBridge.pause(false)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      // Mint
      await collageOfMyselfBridge.mint(1)
    })

    it('It should transfer', async function () {
      await collageOfMyselfBridge.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should transferFrom with owner be whitelisted', async function () {
      await collageOfMyselfBridge.setWhitelist(owner.address, true)
      await collageOfMyselfBridge.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should safeTransferFrom', async function () {
      await collageOfMyselfBridge['safeTransferFrom(address,address,uint256)'](owner.address, addr1.address, 1)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should safeTransferFrom with data', async function () {
      await collageOfMyselfBridge['safeTransferFrom(address,address,uint256,bytes)'](owner.address, addr1.address, 1, '0x1234567890')

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should not transfer without balance', async function () {
      await collageOfMyselfBridge.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(1)

      let msg
      try {
        await collageOfMyselfBridge.transferFrom(owner.address, addr1.address, 1)
      } catch (error) {
        msg = 'You must have a token to set your public username'
      }

      expect(msg).to.equal('You must have a token to set your public username')
    })
  })

  describe('Wallet and Display Token URI', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
      await collageOfMyselfBridge.pause(false)
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 2)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 3)
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 4)
      await collageOfMyselfBridge.connect(bridge).reserve(addr1.address, 5)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 6)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 7)
      await collageOfMyselfBridge.connect(bridge).reserve(addr2.address, 8)
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.mint(3)
      await collageOfMyselfBridge.connect(addr1).mint(4, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr1).mint(5, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(6, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(7, { value: ethers.utils.parseEther('1') })
      await collageOfMyselfBridge.connect(addr2).mint(8, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyselfBridge.balanceOf(owner.address)).to.equal(3)
      expect(await collageOfMyselfBridge.balanceOf(addr1.address)).to.equal(2)
      expect(await collageOfMyselfBridge.balanceOf(addr2.address)).to.equal(3)
    })

    it('It should walletOfOwner', async function () {
      expect((await collageOfMyselfBridge.walletOfOwner(owner.address)).length).to.be.equal(3)
      expect((await collageOfMyselfBridge.walletOfOwner(addr1.address)).length).to.be.equal(2)
      expect((await collageOfMyselfBridge.walletOfOwner(addr2.address)).length).to.be.equal(3)
    })

    it('It should tokenURI', async function () {
      expect(await collageOfMyselfBridge.tokenURI(1)).to.be.equal(SetInitBaseURI)
      expect(await collageOfMyselfBridge.tokenURI(2)).to.be.equal(SetInitBaseURI)
    })
  })

  describe('Public username', function () {
    beforeEach(async function () {
      await collageOfMyselfBridge.setBridgeAddress(bridge.address)
      await collageOfMyselfBridge.pause(false)
    })

    it('It if publicUsername is not set, return empty string', async function () {
      expect(await collageOfMyselfBridge.publicUsernameOfOwner(owner.address)).to.equal('')
    })

    it('It should set a public username', async function () {
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 2)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 3)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 4)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 5)
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.mint(3)
      await collageOfMyselfBridge.mint(4)
      await collageOfMyselfBridge.mint(5)
      await collageOfMyselfBridge.setPublicUsername('test')

      expect(await collageOfMyselfBridge.publicUsernameOfOwner(owner.address)).to.equal('test')
    })

    it('It should should return a empty username uf not set', async function () {
      // Reserve
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 1)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 2)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 3)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 4)
      await collageOfMyselfBridge.connect(bridge).reserve(owner.address, 5)
      // Mint
      await collageOfMyselfBridge.mint(1)
      await collageOfMyselfBridge.mint(2)
      await collageOfMyselfBridge.mint(3)
      await collageOfMyselfBridge.mint(4)
      await collageOfMyselfBridge.mint(5)

      expect(await collageOfMyselfBridge.publicUsernameOfOwner(owner.address)).to.equal('')
    })

    it('It should not set a public username without owning 1 nft', async function () {
      let msg
      try {
        // Mint
        await collageOfMyselfBridge.transferFrom(owner.address, addr1.address, 1)
        await collageOfMyselfBridge.setPublicUsername('test')
      } catch (error) {
        msg = 'You must have a token to set your public username'
      }
      expect(msg).to.equal('You must have a token to set your public username')
    })
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
