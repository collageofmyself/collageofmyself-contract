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

    function test_CollageOfMyself_mintOne() public {
        assertEq(collageOfMyself.balanceOf(address(this)), 0);
        assertEq(collageOfMyself.totalSupply(), 0);
        
        collageOfMyself.pause(false);

        collageOfMyself.mint(1);

        assertEq(collageOfMyself.balanceOf(address(this)), 1);
        assertEq(collageOfMyself.totalSupply(), 1);
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
        // _TEST_TOTALSUPPLY += qty;

        assertEq(collageOfMyself.balanceOf(to), qty);
        assertEq(collageOfMyself.totalSupply(), qty);
    }
}