// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "./utils/console.sol";
import "./utils/stdlib.sol";
import "./utils/test.sol";
import {CheatCodes} from "./utils/cheatcodes.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import { CollageOfMyself } from "../CollageOfMyself.sol";

contract CollageOfMyselfTest is DSTest, IERC721Receiver  {
    Vm public constant vm = Vm(HEVM_ADDRESS);

    CollageOfMyself private collageOfMyself;
    
    string constant SetInitNotRevealedUri = 'ipfs://';
    string constant SetInitBaseURI = 'ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/';
    string constant SetInitTokenName = 'Collage of Myself';
    string constant SetInitTokenSymbol = 'MYSELF';

    uint256 private TEST_mintCost = 1 ether;

    function setUp() public {
        // Deploy contracts
        collageOfMyself = new CollageOfMyself(SetInitNotRevealedUri, SetInitBaseURI);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function test_CollageOfMyself_name() public {
        assertEq(collageOfMyself.name(), SetInitTokenName);
    }

    function test_CollageOfMyself_symbol() public {
        assertEq(collageOfMyself.symbol(), SetInitTokenSymbol);
    }

    function test_CollageOfMyself_mintCost() public {
        assertEq(collageOfMyself.mintCost(), TEST_mintCost);
    }

    function test_CollageOfMyself_totalSupply_is_1_after_minting_1() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);
    }

    function test_CollageOfMyself_mint_5() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(5);

        assertEq(collageOfMyself.balanceOf(address(this)), 5);
        assertEq(collageOfMyself.totalSupply(), 5);
    }

    function test_CollageOfMyself_cant_mint_if_paused() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        vm.expectRevert(bytes("Minting is paused"));
        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
    }

    function test_CollageOfMyself_mint(address to, uint256 qty) public {
        vm.assume(to != address(0));
        vm.assume(qty > 0 && qty <= collageOfMyself.maxMintAmount());

        assertEq(collageOfMyself.balanceOf(to), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);
        console.log("balanceContract", address(this).balance);
        console.log("balanceTo", to.balance);

        uint256 cost = (collageOfMyself.mintCost() * qty);

        (bool success, ) = payable(to).call{value: cost}("");
        assertTrue(success);

        vm.prank(to);
        vm.roll(block.number + 1);

        console.log("balanceContract", address(this).balance);
        console.log("balanceTo", to.balance);
        console.log("qty", qty);

        collageOfMyself.mint{value: cost}(qty);

        assertEq(collageOfMyself.balanceOf(to), qty);
        assertEq(collageOfMyself.totalSupply(), qty);
    }

    function test_CollageOfMyself_cant_mint_whithout_balance(address to) public {
        vm.assume(to != address(0));

        assertEq(collageOfMyself.balanceOf(to), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        vm.prank(to);
        vm.expectRevert(bytes("Insufficient funds for minting"));
        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(to), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
    }

    function test_CollageOfMyself_setPublicUsername() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);
        collageOfMyself.setPublicUsername("test");

        assertEq(collageOfMyself.publicUsernameOfOwner(address(this)), "test");
        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);
    }

    function test_CollageOfMyself_publicUsernameOfOwner_if_not_set() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.publicUsernameOfOwner(address(this)), "");
        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);
    }

    function test_CollageOfMyself_setPublicUsername_and_set_again() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);
        collageOfMyself.setPublicUsername("test");

        assertEq(collageOfMyself.publicUsernameOfOwner(address(this)), "test");

        collageOfMyself.setPublicUsername("bob");

        assertEq(collageOfMyself.publicUsernameOfOwner(address(this)), "bob");
        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);
    }

    function test_CollageOfMyself_setPublicUsername_fuzz(string calldata username) public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);
        collageOfMyself.setPublicUsername(username);

        assertEq(collageOfMyself.publicUsernameOfOwner(address(this)), username);
        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);
    }

    function test_CollageOfMyself_transferFrom(address to) public {
        vm.assume(to != address(0));
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        uint256 cost = collageOfMyself.mintCost();

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);

        collageOfMyself.transferFrom(address(this), to, 1);
        assertEq(collageOfMyself.balanceOf(to), 1);
    }

    function test_CollageOfMyself_transferFrom_fuzz(address from, address to) public {
        vm.assume(from != address(0) && to != address(0));
        assertEq(collageOfMyself.balanceOf(from), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        uint256 cost = collageOfMyself.mintCost();

        (bool success, ) = payable(from).call{value: cost}("");
        assertTrue(success);

        vm.prank(from);
        collageOfMyself.mint{value: cost}(1);

        assertEq(collageOfMyself.balanceOf(from), 1);
        assertEq(collageOfMyself.totalSupply(), 1);

        collageOfMyself.transferFrom(from, to, 1);
        assertEq(collageOfMyself.balanceOf(to), 1);
    }

    function test_CollageOfMyself_safeTransferFrom(address to) public {
        vm.assume(to != address(0));
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        uint256 cost = collageOfMyself.mintCost();

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);

        collageOfMyself.safeTransferFrom(address(this), to, 1);
        assertEq(collageOfMyself.balanceOf(to), 1);
    }

    function test_CollageOfMyself_safeTransferFrom_fuzz(address from, address to) public {
        vm.assume(from != address(0) && to != address(0));
        assertEq(collageOfMyself.balanceOf(from), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        uint256 cost = collageOfMyself.mintCost();

        (bool success, ) = payable(from).call{value: cost}("");
        assertTrue(success);

        vm.prank(from);
        collageOfMyself.mint{value: cost}(1);

        assertEq(collageOfMyself.balanceOf(from), 1);
        assertEq(collageOfMyself.totalSupply(), 1);

        collageOfMyself.safeTransferFrom(from, to, 1);
        assertEq(collageOfMyself.balanceOf(to), 1);
    }

    function test_CollageOfMyself_safeTransferFrom2(address to) public {
        vm.assume(to != address(0));
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        uint256 cost = collageOfMyself.mintCost();

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);

        collageOfMyself.safeTransferFrom(address(this), to, 1, "");
        assertEq(collageOfMyself.balanceOf(to), 1);
    }

    function test_CollageOfMyself_safeTransferFrom2_fuzz(address from, address to) public {
        vm.assume(from != address(0) && to != address(0));
        assertEq(collageOfMyself.balanceOf(from), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        uint256 cost = collageOfMyself.mintCost();

        (bool success, ) = payable(from).call{value: cost}("");
        assertTrue(success);

        vm.prank(from);
        collageOfMyself.mint{value: cost}(1);

        assertEq(collageOfMyself.balanceOf(from), 1);
        assertEq(collageOfMyself.totalSupply(), 1);

        collageOfMyself.safeTransferFrom(from, to, 1, "");
        assertEq(collageOfMyself.balanceOf(to), 1);
    }

    function test_CollageOfMyself_setApprovalForAll() public {
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);

        collageOfMyself.setApprovalForAll(address(1), true);

        assertTrue(collageOfMyself.isApprovedForAll(address(this), address(1)));
    }

    function test_CollageOfMyself_mint3_and_walletOfOwner() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(3);

        assertEq(collageOfMyself.walletOfOwner(address(this)).length, 3);

        assertEq(collageOfMyself.balanceOf(address(this)), 3);
        assertEq(collageOfMyself.totalSupply(), 3);
    }

    function test_CollageOfMyself_tokenURI() public {
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.tokenURI(1), SetInitBaseURI);
    }

    function test_CollageOfMyself_setmaxMintAmount() public {
        assertEq(collageOfMyself.maxMintAmount(), 20);
        
        uint256 newmaxMintAmount = 40;

        collageOfMyself.setmaxMintAmount(newmaxMintAmount);
        assertEq(collageOfMyself.maxMintAmount(), newmaxMintAmount);
    }

    function test_CollageOfMyself_setCost() public {
        assertEq(collageOfMyself.mintCost(), TEST_mintCost);
        
        uint256 newCost = TEST_mintCost * 2;

        collageOfMyself.setCost(newCost, newCost);
        assertEq(collageOfMyself.mintCost(), newCost);
    }
}