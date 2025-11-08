// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardsManager is Ownable {
    mapping(address => uint256) public rewards;
    event RewardGranted(address indexed user, uint256 amount, uint256 timestamp);

    function grantReward(address _user, uint256 _amount) external onlyOwner {
        rewards[_user] += _amount;
        emit RewardGranted(_user, _amount, block.timestamp);
    }

    function withdrawRewards() external {
        uint256 amt = rewards[msg.sender];
        require(amt > 0, "No rewards");
        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(amt);
    }

    receive() external payable {}
}