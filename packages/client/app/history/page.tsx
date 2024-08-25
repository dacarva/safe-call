"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  List,
  ListItem,
  Icon,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { fetchReports } from "../services/fetchReports";
import BottomNavbar from "@/components/BottomNavbar";

const ReportHistory = () => {
  const [reportsData, setReportsData] = useState<any>([]);
  const reports = [
    { date: "2024-08-21", status: "Reviewing", color: "orange" },
    { date: "2024-08-21", status: "Completed", color: "green" },
    { date: "2024-08-21", status: "Issue", color: "red" },
  ];

  const donations = [
    { date: "2024-08-20", amount: "50 USDT" },
    { date: "2024-08-18", amount: "10 USDT" },
  ];

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const data = await fetchReports();
      console.log(data);
      setReportsData(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Box p={4} bg="white" color="black" minHeight="100vh">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Report History
        </Text>
        <Tabs variant="soft-rounded" colorScheme="gray">
          <TabList>
            <Tab _selected={{ color: "white", bg: "black" }}>Reports</Tab>
            <Tab _selected={{ color: "white", bg: "black" }}>Donations</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <List spacing={4}>
                {reportsData && reports.map((report, index) => (
                  <ListItem key={index}>
                    <Flex
                      justify="space-between"
                      align="center"
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                      borderColor="gray.200"
                    >
                      <Text fontSize="lg" fontWeight="bold">
                        {report.date}
                      </Text>
                      <Badge colorScheme={report.color}>{report.status}</Badge>
                      <Icon as={ArrowForwardIcon} boxSize={5} />
                    </Flex>
                  </ListItem>
                ))}
                {reportsData && reportsData.map((report: any, index: number) => (
                  <ListItem key={index}>
                    <Flex
                      justify="space-between"
                      align="center"
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                      borderColor="gray.200"
                    >
                      <Text fontSize="lg" fontWeight="bold">
                        {report.date ?? "Last Month"}
                      </Text>
                      <Badge colorScheme={report.color ?? "orange"}>
                        {report.status ?? "Reviewing"}
                      </Badge>
                      <Icon as={ArrowForwardIcon} boxSize={5} />
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
            <TabPanel>
              <List spacing={4}>
                {donations.map((donation, index) => (
                  <ListItem key={index}>
                    <Flex
                      justify="space-between"
                      align="center"
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                      borderColor="gray.200"
                    >
                      <Text fontSize="lg" fontWeight="bold">
                        {donation.date}
                      </Text>
                      <Text color="gray.500">{donation.amount}</Text>
                      <Icon as={ArrowForwardIcon} boxSize={5} />
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <BottomNavbar />
    </>
  );
};

export default ReportHistory;
