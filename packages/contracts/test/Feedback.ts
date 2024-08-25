import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"
import { expect } from "chai"
import { encodeBytes32String } from "ethers"
import { run } from "hardhat"
// @ts-ignore: typechain folder will be generated after contracts compilation
// eslint-disable-next-line
import { Feedback, ISemaphore } from "../typechain-types"

describe("Feedback", () => {
    async function deployFeedbackFixture() {
        const { semaphore } = await run("deploy:semaphore", {
            logs: false
        })

        const semaphoreContract: ISemaphore = semaphore

        const feedbackContract: Feedback = await run("deploy", {
            logs: false,
            semaphore: await semaphoreContract.getAddress()
        })

        const groupId = await feedbackContract.groupId()

        return { semaphoreContract, feedbackContract, groupId }
    }

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            const { semaphoreContract, feedbackContract, groupId } = await loadFixture(deployFeedbackFixture)

            const users = [new Identity(), new Identity()]

            const group = new Group()

            for (const [i, user] of users.entries()) {
                const transaction = await feedbackContract.joinGroup(user.commitment)
                group.addMember(user.commitment)

                await expect(transaction)
                    .to.emit(semaphoreContract, "MemberAdded")
                    .withArgs(groupId, i, user.commitment, group.root)
            }
        })
    })

    describe("# sendFeedback", () => {
        it("Should allow users to send feedback anonymously", async () => {
            const { feedbackContract, groupId } = await loadFixture(deployFeedbackFixture)

            const users = [new Identity(), new Identity()]
            const group = new Group()

            for (const user of users) {
                await feedbackContract.joinGroup(user.commitment)
                group.addMember(user.commitment)
            }

            const feedback = encodeBytes32String("Hello World")

            const proof = await generateProof(users[1], group, feedback, groupId)

            const  factor = 10** Number(await feedbackContract.ROUND_FACTOR());

            const coordinates = {
                TLX: Math.round(-34.55630262174668 * factor),
                TLY: Math.round(-58.47039246947173 * factor),
                TRX: Math.round(-34.55630262174668 * factor),
                TRY: Math.round(58.4158400523308 * factor),
                BLX: Math.round(-34.60121818049623 * factor),
                BLY: Math.round(-58.47039246947173 * factor),
                BRX: Math.round(-34.60121818049623 * factor),
                BRY: Math.round(-58.41584005233085 * factor),
            }
            const tx = await feedbackContract.storeMessage(proof, coordinates)
            const newMessageIndex = await feedbackContract.messageCounter()
            const message = await feedbackContract.messageStore(newMessageIndex)
            await expect(message).to.equal(BigInt(proof.message))

            const readCoordinates = await feedbackContract.coordinatesStore(newMessageIndex)
            console.log("🚀 ~ it ~ readCoordinates:", readCoordinates)
            expect(tx).to.emit(feedbackContract, "MessageStored").withArgs(newMessageIndex, coordinates)
        })
    })
})
