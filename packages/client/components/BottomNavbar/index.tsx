// components/BottomNavbar.tsx

"use client";

import { Box, IconButton, Text } from "@chakra-ui/react";
import { BiDonateHeart, BiHistory, BiMessageSquareError } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const BottomNavbar = () => {
  const router = useRouter();
  const {data} = useSession();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    if (data?.user?.name) {
      setIsLogged(true);
    }
  }, [data?.user?.name])
  if(!isLogged) {
    return null;
  }
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      py={2}
      zIndex={10}
    >
      <Box textAlign="center">
        <IconButton
          icon={<BiMessageSquareError size="24px" />}
          aria-label="Report"
          onClick={() => handleNavigation("/report")}
          variant="ghost"
          color={'black'}
          isRound
        />
        <Text fontSize="xs" color="gray.500">
          Report
        </Text>
      </Box>
      <Box textAlign="center">
        <IconButton
          icon={<BiDonateHeart size="24px" />}
          aria-label="Donate"
          onClick={() => handleNavigation("/donate")}
          variant="ghost"
          color={'black'}
          isRound
        />
        <Text fontSize="xs" color="black">
          Donate
        </Text>
      </Box>
      <Box textAlign="center">
        <IconButton
          icon={<BiHistory size="24px" />}
          aria-label="History"
          onClick={() => handleNavigation("/history")}
          variant="ghost"
          color={'black'}
          isRound
        />
        <Text fontSize="xs" color="gray.500">
          History
        </Text>
      </Box>
    </Box>
  );
};

export default BottomNavbar;
