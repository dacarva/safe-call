import { NextRequest, NextResponse } from 'next/server'
import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets'
import { ethers } from 'ethers'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    functionName,
    identityCommitment,
    proof,
    groupId,
    userId,
    walletId
  } = body

  const circleUserSdk = initiateUserControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
  })

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

  const iface1 = new ethers.Interface(ABI_JOIN_GROUP)//feedback
  const iface2 = new ethers.Interface(ABI_STORE_MESSAGE)//feedback
  const iface3 = new ethers.Interface(ABI_GROUP__ID)//feedback
  const iface4 = new ethers.Interface(ABI_GROUP_HAS_MEMBER)//semaphore
  const iface5 = new ethers.Interface(ABI_VERIFY_PROOF)//semaphore

  let joinGroupCalldata,
    storeMessageCalldata,
    groupIdCalldata,
    hasMemberCalldata,
    verifyProofCalldata

  if (functionName == 'joinGroup') {
    joinGroupCalldata = iface1.encodeFunctionData('joinGroup', [
      identityCommitment,
    ])
  } else if (functionName == 'storeMessage') {
    storeMessageCalldata = iface2.encodeFunctionData('storeMessage', [
      proof,
    ])
  } else if (functionName == 'groupId') {
    groupIdCalldata = iface3.encodeFunctionData('groupId', [])
  } else if (functionName == 'hasMember') {
    hasMemberCalldata = iface4.encodeFunctionData('hasMember', [
      groupId,
      identityCommitment,
    ])
  } else {
    verifyProofCalldata = iface5.encodeFunctionData('verifyProof', [
      groupId,
      proof,
    ])
  }

  const response = await circleUserSdk.createUserToken({
    userId: userId,
  })

  let userToken, encryptionKey

  const callData = `${
    functionName === 'joinGroup'
      ? joinGroupCalldata
      : functionName === 'storeMessage'
        ? storeMessageCalldata
        : functionName === 'groupId'
          ? groupIdCalldata
          : functionName === 'hasMember'
            ? hasMemberCalldata
            : verifyProofCalldata
  }`
  console.log('response is :', response);
  console.log('data is :', response?.data);
  console.log('userToken is :', response?.data?.userToken);
  console.log('encryptionKey is :', response?.data?.encryptionKey);  
  
  if (
    response &&
    response.data &&
    response.data.userToken &&
    response.data.encryptionKey
  ) {
    userToken = response.data.userToken
    encryptionKey = response.data.encryptionKey
    const response1 =
      await circleUserSdk.createUserTransactionContractExecutionChallenge({
        userToken: userToken,
        callData: callData,
        contractAddress: `${
          functionName == 'hasMember' || functionName == 'verifyProof'
            ? '0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f'
            : '0xaD70d6F2E00378B13579611a633964b7bE63957B'
        }`,
        walletId: walletId,
        fee: {
          type: 'level', 
          config: {
            feeLevel: 'HIGH',
          },
        },
      })

    let challengeId
    console.log('response1 is :', response1);
    console.log('response1.data is :', response1.data);
      
    if (response1.data && response1.data.challengeId) {
      challengeId = response1.data.challengeId
    }
    console.log('challengeId is :', challengeId);
    
    const data = {
      userToken: userToken,
      encryptionKey: encryptionKey,
      challengeId: challengeId,
      responseData: response1.data,
    }
    console.log('data is :', data);
    
    return NextResponse.json(data)
  }
}
