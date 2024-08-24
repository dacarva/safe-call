//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Feedback {
    ISemaphore public semaphore;

    uint256 public groupId;
    mapping (uint256 => uint256) public messageStore;
    uint256 public messageCounter;

    constructor(address semaphoreAddress) {
        semaphore = ISemaphore(semaphoreAddress);
        messageCounter = 0;
        groupId = semaphore.createGroup();
    }

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    function sendFeedback(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 feedback,
        uint256[8] calldata points
    ) external {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            feedback,
            groupId,
            points
        );

        semaphore.validateProof(groupId, proof);
    }

    function storeMessage (ISemaphore.SemaphoreProof memory proof) public returns (uint256 messsage) {
        require(semaphore.verifyProof(groupId, proof), "Invalid proof");
        messageCounter++;
        messageStore[messageCounter] = proof.message;
        return proof.message;
    }
}
