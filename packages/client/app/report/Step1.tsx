'use client'
import React from 'react'
import { Box, Button, Textarea, VStack, Text } from '@chakra-ui/react'

interface Step1Props {
  onNext: () => void
  setTextReport: (text: string) => void
  textReport: string
  onBack: () => void
}

const Step1: React.FC<Step1Props> = ({
  onNext,
  setTextReport,
  textReport,
  onBack
}: Step1Props) => {
  return (
    <VStack spacing={4} color={'black'} width="100%">
      <Text fontSize="2xl" fontWeight="bold">
        What happened?
      </Text>
      <Textarea
        placeholder="Describe the incident..."
        size="lg"
        value={textReport}
        onChange={(e) => setTextReport(e.target.value)}
        resize="vertical"
        height="150px"
        border="2px"
        borderColor="gray.300"
        borderRadius="md"
        _hover={{ borderColor: 'gray.500' }}
        _focus={{ borderColor: 'black' }}
        maxLength={500}
      />
      <Button colorScheme="blackAlpha" onClick={onNext} size="lg" mt={4}>
        Next
      </Button>
      <Button colorScheme="yellow" onClick={onBack} size="lg" mt={2}>
        Back
      </Button>
    </VStack>
  )
}

export default Step1
