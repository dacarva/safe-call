//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Feedback {
    ISemaphore public semaphore;

    event MessageStored(uint256 indexed messageId, uint256 indexed message);
    event CoordinatesStored(uint256 indexed messageId);

    struct Coordinates {
        int256 TLX;
        int256 TLY;
        int256 TRX;
        int256 TRY;
        int256 BLX;
        int256 BLY;
        int256 BRX;
        int256 BRY;
    }

    uint256 public groupId;
    uint8 public constant ROUND_FACTOR = 6;
    mapping (uint256 => uint256) public messageStore;
    mapping (uint256 => Coordinates) public coordinatesStore;
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

    function storeMessage (ISemaphore.SemaphoreProof memory proof, Coordinates memory coordinates) public {
        require(semaphore.verifyProof(groupId, proof), "Invalid proof");
        messageCounter++;
        messageStore[messageCounter] = proof.message;
        coordinatesStore[messageCounter] = coordinates;
        emit MessageStored(messageCounter, proof.message);
        emit CoordinatesStored(messageCounter);
    }
}
