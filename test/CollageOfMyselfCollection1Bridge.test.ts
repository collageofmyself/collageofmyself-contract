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
  let CollageOfMyself: any
  let collageOfMyself: any
  let MockERC20: any
  let mockERC20: any

  let owner: any
  let addr1: any
  let addr2: any
  let addr3: any
  let bridge: any

  beforeEach(async function () {
    ;[owner, addr1, addr2, addr3, bridge] = await ethers.getSigners()
    CollageOfMyself = await ethers.getContractFactory(ContractTitle)
    collageOfMyself = await CollageOfMyself.deploy(SetInitNotRevealedUri, SetInitBaseURI)
    await collageOfMyself.deployed()
  })

  describe('IERC165 && Ownable', function () {
    it('Deployer shoule be the owner', async function () {
      expect(await collageOfMyself.owner()).to.equal(owner.address)
    })

    it('Support Interface IERC165', async function () {
      expect(await collageOfMyself.supportsInterface(0x01ffc9a7)).to.equal(true)
    })

    it('Support Interface ERC721', async function () {
      expect(await collageOfMyself.supportsInterface(0x80ac58cd)).to.equal(true)
    })

    it('Support Interface ERC721Metadata', async function () {
      expect(await collageOfMyself.supportsInterface(0x5b5e139f)).to.equal(true)
    })

    it('Support Interface ERC721Enumerable', async function () {
      expect(await collageOfMyself.supportsInterface(0x780e9d63)).to.equal(true)
    })
  })

  describe('IERC721Metadata', function () {
    it('The name of the NFT Contract is ' + ContractName, async function () {
      expect(await collageOfMyself.name()).to.equal(ContractName)
    })

    it('The symbol of the NFT Contract is ' + ContractSymbol, async function () {
      expect(await collageOfMyself.symbol()).to.equal(ContractSymbol)
    })

    it('Total supply is 1 after minting 1', async function () {
      await collageOfMyself.pause(false)
      await collageOfMyself.setBridgeAddress(bridge.address)
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      await collageOfMyself.mint(1)

      expect(await collageOfMyself.totalSupply()).to.equal(1)
    })
  })

  describe('Supply', function () {
    it('Should set the right owner', async function () {
      expect(await collageOfMyself.owner()).to.equal(owner.address)
    })
  })

  describe('Mint', function () {
    beforeEach(async function () {
      await collageOfMyself.pause(false)
      await collageOfMyself.setBridgeAddress(bridge.address)
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      await collageOfMyself.connect(bridge).reserve(owner.address, 2)
      await collageOfMyself.connect(bridge).reserve(owner.address, 3)
      await collageOfMyself.connect(bridge).reserve(owner.address, 4)
      await collageOfMyself.connect(bridge).reserve(owner.address, 5)
    })

    it('It should activate and mint 5 nfts', async function () {
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.mint(3)
      await collageOfMyself.mint(4)
      await collageOfMyself.mint(5)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(5)
    })

    it('It should activate and mint 5 nfts', async function () {
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.mint(3)
      await collageOfMyself.mint(4)
      await collageOfMyself.mint(5)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(5)
    })

    it('It should mit 15 more nfts', async function () {
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.mint(3)
      await collageOfMyself.mint(4)
      await collageOfMyself.mint(5)
      // Reserve more nfts
      await collageOfMyself.connect(bridge).reserve(owner.address, 6)
      await collageOfMyself.connect(bridge).reserve(owner.address, 7)
      await collageOfMyself.connect(bridge).reserve(owner.address, 8)
      await collageOfMyself.connect(bridge).reserve(owner.address, 9)
      await collageOfMyself.connect(bridge).reserve(owner.address, 10)
      await collageOfMyself.connect(bridge).reserve(owner.address, 11)
      await collageOfMyself.connect(bridge).reserve(owner.address, 12)
      await collageOfMyself.connect(bridge).reserve(owner.address, 13)
      await collageOfMyself.connect(bridge).reserve(owner.address, 14)
      await collageOfMyself.connect(bridge).reserve(owner.address, 15)
      await collageOfMyself.connect(bridge).reserve(owner.address, 16)
      await collageOfMyself.connect(bridge).reserve(owner.address, 17)
      await collageOfMyself.connect(bridge).reserve(owner.address, 18)
      await collageOfMyself.connect(bridge).reserve(owner.address, 19)
      await collageOfMyself.connect(bridge).reserve(owner.address, 20)
      await collageOfMyself.mint(6)
      await collageOfMyself.mint(7)
      await collageOfMyself.mint(8)
      await collageOfMyself.mint(9)
      await collageOfMyself.mint(10)
      await collageOfMyself.mint(11)
      await collageOfMyself.mint(12)
      await collageOfMyself.mint(13)
      await collageOfMyself.mint(14)
      await collageOfMyself.mint(15)
      await collageOfMyself.mint(16)
      await collageOfMyself.mint(17)
      await collageOfMyself.mint(18)
      await collageOfMyself.mint(19)
      await collageOfMyself.mint(20)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(20)
    })

    it('It should fail minting paused contract', async function () {
      await collageOfMyself.pause(true)
      let msg
      try {
        await collageOfMyself.mint(1)
      } catch (error) {
        msg = 'Minting is paused'
      }
      expect(msg).to.equal('Minting is paused')
    })
  })

  describe('Mint from Addr1', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
    })

    it('It should mint 1 nfts', async function () {
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr1.address, 1)
      // Mint
      await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr1.address)).to.be.equal(1)
    })

    it('It should mint 1 nfts and set public username', async function () {
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr1.address, 1)
      // Mint
      await collageOfMyself.connect(addr1).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr1).setPublicUsername('bob')

      expect(await collageOfMyself.balanceOf(addr1.address)).to.be.equal(1)
      expect(await collageOfMyself.publicUsernameOfOwner(addr1.address)).to.equal('bob')
    })
  })

  describe('Mint from Addr2', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
    })

    it('It should mint 2 nfts', async function () {
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr2.address, 1)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 2)
      // Mint
      await collageOfMyself.connect(addr2).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(2, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr2.address)).to.be.equal(2)
    })

    it('It should mint 3 nfts and set public username', async function () {
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr2.address, 1)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 2)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 3)
      // Mint
      await collageOfMyself.connect(addr2).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(2, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(3, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).setPublicUsername('notBob')

      expect(await collageOfMyself.balanceOf(addr2.address)).to.be.equal(3)
      expect(await collageOfMyself.publicUsernameOfOwner(addr2.address)).to.equal('notBob')
    })
  })

  describe('Mint from Addr3', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
    })

    it('It should mint 1 nfts', async function () {
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr3.address, 1)
      // Mint
      await collageOfMyself.connect(addr3).mint(1, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr3.address)).to.be.equal(1)
    })

    it('It should mint 1 nfts and set public username', async function () {
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr3.address, 1)
      // Mint
      await collageOfMyself.connect(addr3).mint(1, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr3).setPublicUsername('Lisa')

      expect(await collageOfMyself.balanceOf(addr3.address)).to.be.equal(1)
      expect(await collageOfMyself.publicUsernameOfOwner(addr3.address)).to.be.equal('Lisa')
    })
  })

  describe('Transfer', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
      await collageOfMyself.pause(false)
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      // Mint
      await collageOfMyself.mint(1)
    })

    it('It should transfer', async function () {
      await collageOfMyself.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should transferFrom with owner be whitelisted', async function () {
      await collageOfMyself.setWhitelist(owner.address, true)
      await collageOfMyself.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should safeTransferFrom', async function () {
      await collageOfMyself['safeTransferFrom(address,address,uint256)'](owner.address, addr1.address, 1)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should safeTransferFrom with data', async function () {
      await collageOfMyself['safeTransferFrom(address,address,uint256,bytes)'](owner.address, addr1.address, 1, '0x1234567890')

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)
    })

    it('It should not transfer without balance', async function () {
      await collageOfMyself.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(0)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(1)

      let msg
      try {
        await collageOfMyself.transferFrom(owner.address, addr1.address, 1)
      } catch (error) {
        msg = 'You must have a token to set your public username'
      }

      expect(msg).to.equal('You must have a token to set your public username')
    })
  })

  describe('Wallet and Display Token URI', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      await collageOfMyself.connect(bridge).reserve(owner.address, 2)
      await collageOfMyself.connect(bridge).reserve(owner.address, 3)
      await collageOfMyself.connect(bridge).reserve(addr1.address, 4)
      await collageOfMyself.connect(bridge).reserve(addr1.address, 5)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 6)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 7)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 8)
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.mint(3)
      await collageOfMyself.connect(addr1).mint(4, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr1).mint(5, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(6, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(7, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(8, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(3)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(2)
      expect(await collageOfMyself.balanceOf(addr2.address)).to.equal(3)
    })

    it('It should walletOfOwner', async function () {
      expect((await collageOfMyself.walletOfOwner(owner.address)).length).to.be.equal(3)
      expect((await collageOfMyself.walletOfOwner(addr1.address)).length).to.be.equal(2)
      expect((await collageOfMyself.walletOfOwner(addr2.address)).length).to.be.equal(3)
    })

    it('It should tokenURI', async function () {
      expect(await collageOfMyself.tokenURI(1)).to.be.equal(SetInitBaseURI)
      expect(await collageOfMyself.tokenURI(2)).to.be.equal(SetInitBaseURI)
    })
  })

  describe('Public username', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
      await collageOfMyself.pause(false)
    })

    it('It should set a public username', async function () {
      // Reserve
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      await collageOfMyself.connect(bridge).reserve(owner.address, 2)
      await collageOfMyself.connect(bridge).reserve(owner.address, 3)
      await collageOfMyself.connect(bridge).reserve(owner.address, 4)
      await collageOfMyself.connect(bridge).reserve(owner.address, 5)
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.mint(3)
      await collageOfMyself.mint(4)
      await collageOfMyself.mint(5)
      await collageOfMyself.setPublicUsername('test')

      expect(await collageOfMyself.publicUsernameOfOwner(owner.address)).to.equal('test')
    })

    it('It should should return a empty username uf not set', async function () {
      // Reserve
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      await collageOfMyself.connect(bridge).reserve(owner.address, 2)
      await collageOfMyself.connect(bridge).reserve(owner.address, 3)
      await collageOfMyself.connect(bridge).reserve(owner.address, 4)
      await collageOfMyself.connect(bridge).reserve(owner.address, 5)
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.mint(3)
      await collageOfMyself.mint(4)
      await collageOfMyself.mint(5)

      expect(await collageOfMyself.publicUsernameOfOwner(owner.address)).to.equal('')
    })

    it('It should not set a public username without owning 1 nft', async function () {
      let msg
      try {
        // Mint
        await collageOfMyself.transferFrom(owner.address, addr1.address, 1)
        await collageOfMyself.setPublicUsername('test')
      } catch (error) {
        msg = 'You must have a token to set your public username'
      }
      expect(msg).to.equal('You must have a token to set your public username')
    })
  })

  describe('Admin', function () {
    beforeEach(async function () {
      await collageOfMyself.setBridgeAddress(bridge.address)
      await collageOfMyself.pause(false)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(owner.address, 1)
      await collageOfMyself.connect(bridge).reserve(owner.address, 2)
      await collageOfMyself.connect(bridge).reserve(addr1.address, 3)
      await collageOfMyself.connect(bridge).reserve(addr1.address, 4)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 5)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 6)
      await collageOfMyself.connect(bridge).reserve(addr2.address, 7)
      // Mint
      await collageOfMyself.mint(1)
      await collageOfMyself.mint(2)
      await collageOfMyself.connect(addr1).mint(3, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr1).mint(4, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(5, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(6, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr2).mint(7, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(2)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(2)
      expect(await collageOfMyself.balanceOf(addr2.address)).to.equal(3)

      // Test contract received ether
      expect(await provider.getBalance(collageOfMyself.address)).to.equal(ethers.utils.parseEther('5'))

      // Deploy Mock ERC20
      MockERC20 = await ethers.getContractFactory('MockERC20')
      mockERC20 = await MockERC20.deploy()
      await mockERC20.deployed()

      await mockERC20.mint(owner.address, ethers.utils.parseEther('1000'))
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
      await collageOfMyself.setWmatic(mockERC20.address)

      expect(await collageOfMyself.wmatic()).to.be.equal(mockERC20.address)
    })

    it('It should setMaxMintAmount', async function () {
      await collageOfMyself.setMaxMintAmount(2)

      expect(await collageOfMyself.maxMintAmount()).to.be.equal(2)
      // Reserve
      await collageOfMyself.connect(bridge).reserve(addr1.address, 8)
      await collageOfMyself.connect(bridge).reserve(addr1.address, 9)
      // Mint
      await collageOfMyself.connect(addr1).mint(8, { value: ethers.utils.parseEther('1') })
      await collageOfMyself.connect(addr1).mint(9, { value: ethers.utils.parseEther('1') })

      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(4)

      let msg
      try {
        await collageOfMyself.connect(addr2).mint(3, { value: ethers.utils.parseEther('3') })
      } catch (error) {
        msg = 'Mint amount must be less than or equal to 20'
      }

      expect(msg).to.equal('Mint amount must be less than or equal to 20')
    })

    it('It should setCost', async function () {
      await collageOfMyself.setCost(ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))

      expect(await collageOfMyself.mintCost()).to.be.equal(ethers.utils.parseEther('2'))
    })

    it('It should setApplyTransferFee', async function () {
      await collageOfMyself.setWmatic(mockERC20.address)

      expect(await collageOfMyself.wmatic()).to.be.equal(mockERC20.address)

      await collageOfMyself.setCost(ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))

      expect(await collageOfMyself.transferCost()).to.be.equal(ethers.utils.parseEther('1'))

      await collageOfMyself.setApplyTransferFee(true)

      await mockERC20.approve(collageOfMyself.address, ethers.utils.parseEther('200000'))

      await collageOfMyself.transferFrom(owner.address, addr1.address, 1)

      expect(await collageOfMyself.balanceOf(owner.address)).to.equal(1)
      expect(await collageOfMyself.balanceOf(addr1.address)).to.equal(3)
    })

    it('It should withdrawERC20', async function () {
      const ownerWmaticBalance = await mockERC20.balanceOf(owner.address)

      expect(ownerWmaticBalance.toString()).to.equal('1000000000000000000000')

      await mockERC20.transfer(collageOfMyself.address, ethers.utils.parseEther('1'))

      expect(await mockERC20.balanceOf(collageOfMyself.address)).to.equal(ethers.utils.parseEther('1'))

      await collageOfMyself.withdrawERC20(mockERC20.address)

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
