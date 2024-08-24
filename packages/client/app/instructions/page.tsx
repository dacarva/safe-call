"use client";

import { Box, Button, Center, Flex, Icon, List, ListIcon, ListItem, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaMapPin, FaPencilAlt, FaLifeRing } from "react-icons/fa";

const ReportInstructions = () => {
  const router = useRouter()

  return (
    <Center height="100vh" bg="gray.50">
      <VStack spacing={6} width="90%">
        {/* Header with back arrow and page indicator */}
        

        {/* Main content */}
        <Box width="100%" color={'black'}>
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign={'center'}>
            Learn how to report an accident
          </Text>
          <List spacing={4} alignContent={'center'} textAlign={'center'}>
            <ListItem>
              <ListIcon as={FaPencilAlt} color="yellow.400" />
              <Text as="span" fontWeight="bold" textAlign={'center'} >Describe</Text> - Type or record to describe the accident/situation
            </ListItem>
            <ListItem>
              <ListIcon as={FaMapPin} color="red.400" />
              <Text as="span" fontWeight="bold" textAlign={'center'}>Pin-point</Text> - State when and where the accident/situation happened
            </ListItem>
            <ListItem>
              <ListIcon as={FaLifeRing} color="orange.400" />
              <Text as="span" fontWeight="bold" textAlign={'center'}>Get help</Text> - Obtain an emergency grant for your accident/situation
            </ListItem>
          </List>
        </Box>

        {/* Button */}
        <Button colorScheme="blackAlpha" size="md" rounded="full" width="20%" onClick={() => router.push('/home')}>
          Got it
        </Button>
      </VStack>
    </Center>
  );
};

export default ReportInstructions;
