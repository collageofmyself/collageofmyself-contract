// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "forge-std/console.sol";
import "forge-std/stdlib.sol";
import "./libraries/ds-test/src/test.sol";
import {CheatCodes} from "./utils/cheatcodes.sol";

import { CollageOfMyself } from "../CollageOfMyself.sol";

contract CollageOfMyselfTest is DSTest {
    Vm public constant vm = Vm(HEVM_ADDRESS);
    //CheatCodes cheats = CheatCodes(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    CollageOfMyself private collageOfMyself;

    
    string constant SetInitNotRevealedUri = 'ipfs://';
    string constant SetInitBaseURI = 'ipfs://QmQ38J3nSHcJvnDWd4U7bm7mPir5S5UMjz8iMhYS8297rR/';
    string constant SetInitTokenName = 'Collage of Myself';
    string constant SetInitTokenSymbol = 'MYSELF';

    function setUp() public {
        // Deploy contracts
        collageOfMyself = new CollageOfMyself(SetInitNotRevealedUri, SetInitBaseURI);
    }
    
    function test_CollageOfMyself_name() public {
        assertEq(collageOfMyself.name(), SetInitTokenName);
    }

    function test_CollageOfMyself_symbol() public {
        assertEq(collageOfMyself.symbol(), SetInitTokenSymbol);
    }
}