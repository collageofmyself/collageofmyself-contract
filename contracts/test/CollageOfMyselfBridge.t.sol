// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "./utils/console.sol";
import "./utils/stdlib.sol";
import "./utils/test.sol";
import {CheatCodes} from "./utils/cheatcodes.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import { CollageOfMyselfBridge } from "../CollageOfMyselfBridge.sol";

contract CollageOfMyselfTest is DSTest, IERC721Receiver  {
    Vm public constant vm = Vm(HEVM_ADDRESS);

    CollageOfMyselfBridge private collageOfMyselfBridge;

    // Hardhat console precompile address — treated specially by Forge.
    // Value-bearing calls to it revert, which would otherwise break fuzz tests.
    address constant FORGE_CONSOLE = address(0x000000000000000000636F6e736F6c652e6c6f67);

    string constant SetInitNotRevealedUri = 'ipfs://';
    string constant SetInitBaseURI = 'ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/';
    string constant SetInitTokenName = 'Collage of Myself';
    string constant SetInitTokenSymbol = 'MYSELF';

    uint256 private TEST_mintCost = 1 ether;

    /// @dev Restrict fuzz addresses to EOA-like addresses that can actually receive ETH
    /// and interact with the token as a normal user would.
    ///
    /// Excludes:
    /// - `address(0)` and `HEVM_ADDRESS` (Forge cheatcode dispatcher)
    /// - `FORGE_CONSOLE` (the hardhat console precompile that Forge intercepts)
    /// - addresses with code (would force `_safeMint` to look for an ERC721Receiver)
    /// - the range `0x01..0x0B` (EVM precompiles, which never accept plain ETH)
    function _assumeEOA(address addr) internal {
        vm.assume(addr != address(0));
        vm.assume(addr != FORGE_CONSOLE);
        vm.assume(addr != HEVM_ADDRESS);
        vm.assume(addr.code.length == 0);
        vm.assume(uint160(addr) > 0x0A);
    }

    function setUp() public {
        // Deploy contracts
        collageOfMyselfBridge = new CollageOfMyselfBridge(SetInitNotRevealedUri, SetInitBaseURI);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function test_CollageOfMyselfBridge_name() public {
        assertEq(collageOfMyselfBridge.name(), SetInitTokenName);
    }

    function test_CollageOfMyselfBridge_symbol() public {
        assertEq(collageOfMyselfBridge.symbol(), SetInitTokenSymbol);
    }

    function test_CollageOfMyselfBridge_mintCost() public {
        assertEq(collageOfMyselfBridge.mintCost(), TEST_mintCost);
    }

    function test_CollageOfMyselfBridge_totalSupply_is_1_after_minting_1() public {
        assertEq(collageOfMyselfBridge.balanceOf(address(1)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(1), 1);
        
        uint256 cost = collageOfMyselfBridge.mintCost();

        vm.prank(address(this));
        (bool success, ) = payable(address(1)).call{value: cost}("");
        assertTrue(success);

        vm.prank(address(1));
        collageOfMyselfBridge.mint{value: cost}(1);

        assertEq(collageOfMyselfBridge.balanceOf(address(1)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);
    }

    function test_CollageOfMyselfBridge_isReserved(address to, uint256 tokenId) public {
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(to, tokenId);

        assertTrue(collageOfMyselfBridge.isReserved(tokenId));
    }

    function test_CollageOfMyselfBridge_isReserved2(address to, uint256 tokenId) public {
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(to, tokenId);

        assertTrue(collageOfMyselfBridge.isReserved(to, tokenId));
    }

    function test_CollageOfMyselfBridge_mint_5(address to) public {
        // `to` is the recipient of `_safeMint`, so restrict to EOAs.
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(to), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        for(uint256 i = 1; i <= 5; i++) {
            vm.prank(address(5));
            collageOfMyselfBridge.reserve(to, i);
            assertTrue(collageOfMyselfBridge.isReserved(to, i));
        }
        uint256 cost = collageOfMyselfBridge.mintCost();

        vm.prank(address(this));
        (bool success, ) = payable(to).call{value: cost * 6}("");
        require(success, "funding recipient failed");

        for(uint256 i = 1; i <= 5; i++) {
            vm.prank(address(to));
            collageOfMyselfBridge.mint{value: cost}(i);
        }

        assertEq(collageOfMyselfBridge.balanceOf(to), 5);
        assertEq(collageOfMyselfBridge.totalSupply(), 5);
    }

    function test_CollageOfMyselfBridge_cant_mint_if_paused() public {
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        vm.expectRevert(bytes("Minting is paused"));
        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
    }


    function test_CollageOfMyselfBridge_mint(address to) public {
        // `to` is the recipient of `_safeMint`, so restrict to EOAs.
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(address(to)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(to), 1);

        uint256 cost = collageOfMyselfBridge.mintCost();

        vm.prank(address(this));
        (bool success, ) = payable(to).call{value: cost}("");
        require(success, "funding recipient failed");

        vm.prank(address(to));
        collageOfMyselfBridge.mint{value: cost}(1);

        assertEq(collageOfMyselfBridge.balanceOf(address(to)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);
    }

    function test_CollageOfMyselfBridge_cant_mint_whithout_balance(address to) public {
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(to), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(to), 1);
        

        vm.prank(to);
        vm.expectRevert(bytes("Insufficient funds for minting"));
        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.balanceOf(to), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
    }

    function test_CollageOfMyselfBridge_setPublicUsername() public {
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);
        collageOfMyselfBridge.setPublicUsername("test");

        assertEq(collageOfMyselfBridge.publicUsernameOfOwner(address(this)), "test");
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);
    }

    function test_CollageOfMyselfBridge_publicUsernameOfOwner_if_not_set() public {
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.publicUsernameOfOwner(address(this)), "");
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);
    }

    function test_CollageOfMyselfBridge_setPublicUsername_and_set_again() public {
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);
        collageOfMyselfBridge.setPublicUsername("test");

        assertEq(collageOfMyselfBridge.publicUsernameOfOwner(address(this)), "test");

        collageOfMyselfBridge.setPublicUsername("bob");

        assertEq(collageOfMyselfBridge.publicUsernameOfOwner(address(this)), "bob");
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);
    }

    function test_CollageOfMyselfBridge_setPublicUsername_fuzz(string calldata username) public {
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);
        collageOfMyselfBridge.setPublicUsername(username);

        assertEq(collageOfMyselfBridge.publicUsernameOfOwner(address(this)), username);
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);
    }

    function test_CollageOfMyselfBridge_transferFrom(address to) public {
        vm.assume(to != address(0));
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));

        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);

        collageOfMyselfBridge.transferFrom(address(this), to, 1);
        assertEq(collageOfMyselfBridge.balanceOf(to), 1);
    }

    function test_CollageOfMyselfBridge_transferFrom_fuzz(address from, address to) public {
        // `from` is the recipient of `_safeMint`, so restrict to EOAs.
        _assumeEOA(from);
        vm.assume(to != address(0));

        assertEq(collageOfMyselfBridge.balanceOf(from), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(from), 1);

        vm.prank(address(this));
        uint256 cost = collageOfMyselfBridge.mintCost();

        (bool success, ) = payable(from).call{value: cost}("");
        require(success, "funding sender failed");

        vm.prank(from);
        collageOfMyselfBridge.mint{value: cost}(1);

        assertEq(collageOfMyselfBridge.balanceOf(from), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);

        collageOfMyselfBridge.transferFrom(from, to, 1);
        assertEq(collageOfMyselfBridge.balanceOf(to), 1);
    }

    function test_CollageOfMyselfBridge_safeTransferFrom(address to) public {
        // `to` is the recipient of `_safeTransfer`; restrict to EOAs.
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));

        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);

        collageOfMyselfBridge.safeTransferFrom(address(this), to, 1);
        assertEq(collageOfMyselfBridge.balanceOf(to), 1);
    }

    function test_CollageOfMyselfBridge_safeTransferFrom_fuzz(address from, address to) public {
        // Both are recipients of `_safeMint` / `_safeTransfer`; restrict to EOAs.
        _assumeEOA(from);
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(from), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(from), 1);

        vm.prank(address(this));
        uint256 cost = collageOfMyselfBridge.mintCost();

        (bool success, ) = payable(from).call{value: cost}("");
        require(success, "funding sender failed");

        vm.prank(from);
        collageOfMyselfBridge.mint{value: cost}(1);

        assertEq(collageOfMyselfBridge.balanceOf(from), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);

        collageOfMyselfBridge.safeTransferFrom(from, to, 1);
        assertEq(collageOfMyselfBridge.balanceOf(to), 1);
    }

    function test_CollageOfMyselfBridge_safeTransferFrom2(address to) public {
        // `to` is the recipient of `_safeTransfer`; restrict to EOAs.
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));

        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);

        collageOfMyselfBridge.safeTransferFrom(address(this), to, 1, "");
        assertEq(collageOfMyselfBridge.balanceOf(to), 1);
    }

    function test_CollageOfMyselfBridge_safeTransferFrom2_fuzz(address from, address to) public {
        // Both are recipients of `_safeMint` / `_safeTransfer`; restrict to EOAs.
        _assumeEOA(from);
        _assumeEOA(to);

        assertEq(collageOfMyselfBridge.balanceOf(from), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);

        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(from), 1);

        vm.prank(address(this));
        uint256 cost = collageOfMyselfBridge.mintCost();

        (bool success, ) = payable(from).call{value: cost}("");
        require(success, "funding sender failed");

        vm.prank(from);
        collageOfMyselfBridge.mint{value: cost}(1);

        assertEq(collageOfMyselfBridge.balanceOf(from), 1);
        assertEq(collageOfMyselfBridge.totalSupply(), 1);

        collageOfMyselfBridge.safeTransferFrom(from, to, 1, "");
        assertEq(collageOfMyselfBridge.balanceOf(to), 1);
    }

    function test_CollageOfMyselfBridge_setApprovalForAll() public {
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);

        collageOfMyselfBridge.setApprovalForAll(address(1), true);

        assertTrue(collageOfMyselfBridge.isApprovedForAll(address(this), address(1)));
    }

    function test_CollageOfMyselfBridge_mint3_and_walletOfOwner() public {
        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 0);
        assertEq(collageOfMyselfBridge.totalSupply(), 0);
        
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));

        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);
        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 2);
        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 3);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);
        vm.prank(address(this));
        collageOfMyselfBridge.mint(2);
        vm.prank(address(this));
        collageOfMyselfBridge.mint(3);

        assertEq(collageOfMyselfBridge.walletOfOwner(address(this)).length, 3);

        assertEq(collageOfMyselfBridge.balanceOf(address(this)), 3);
        assertEq(collageOfMyselfBridge.totalSupply(), 3);
    }

    function test_CollageOfMyselfBridge_tokenURI() public {
        collageOfMyselfBridge.pause(false);

        collageOfMyselfBridge.setBridgeAddress(address(5));
        vm.prank(address(5));
        collageOfMyselfBridge.reserve(address(this), 1);

        vm.prank(address(this));
        collageOfMyselfBridge.mint(1);

        assertEq(collageOfMyselfBridge.tokenURI(1), SetInitBaseURI);
    }

    function test_CollageOfMyselfBridge_setmaxMintAmount() public {
        assertEq(collageOfMyselfBridge.maxMintAmount(), 20);
        
        uint256 newmaxMintAmount = 40;

        collageOfMyselfBridge.setMaxMintAmount(newmaxMintAmount);
        assertEq(collageOfMyselfBridge.maxMintAmount(), newmaxMintAmount);
    }

    function test_CollageOfMyselfBridge_setCost() public {
        assertEq(collageOfMyselfBridge.mintCost(), TEST_mintCost);
        
        uint256 newCost = TEST_mintCost * 2;

        collageOfMyselfBridge.setCost(newCost, newCost);
        assertEq(collageOfMyselfBridge.mintCost(), newCost);
    }
}