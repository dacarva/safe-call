"use client";

import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  HStack,
  Button,
  Icon,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { BiLinkExternal, BiRightArrowAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdReport, MdVolunteerActivism } from "react-icons/md";
import DonationModal from "@/components/modal/DonateModal";
import BottomNavbar from "@/components/BottomNavbar";

const ngos = [
  {
    name: "Foundation Mariana Novoa",
    reports: 89,
    donation: "$1,000",
    image: "/image_1.png",
    bgColor: "pink.100",
  },
  {
    name: "Foundation Ana Bella",
    reports: 89,
    donation: "$1,000",
    image: "/image_2.png",
    bgColor: "orange.100",
  },
  {
    name: "Mujery Futuro",
    reports: 89,
    donation: "$1,000",
    image: "/image_3.png",
    bgColor: "red.100",
  },
];

export const GoogleMapEmbed = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        position: "relative",
        borderRadius: "4rem",
      }}
    >
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text mb={4}>Loading Map...</Text>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner textAlign={"center"} size="lg" color="blackAlpha.500" />
          </Box>
        </div>
      )}
      {!loading && (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094746!2d144.9630578157693!3d-37.81410797975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5774d0c0f872a1e!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1618576359024!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: "0" }}
          allowFullScreen={true}
          loading="lazy"
          onLoad={() => setLoading(false)} // Se asegura de que el loading se apague cuando el iframe esté listo
        ></iframe>
      )}
    </div>
  );
};

const Donate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onDonate = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Box p={4} className="w-full">
        <Heading size="lg" mb={2}>
          Donate for love ❤️
        </Heading>
        <Text mb={4}>
          NGOs are helping you and other accident victims. You can help them too
          by donating your love for them.
        </Text>
        <Tabs variant="soft-rounded" colorScheme="gray">
          <TabList
            mb={4}
            width={"100%"}
            backgroundColor={"#E2E8F0"}
            borderRadius={"9999px"}
          >
            <Tab width={"50%"}>Reports</Tab>
            <Tab width={"50%"}>NGOs</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <GoogleMapEmbed />
            </TabPanel>
            <TabPanel>
              <Stack spacing={4} height={"550px"} overflow={"auto"}>
                {ngos.map((ngo, index) => (
                  <Box
                    key={index}
                    bg={ngo.bgColor}
                    p={4}
                    borderRadius="lg"
                    boxShadow="md"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Image
                        src={ngo.image}
                        alt={ngo.name}
                        width={70}
                        height={70}
                        style={{ marginTop: "2rem" }}
                      />
                      <Box
                        style={{ width: "100%" }}
                        position={"relative"}
                        ml={2}
                      >
                        <Box
                          width={"100%"}
                          display={"flex"}
                          justifyContent={"end"}
                        >
                          <Icon
                            as={BiLinkExternal}
                            right={"0"}
                            top={"0"}
                            color={"#8E8E93"}
                            fontSize={"1.5rem"}
                          />
                        </Box>
                        <Box
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "start",
                          }}
                        >
                          <Text fontWeight="bold" style={{ flexGrow: "2" }}>
                            {ngo.name}{" "}
                          </Text>
                        </Box>
                        <Box color="#8E8E93" mt={3}>
                          <Flex
                            alignItems="center"
                            mb="10px"
                            lineHeight={"0.1"}
                          >
                            <MdReport style={{ marginRight: "10px" }} />
                            <Text fontSize="sm">Reports handled: 89</Text>
                          </Flex>
                          <Flex alignItems="center">
                            <MdVolunteerActivism
                              style={{ marginRight: "10px" }}
                            />
                            <Text fontSize="sm">Donation received: $1,000</Text>
                          </Flex>
                        </Box>
                      </Box>
                    </HStack>
                    <Flex justify="end">
                      <Button
                        backgroundColor="transparent"
                        size="sm"
                        rightIcon={<BiRightArrowAlt />}
                        onClick={onDonate}
                      >
                        Donate
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <DonationModal isOpen={isOpen} onClose={onClose} />
      </Box>
      <BottomNavbar />
    </>
  );
};

export default Donate;
