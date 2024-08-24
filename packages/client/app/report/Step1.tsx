"use client";
import React from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';

interface Step1Props {
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  return (
    <VStack spacing={4} color={"black"}>
      <Text fontSize="2xl" fontWeight="bold">
        What happened?
      </Text>
      <Input placeholder="Describe the incident..." size="lg" />
      <Button colorScheme="blackAlpha" onClick={onNext} size="lg" mt={4}>
        Next
      </Button>
    </VStack>
  );
};

export default Step1;
