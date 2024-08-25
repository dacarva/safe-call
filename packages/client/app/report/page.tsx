'use client'
import React, { useState } from 'react'
import { Box, Center, VStack } from '@chakra-ui/react'
import Step1 from './Step1'
import Step2 from './Step2'
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { Identity } from "@semaphore-protocol/core"
import { useUser } from '@/components/Context/UserContext'
import { ethers } from 'ethers'
import { ethers as ethersH } from "hardhat"
import { FEEDBACK_ADDRESS, SEMAPHORE_ADDRESS } from "../../../contracts/constants"
import { ISemaphoreGroups, Feedback, ISemaphore } from "../../../contracts/typechain-types"

const ReportPage = () => {
  const [step, setStep] = useState(1)
  const {user} = useUser()
  const handleNextStep = () => {
    setStep(step + 1)
  }
  const createReport = async () => {
    try {
      const sdk = new W3SSdk();
      

    } catch (error) {}
  }
  const obtainGroupId = async () => {
    try {
      console.log('obtaining group id');
      const feedback = (await ethersH.getContractAt("Feedback", FEEDBACK_ADDRESS)) as Feedback
      



      // const sdk = new W3SSdk();
      // const publicKey = user?.address;
      // if (!publicKey) {
      //   throw new Error('No public key found')
      // }
      // const userIdentity = new Identity(publicKey);
      // console.log('user identity is: ',userIdentity);
      
      // const data = {
      //   functionName: "groupId",
      //   identityCommitment: userIdentity.commitment.toString(),
      //   proof: null,
      //   groupId: null,
      //   userId: user?.walletId,
      //   walletId : user?.walletId
      // };
      // console.log('input data fpr groupid is: ',data);
      
      // const response = await fetch("/api/tx/writeContract/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // console.log('response is: ',response);
    } catch (error) {
      console.log('eror on obtaingroup id is: ',error);
    }
  }
  return (
    <Center height="100vh" bg="gray.50">
      <Box width="90%" maxW="lg" bg="white" p={8} rounded="lg" boxShadow="lg">
        <VStack spacing={8}>
          {step === 1 && <Step1 onNext={obtainGroupId} />}
          {/* {step === 2 && <Step2 onNext={handleNextStep} />} */}
        </VStack>
      </Box>
    </Center>
  )
}

export default ReportPage
