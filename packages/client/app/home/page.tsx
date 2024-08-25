"use client";

import React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCheckCircle, FaArrowRight, FaRegHandPointer } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/BottomNavbar";

const Home = () => {
  const router = useRouter();

  return (
    <>
      <Center height="100vh" bg="white" color={"black"}>
        <VStack spacing={8} width="90%">
          <Flex direction="column" align="center" mt={8}>
            <Image
              src="/appIcon.png"
              alt="VoxGuard Logo"
              boxSize={{ base: "90px", md: "100px" }}
            />
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              mt={4}
            >
              <Text as="span" color="yellow.400">
                Vox
              </Text>
              <Text as="span" color="black">
                Guard
              </Text>
            </Text>
          </Flex>

          <VStack spacing={4} align="start" textAlign={"center"}>
            <Flex align="center">
              <Icon
                as={FaCheckCircle}
                color="green.400"
                boxSize={{ base: 4, md: 5 }}
              />
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="medium"
                ml={2}
              >
                Protecting your privacy
              </Text>
            </Flex>
            <Flex align="center">
              <Icon
                as={FaCheckCircle}
                color="green.400"
                boxSize={{ base: 4, md: 5 }}
              />
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="medium"
                ml={2}
              >
                Report totally anonymously
              </Text>
            </Flex>
          </VStack>

          <Box
            width={{ base: "80%", md: "40%" }}
            mt={8}
            paddingLeft={15}
            paddingRight={15}
          >
            <Button
              bg="yellow.400"
              color="white"
              size="lg"
              height={{ base: "60px", md: "80px" }}
              width="100%"
              rounded="lg"
              _hover={{ bg: "yellow.500" }}
              leftIcon={
                <Icon
                  as={FaRegHandPointer}
                  boxSize={{ base: 5, md: 6 }}
                  ml={-1}
                />
              }
              rightIcon={
                <Icon as={FaArrowRight} boxSize={{ base: 5, md: 6 }} ml={2} />
              }
              fontSize={{ base: "lg", md: "2xl" }}
              onClick={() => router.push("/report")}
            >
              Create Report
            </Button>
          </Box>
        </VStack>
      </Center>
      <BottomNavbar />
    </>
  );
};

export default Home;
