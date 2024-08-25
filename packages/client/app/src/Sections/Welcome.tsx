
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Spinner,
  Text,
  Toast,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import { useUser } from '../../../components/Context/UserContext'
import { useRouter } from 'next/navigation'

const Welcome = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, user } = useUser()
  const processLogin = async () => {
    try {
      console.log('Processing login...')
      const delay = (ms: any) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }
      setIsLoading(true)
      const userDataStored = localStorage.getItem('user')
      if (userDataStored) {
        const parsedData = JSON.parse(userDataStored)
        setUser(parsedData)
        router.push('/home')
      } else {
        const userId = uuidv4()
        const data1 = { userId: userId }
        const initUserWalletResponse = await fetch('/api/pw/create-user/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data1),
        })
        const data2 = await initUserWalletResponse.json()
        const userToken = data2.userToken
        const encryptionKey = data2.encryptionKey
        const challengeId = data2.challengeId
  
        const sdk = new W3SSdk()
        const executeMethod = (challengeId: any) => {
          return new Promise((resolve, reject) => {
            sdk.execute(challengeId!, (error: any, result: any) => {
              if (error) {
                Toast({
                  title: 'Error',
                  description: 'An error occurred on the pin selection method',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                })
                reject(error)
              } else if (result) {
                console.log('User registered!')
                resolve(result)
              }
            })
          })
        }
        let walletAddress, walletId
        sdk.setAppSettings({ appId: process.env.NEXT_PUBLIC_APP_ID! })
        console.log('userToken:', userToken);
        console.log('encryptionKey:', encryptionKey);
        
        sdk.setAuthentication({
          userToken: userToken,
          encryptionKey: encryptionKey,
        })
        // Wait for the successful completion of executeMethod
        await executeMethod(challengeId!)
        await delay(1700)
        const data = { userToken: userToken }
        console.log('data is:', data);
        
        // After successful completion of sdk.execute() make another API call
        const status = await fetch('/api/pw/check-user-status/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
  
        console.log('Status: ')
        const body = await status.json()
        walletAddress = body.wallet.address
        walletId = body.wallet.id
        console.log('Wallet Address:', walletAddress)
        console.log('Wallet Id:', walletId)
        const userData = {
          userId: userId,
          address: walletAddress,
          walletId: walletId,
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/instructions')
      }
    } catch (error) {
      console.error('Error while processing login:', error)
      Toast({
        title: 'Error',
        description: 'An error occurred while processing start',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Center height="100vh" bg="gray.50">
      <VStack spacing={6}>
        <Box boxSize="160px">
          <Image src="/appIcon.png" alt="Logo" boxSize="100%" />
        </Box>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color={'black'}
        >
          Hi, welcome to{' '}
          <Text as="span" color="yellow.400">
            Vox
          </Text>
          guard 👋
        </Text>
        <Text fontSize="md" color="gray.500" textAlign="center">
          We help report accidents while preserving your personal information
        </Text>
        {isLoading ? (
          <Spinner size="lg" color="blackAlpha.500" />
        ) : (
          <Button
            colorScheme="blackAlpha"
            size="lg"
            rounded="full"
            onClick={processLogin}
          >
            Continue
          </Button>
        )}
      </VStack>
    </Center>
  )
}

export default Welcome