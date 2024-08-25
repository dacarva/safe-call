'use client'
import React, { useState } from 'react'
import { Box, Center, Toast, VStack } from '@chakra-ui/react'
import Step1 from './Step1'
import Step2 from './Step2'
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { Identity } from "@semaphore-protocol/core"
import { useUser } from '@/components/Context/UserContext'
import { ethers } from 'ethers'
import { FEEDBACK_ADDRESS, SEMAPHORE_ADDRESS } from "../../../contracts/constants"
import { Feedback} from "../../../contracts/typechain-types"
import {Feedback__factory, SemaphoreGroups__factory} from "../../../contracts/typechain-types"
import { useRouter } from 'next/navigation'
const ReportPage = () => {
  const [step, setStep] = useState(1)
  const [textReport, setTextReport] = useState('')
  const {user} = useUser()
  const router = useRouter()

  const handleNextStep = () => {
    setStep(step + 1)
  }
  const handleBackStep = () => {
    setStep(step - 1)
  }
  const backHome = () => {
    router.push('/home')
  }
  const obtainGroupId = async () => {
    try {
      const sdk = new W3SSdk();
      const executeMethod = (challengeId: any) => {
        return new Promise((resolve, reject) => {
          sdk.execute(challengeId!, (error: any, result: any) => {
            if (error) {
              console.log('error on execute method is: ',error);
              reject(error);
            } else if (result) {
              resolve(result);
            }
          });
        });
      };
      const userIdentity = new Identity('WorldCoinUser1');//TODO replace with Worldcoin id
      const publicKey = user?.address;
      if (!publicKey) {
        throw new Error('No public key found')
      }
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_API_KEY);
      const myContract: Feedback = Feedback__factory.connect(FEEDBACK_ADDRESS, provider);
      const groupID = await myContract.groupId();
      const semaphoreGroups = SemaphoreGroups__factory.connect(SEMAPHORE_ADDRESS, provider);
      const hasMember = await semaphoreGroups.hasMember(groupID, userIdentity.commitment);
      
      if (!hasMember) {
        const data = {
          functionName: "joinGroup",
          identityCommitment: userIdentity.commitment.toString(),
          proof: null,
          groupId : null,
          userId: user?.userId,
          walletId: user?.walletId,
          contractAddress: FEEDBACK_ADDRESS
        };
        const response = await fetch("/api/writeContract/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log('response is: ',response);
        const dataWrite = await response.json();
        const userToken = dataWrite.userToken;
        const encryptionKey = dataWrite.encryptionKey;
        const challengeId = dataWrite.challengeId;
        sdk.setAppSettings({ appId: process.env.NEXT_PUBLIC_APP_ID! });
        sdk.setAuthentication({
          userToken: userToken,
          encryptionKey: encryptionKey,
        });
        await executeMethod(challengeId!);
        console.log('transaction sent');
        await new Promise((resolve) => {
          setTimeout(resolve, 5000)
        })        
      } else {
        console.log('Member 1 already exists')
      }
    } catch (error) {
      console.log('eror on obtaingroup id is: ',error);
    }
  }
  return (
    <Center height="100vh" bg="gray.50">
      <Box width="90%" maxW="lg" bg="white" p={8} rounded="lg" boxShadow="lg">
        <VStack spacing={8}>
          {step === 1 && 
            <Step1 
            onNext={handleNextStep} 
            setTextReport={setTextReport}
            textReport={textReport}
            onBack={backHome}
            />}
          {/* {step === 2 && <Step2 onNext={handleNextStep} />} */}
        </VStack>
      </Box>
    </Center>
  )
}

export default ReportPage
