'use client'
import React from 'react'
import { Box, Button, Textarea, VStack, Text } from '@chakra-ui/react'

interface Step1Props {
  onNext: () => void
  onBack: () => void
}

const Step2: React.FC<Step1Props> = ({
  onNext,
  onBack
}: Step1Props) => {
  return (
    <VStack spacing={4} color={'black'} width="100%">
      <Text fontSize="2xl" fontWeight="bold">
        Location
      </Text>
      <Button colorScheme="blackAlpha" onClick={onNext} size="lg" mt={4}>
        Next
      </Button>
      <Button colorScheme="yellow" onClick={onBack} size="lg" mt={2}>
        Back
      </Button>
    </VStack>
  )
}

export default Step2
