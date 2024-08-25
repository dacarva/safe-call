"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Toast,
  VStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FOUNDATION_ADDRESS } from "../../../contracts/constants";
import { useUser } from "../Context/UserContext";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { CheckCircleIcon } from "@chakra-ui/icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const DonationModal = ({ isOpen, onClose }: Props) => {
  const { user } = useUser();
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [donated, setDonated] = useState(false);
  const handleSelectAmount = (amount: string) => {
    console.log("Selected amount: ", amount);
    setSelectedAmount(amount);
  };
  const handleDonate = async () => {
    try {
      const sdk = new W3SSdk();
      const executeMethod = (challengeId: any) => {
        return new Promise((resolve, reject) => {
          sdk.execute(challengeId!, (error: any, result: any) => {
            if (error) {
              console.log("error on execute method is: ", error);
              reject(error);
            } else if (result) {
              resolve(result);
              console.log("result is: ", result);
            }
          });
        });
      };
      console.log("Donating amount: ", selectedAmount);
      if (selectedAmount !== null) {
        const data = {
          amount: selectedAmount,
          receiver: FOUNDATION_ADDRESS,
          userId: user?.userId ?? "",
          walletId: user?.walletId ?? "",
        };
        console.log(JSON.stringify(data));

        const response = await fetch("/api/donate/", {
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
        const execution = await executeMethod(challengeId!);
        console.log("transaction sent");
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
        console.log("Donation successful");

        setDonated(true);
      } else {
        Toast({
          title: "Please select an amount to donate",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Error donating: ", error);
    }
  };
  return (
    <>
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent borderTopRadius={30} bg={"white"}>
          <DrawerCloseButton />
          {donated ? (
            <VStack spacing={8} justifyContent="center" mt={8} mb={8}>
              <Icon as={CheckCircleIcon} boxSize={16} color="green.400" />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                color={"black"}
              >
                Your report was sent successfully
              </Text>
              <Button
                colorScheme="blackAlpha"
                width="50%"
                size="lg"
                onClick={onClose}
              >
                Thank you
              </Button>
            </VStack>
          ) : (
            <>
              <DrawerHeader
                borderBottomWidth="1px"
                color={"black"}
                fontSize={25}
              >
                How much to donate?
              </DrawerHeader>

              <DrawerBody>
                <Stack direction="row" spacing={4} wrap="wrap" justify="center">
                  {["1", "5", "10", "20", "50", "Customize"].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => handleSelectAmount(amount)}
                      bg={
                        selectedAmount === amount
                          ? "blackAlpha.800"
                          : "gray.200"
                      }
                      color={selectedAmount === amount ? "white" : "black"}
                      size="lg"
                      width="40%"
                      m={2}
                      _hover={{ bg: "blackAlpha.600" }}
                    >
                      {`${amount} USDC`}
                    </Button>
                  ))}
                </Stack>
              </DrawerBody>

              <DrawerFooter justifyContent={"center"}>
                <Button
                  colorScheme="blackAlpha"
                  width="50%"
                  size="lg"
                  onClick={handleDonate}
                >
                  Donate
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DonationModal;
