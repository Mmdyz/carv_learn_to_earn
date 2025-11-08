// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract QuestLog {
    struct Quest { address user; string questId; uint256 timestamp; }
    Quest[] public logs;
    event QuestCompleted(address indexed user, string questId, uint256 timestamp);

    function completeQuest(string calldata _questId) external {
        logs.push(Quest(msg.sender, _questId, block.timestamp));
        emit QuestCompleted(msg.sender, _questId, block.timestamp);
    }

    function getAll() public view returns (Quest[] memory) { return logs; }
}