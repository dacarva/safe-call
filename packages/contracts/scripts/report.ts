import { ethers } from "hardhat"
import { ISemaphoreGroups, Feedback, ISemaphore } from "contracts/typechain-types"
import { Identity } from "@semaphore-protocol/core"
import { Group } from "@semaphore-protocol/group"
import { SemaphoreSubgraph } from "@semaphore-protocol/data"
import { decodeBytes32String, encodeBytes32String,  } from "ethers"
import { generateProof, verifyProof } from "@semaphore-protocol/proof"

import { FEEDBACK_ADDRESS, SEMAPHORE_ADDRESS } from "../constants"

console.log("🚀 ~ SEMAPHORE_ADDRESS:", SEMAPHORE_ADDRESS)
console.log("🚀 ~ FEEDBACK_ADDRESS:", FEEDBACK_ADDRESS)

async function main() {
    const feedback = (await ethers.getContractAt("Feedback", FEEDBACK_ADDRESS)) as Feedback

    const userIdentity = new Identity(process.env.ETHEREUM_PRIVATE_KEY)
    // const userIdentity = new Identity("Nicolas 00")

    const groupId = await feedback.groupId()

    const semaphoreGroups = (await ethers.getContractAt("ISemaphoreGroups", SEMAPHORE_ADDRESS)) as ISemaphoreGroups
    const semaphoreProof = (await ethers.getContractAt("ISemaphore", SEMAPHORE_ADDRESS)) as ISemaphore

    if (!(await semaphoreGroups.hasMember(groupId, userIdentity.commitment))) {
        console.log('Creating member')
        const transaction = await feedback.joinGroup(userIdentity.commitment)
        const r = await transaction.wait()
        await new Promise((resolve) => {setTimeout(resolve, 5000)});
        console.log("🚀 ~ main ~ r:", r)
        console.log('Member created')
    } else console.log('Member 1 already exists')

    const semaphoreSubgraph = new SemaphoreSubgraph("matic-amoy")
    const { members } = await semaphoreSubgraph.getGroup(groupId.toString(), { members: true })
    const group = new Group(members)

    const scope = group.root

    const message = encodeBytes32String(`Hacking at Aleph ${Date.now()}`)
    const proof = await generateProof(userIdentity, group, message, scope)

    const offChainverification = await verifyProof(proof)

    const onchainVerification = await semaphoreProof.verifyProof(groupId, proof)

    if(offChainverification && onchainVerification) {
        const storeMessage = await feedback.storeMessage(proof)
        const response = await storeMessage.wait()
        console.log("🚀 ~ main ~ response:", response)
    
        const newMessageIndex = await feedback.messageCounter()
    
        const msg = await feedback.messageStore(newMessageIndex)
        const hexString = BigInt(msg).toString(16).padStart(64, '0');
        const encodedMessage = `0x${hexString}`;
        const res = decodeBytes32String(encodedMessage)
        console.log("🚀 ~ main ~ res:", res)
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

