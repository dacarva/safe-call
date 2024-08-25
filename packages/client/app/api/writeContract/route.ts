import { NextRequest, NextResponse } from 'next/server'
import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets'
import { ethers } from 'ethers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      functionName,
      identityCommitment,
      proof,
      groupId,
      userId,
      walletId,
      contractAddress,
    } = body

    const ABI_JOIN_GROUP = ['function joinGroup(uint256 identityCommitment)']
    const ABI_STORE_MESSAGE = [
      'function storeMessage (ISemaphore.SemaphoreProof memory proof)',
    ]
    const ABI_GROUP__ID = ['function groupId()']
    const ABI_GROUP_HAS_MEMBER = [
      'function hasMember(uint256 groupId, uint256 identityCommitment)',
    ]
    const ABI_VERIFY_PROOF = [
      'function verifyProof(uint256 groupId, ISemaphore.SemaphoreProof calldata proof)',
    ]
    const iface1 = new ethers.Interface(ABI_JOIN_GROUP) //feedback
    const iface2 = new ethers.Interface(ABI_STORE_MESSAGE) //feedback
    const iface3 = new ethers.Interface(ABI_GROUP__ID) //feedback
    const iface4 = new ethers.Interface(ABI_GROUP_HAS_MEMBER) //semaphore
    const iface5 = new ethers.Interface(ABI_VERIFY_PROOF) //semaphore

    if (!process.env.CIRCLE_API_KEY) {
      console.log('no circle api key')
      return NextResponse.error()
    }
    const circleUserSdk = initiateUserControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY,
    })

    switch (functionName) {
      case 'joinGroup':
        const joinGroupCalldata = iface1.encodeFunctionData('joinGroup', [
          identityCommitment,
        ])
        const response = await circleUserSdk.createUserToken({
          userId: userId,
        })
        const callData = joinGroupCalldata
        if (
          response &&
          response.data &&
          response.data.userToken &&
          response.data.encryptionKey
        ) {
          const userToken = response.data.userToken
          const encryptionKey = response.data.encryptionKey
          const response1 =
            await circleUserSdk.createUserTransactionContractExecutionChallenge(
              {
                userToken: userToken,
                callData: callData,
                contractAddress: contractAddress,
                walletId: walletId,
                fee: {
                  type: 'level',
                  config: {
                    feeLevel: 'HIGH',
                  },
                },
              }
            )
          
          let challengeId
          if (response1.data && response1.data.challengeId) {
            challengeId = response1.data.challengeId
          }
          const data = {
            userToken: userToken,
            encryptionKey: encryptionKey,
            challengeId: challengeId,
            responseData: response1.data,
          }
          return NextResponse.json(data)
        }
        break

      default:
        console.log('default case')
        return NextResponse.error()
        break
    }
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
