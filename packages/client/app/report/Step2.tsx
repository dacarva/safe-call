"use client";
import React, { useState } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('./Map'), { ssr: false });

interface Step2Props {
  onNext: () => void;
}

const Step2: React.FC<Step2Props> = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        When did it happen?
      </Text>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        dateFormat="Pp"
        className="chakra-input"
      />
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Where did it happen?
      </Text>
      <Box height="200px" width="100%">
        <MapWithNoSSR />
      </Box>
      <Button colorScheme="blackAlpha" onClick={onNext} size="lg" mt={4}>
        Next
      </Button>
    </VStack>
  );
};

export default Step2;
