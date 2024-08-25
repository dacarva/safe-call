'use client'
import React, { Fragment, useState } from 'react'
import { Button, Text, useDisclosure } from '@chakra-ui/react'
import DonationModal from '@/components/modal/DonateModal';

const Donate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onDonate = () => {
    setIsOpen(true);
  }
  const onClose = () => {
    setIsOpen(false);
  }
  return (
    <Fragment>
      <Text>Donate page</Text>
      <Button onClick={onDonate}>Donate</Button>
      <DonationModal 
        isOpen={isOpen} 
        onClose={onClose}
      />
    </Fragment>
  )
}

export default Donate
