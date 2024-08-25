import { ethers } from "hardhat"
import { Feedback } from "contracts/typechain-types"
import { decodeBytes32String  } from "ethers"

import { FEEDBACK_ADDRESS } from "../constants"

console.log("🚀 ~ FEEDBACK_ADDRESS:", FEEDBACK_ADDRESS)

async function main() {
    const feedback = (await ethers.getContractAt("Feedback", FEEDBACK_ADDRESS)) as Feedback

    const newMessageIndex = await feedback.messageCounter()
    
    const msg = await feedback.messageStore(newMessageIndex)
    const hexString = BigInt(msg).toString(16).padStart(64, '0');
    const encodedMessage = `0x${hexString}`;
    const res = decodeBytes32String(encodedMessage)
    console.log("🚀 ~ main ~ res:", res)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

