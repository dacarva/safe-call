"use client";
import React, { useState } from 'react';
import { Box, Center, VStack } from '@chakra-ui/react';
import Step1 from './Step1';
import Step2 from './Step2';

const ReportPage = () => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <Center height="100vh" bg="gray.50">
      <Box width="90%" maxW="lg" bg="white" p={8} rounded="lg" boxShadow="lg">
        <VStack spacing={8}>
          {step === 1 && <Step1 onNext={handleNextStep} />}
          {/* {step === 2 && <Step2 onNext={handleNextStep} />} */}
        </VStack>
      </Box>
    </Center>
  );
};

export default ReportPage;
