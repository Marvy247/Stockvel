// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Stokvel} from "../src/Stokvel.sol";

contract StokvelTest is Test {
    Stokvel stokvel;
    address alice = address(0xA);
    address bob   = address(0xB);

    function setUp() public {
        stokvel = new Stokvel();
        vm.deal(alice, 10 ether);
        vm.deal(bob,   10 ether);
    }

    function test_createGroup() public {
        vm.prank(alice);
        uint256 id = stokvel.createGroup("Test", 0.1 ether, 1 days);
        assertEq(id, 0);
        (string memory name,,,,,,) = stokvel.getGroup(0);
        assertEq(name, "Test");
    }

    function test_joinAndContribute() public {
        vm.prank(alice);
        stokvel.createGroup("Test", 0.1 ether, 1 days);

        vm.prank(bob);
        stokvel.joinGroup(0);

        vm.prank(alice);
        stokvel.contribute{value: 0.1 ether}(0);

        assertTrue(stokvel.hasContributed(0, 0, alice));
    }

    function test_triggerPayout() public {
        vm.prank(alice);
        stokvel.createGroup("Test", 0.1 ether, 1 days);

        vm.prank(alice);
        stokvel.contribute{value: 0.1 ether}(0);

        vm.warp(block.timestamp + 1 days + 1);

        uint256 before = alice.balance;
        vm.prank(alice);
        stokvel.triggerPayout(0);
        assertGt(alice.balance, before);
    }
}
