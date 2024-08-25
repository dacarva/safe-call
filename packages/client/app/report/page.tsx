"use client";
import React, { useState, useEffect } from "react";
import { Box, Center, Toast, VStack } from "@chakra-ui/react";
import Step1 from "./Step1";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { Identity } from "@semaphore-protocol/core";
import { Group } from "@semaphore-protocol/group";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { generateProof, verifyProof } from "@semaphore-protocol/proof";

import { useUser } from "@/components/Context/UserContext";
import { ethers, encodeBytes32String } from "ethers";
import {
  FEEDBACK_ADDRESS,
  SEMAPHORE_ADDRESS,
} from "../../../contracts/constants";
import {
  Feedback,
  Feedback__factory,
  SemaphoreGroups__factory,
  Semaphore__factory,
} from "../../../contracts/typechain-types";
import { useRouter } from "next/navigation";
import Step2 from "./Step2";
import { getCoordinates } from "../utils/coordinates";
import BottomNavbar from "@/components/BottomNavbar";

const factor = 10 ** 6;

const BsAs = {
  TLX: Math.round(-34.55630262174668 * factor),
  TLY: Math.round(-58.47039246947173 * factor),
  TRX: Math.round(-34.55630262174668 * factor),
  TRY: Math.round(58.4158400523308 * factor),
  BLX: Math.round(-34.60121818049623 * factor),
  BLY: Math.round(-58.47039246947173 * factor),
  BRX: Math.round(-34.60121818049623 * factor),
  BRY: Math.round(-58.41584005233085 * factor),
};

const ReportPage = () => {
  const [step, setStep] = useState(1);
  const [textReport, setTextReport] = useState("");
  const [reportCoordinates, setReportCoordinates] = useState(BsAs);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportCoordinates(
            getCoordinates(position.coords.latitude, position.coords.longitude)
          );
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handleBackStep = () => {
    setStep(step - 1);
  };
  const backHome = () => {
    router.push("/home");
  };

  const executeMethod = (challengeId: any) => {
    const sdk = new W3SSdk();

    return new Promise((resolve, reject) => {
      sdk.execute(challengeId!, (error: any, result: any) => {
        if (error) {
          console.log("error on execute method is: ", error);
          reject(error);
        } else if (result) {
          resolve(result);
        }
      });
    });
  };

  const obtainGroupId = async () => {
    try {
      const sdk = new W3SSdk();
      const userIdentity = new Identity("WorldCoinUser1"); //TODO: replace with Worldcoin id
      const publicKey = user?.address;
      if (!publicKey) {
        throw new Error("No public key found");
      }
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_API_KEY
      );
      const feedback: Feedback = Feedback__factory.connect(
        FEEDBACK_ADDRESS,
        provider
      );
      const groupID = await feedback.groupId();
      const semaphoreGroups = SemaphoreGroups__factory.connect(
        SEMAPHORE_ADDRESS,
        provider
      );
      const hasMember = await semaphoreGroups.hasMember(
        groupID,
        userIdentity.commitment
      );

      if (!hasMember) {
        const data = {
          functionName: "joinGroup",
          identityCommitment: userIdentity.commitment.toString(),
          proof: null,
          groupId: null,
          coordinates: {},
          userId: user?.userId,
          walletId: user?.walletId,
          contractAddress: FEEDBACK_ADDRESS,
        };
        const response = await fetch("/api/writeContract/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log("response is: ", response);
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
        console.log("transaction sent");
        await new Promise((resolve) => {
          setTimeout(resolve, 10000);
        });
        await sendReport();
      } else {
        console.log("Member 1 already exists");
        await sendReport();
      }
    } catch (error) {
      console.error("eror on obtaingroup id is: ", error);
    }
  };
  const sendReport = async () => {
    try {
      console.log("reportCoordinates", reportCoordinates);
      const sdk = new W3SSdk();

      const userIdentity = new Identity("WorldCoinUser1"); //TODO: replace with Worldcoin id
      const semaphoreSubgraph = new SemaphoreSubgraph("matic-amoy");
      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_API_KEY
      );
      const feedback: Feedback = Feedback__factory.connect(
        FEEDBACK_ADDRESS,
        provider
      );
      const semaphoreProof = Semaphore__factory.connect(
        SEMAPHORE_ADDRESS,
        provider
      );
      const groupID = await feedback.groupId();
      const { members } = await semaphoreSubgraph.getGroup(groupID.toString(), {
        members: true,
      });
      const group = new Group(members);
      const scope = group.root;
      const message = encodeBytes32String(textReport); //TODO: Update the message
      const proof = await generateProof(userIdentity, group, message, scope);
      const offChainverification = await verifyProof(proof);
      const onchainVerification = await semaphoreProof.verifyProof(
        groupID,
        proof
      );

      if (offChainverification && onchainVerification) {
        const data = {
          functionName: "storeMessage",
          identityCommitment: userIdentity.commitment.toString(),
          proof,
          groupId: null,
          coordinates: reportCoordinates,
          userId: user?.userId,
          walletId: user?.walletId,
          contractAddress: FEEDBACK_ADDRESS,
        };
        const response = await fetch("/api/writeContract/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
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
      }
    } catch (error) {
      console.error("error on send report is: ", error);
    }
  };
  return (
    <>
      <Center height="100vh" bg="gray.50">
        <Box width="90%" maxW="lg" bg="white" p={8} rounded="lg" boxShadow="lg">
          <VStack spacing={8}>
            {step === 1 && (
              <Step1
                onNext={handleNextStep}
                setTextReport={setTextReport}
                textReport={textReport}
                onBack={backHome}
              />
            )}
            {step === 2 && (
              <Step2 onNext={obtainGroupId} onBack={handleBackStep} />
            )}
          </VStack>
        </Box>
      </Center>
      <BottomNavbar />
    </>
  );
};

export default ReportPage;
