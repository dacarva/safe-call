"use client";

import { Box, Button, Center, Flex, Icon, List, ListIcon, ListItem, Text, VStack } from "@chakra-ui/react";
import { FaArrowLeft, FaMapPin, FaPencilAlt, FaLifeRing } from "react-icons/fa";

const ReportInstructions = () => {
  return (
    <Center height="100vh" bg="gray.50">
      <VStack spacing={6} width="90%">
        {/* Header with back arrow and page indicator */}
        <Flex width="100%" justify="space-between" align="center">
          <Icon as={FaArrowLeft} boxSize={6} />
          <Flex align="center" gap={2}>
            <Box w="2" h="2" bg="gray.300" borderRadius="full" />
            <Box w="2" h="2" bg="gray.300" borderRadius="full" />
            <Box w="2" h="2" bg="blackAlpha.800" borderRadius="full" />
          </Flex>
        </Flex>

        {/* Main content */}
        <Box width="100%" color={'black'}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Learn how to report an accident
          </Text>
          <List spacing={4}>
            <ListItem>
              <ListIcon as={FaPencilAlt} color="yellow.400" />
              <Text as="span" fontWeight="bold">Describe</Text> - Type or record to describe the accident
            </ListItem>
            <ListItem>
              <ListIcon as={FaMapPin} color="red.400" />
              <Text as="span" fontWeight="bold">Pin-point</Text> - State when and where the accident happened
            </ListItem>
            <ListItem>
              <ListIcon as={FaLifeRing} color="orange.400" />
              <Text as="span" fontWeight="bold">Get help</Text> - An expert will get your message and be with you shortly
            </ListItem>
          </List>
        </Box>

        {/* Button */}
        <Button colorScheme="blackAlpha" size="lg" rounded="full" width="100%">
          Got it
        </Button>
      </VStack>
    </Center>
  );
};

export default ReportInstructions;
