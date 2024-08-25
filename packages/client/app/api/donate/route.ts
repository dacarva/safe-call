import { NextRequest, NextResponse } from 'next/server'
import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets'
import { ethers } from 'ethers'
import { USDC_ADDRESS } from '../../../../contracts/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      receiver,
      userId,
      walletId
    } = body
    console.log('body s is: ', body);
    
    const ABI_ERC20 = ['function transfer(address to, uint256 value)']
    console.log('1');
    
    const iface = new ethers.Interface(ABI_ERC20)
    console.log('2');
    if (!process.env.CIRCLE_API_KEY) {
      console.log('no circle api key')
      return NextResponse.error()
    }
    console.log('3');
    const amountParsed = ethers.parseUnits(amount, 6);
    const circleUserSdk = initiateUserControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY,
    })
    console.log('4');
    
    const transferCalldata = iface.encodeFunctionData('transfer', [
      receiver,
      amountParsed
    ]);
    console.log('5');
    const response = await circleUserSdk.createUserToken({
      userId: userId,
    })
    console.log('6');
    const callData = transferCalldata
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
            contractAddress: USDC_ADDRESS,
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
    else {
      return NextResponse.error()
    }
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
