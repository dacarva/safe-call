import { NextRequest, NextResponse } from "next/server";
import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";
import { FEEDBACK_ADDRESS } from "../../../../contracts/constants";
import { Feedback__factory } from "../../../../contracts/typechain-types";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
	process.env.NEXT_PUBLIC_RPC_API_KEY
);

const feedback = Feedback__factory.connect(FEEDBACK_ADDRESS, provider);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			functionName,
			identityCommitment,
			proof,
      coordinates,
			groupId,
			userId,
			walletId,
			contractAddress,
		} = body;

		if (!process.env.CIRCLE_API_KEY) {
			console.log("no circle api key");
			return NextResponse.error();
		}
		const circleUserSdk = initiateUserControlledWalletsClient({
			apiKey: process.env.CIRCLE_API_KEY,
		});

		switch (functionName) {
			case "joinGroup":
				const joinGroupCalldata = feedback.interface.encodeFunctionData(
					"joinGroup",
					[identityCommitment]
				);
				const response = await circleUserSdk.createUserToken({
					userId: userId,
				});
				let callData = joinGroupCalldata;
				if (
					response &&
					response.data &&
					response.data.userToken &&
					response.data.encryptionKey
				) {
					const userToken = response.data.userToken;
					const encryptionKey = response.data.encryptionKey;
					const response1 =
						await circleUserSdk.createUserTransactionContractExecutionChallenge(
							{
								userToken: userToken,
								callData: callData,
								contractAddress: contractAddress,
								walletId: walletId,
								fee: {
									type: "level",
									config: {
										feeLevel: "HIGH",
									},
								},
							}
						);

					let challengeId;
					if (response1.data && response1.data.challengeId) {
						challengeId = response1.data.challengeId;
					}
					const data = {
						userToken: userToken,
						encryptionKey: encryptionKey,
						challengeId: challengeId,
						responseData: response1.data,
					};
					return NextResponse.json(data);
				}
				break;

			case "storeMessage":
				const storeMessageCalldata = feedback.interface.encodeFunctionData(
					"storeMessage",
					[proof, coordinates]
				);
				console.log("🚀 ~ POST ~ storeMessageCalldata:", storeMessageCalldata)
				const responseToken = await circleUserSdk.createUserToken({
					userId: userId,
				});
				const callDataStoreMessage = storeMessageCalldata;
				if (
					responseToken &&
					responseToken.data &&
					responseToken.data.userToken &&
					responseToken.data.encryptionKey
				) {
					const userToken = responseToken.data.userToken;
					const encryptionKey = responseToken.data.encryptionKey;
					const response1 =
						await circleUserSdk.createUserTransactionContractExecutionChallenge(
							{
								userToken: userToken,
								callData: callDataStoreMessage,
								contractAddress: contractAddress,
								walletId: walletId,
								fee: {
									type: "level",
									config: {
										feeLevel: "HIGH",
									},
								},
							}
						);

					let challengeId;
					if (response1.data && response1.data.challengeId) {
						challengeId = response1.data.challengeId;
					}
					const data = {
						userToken: userToken,
						encryptionKey: encryptionKey,
						challengeId: challengeId,
						responseData: response1.data,
					};
					return NextResponse.json(data);
				}
				break;

			default:
				console.log("default case");
				return NextResponse.error();
				break;
		}
	} catch (error) {
		console.error(error);
		return NextResponse.error();
	}
}
