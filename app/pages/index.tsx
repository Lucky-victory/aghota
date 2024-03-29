import Head from "next/head";

import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NewMeeting from "@/components/NewMeeting";
import NavHeader from "@/components/NavHeader";
import PageWrapper from "@/components/PageWrapper";
import { BiVideoPlus } from "react-icons/bi";
import { useState } from "react";
import JoinMeeting from "@/components/JoinMeeting";

import { useLogin, usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { authenticated, connectOrCreateWallet } = usePrivy();
  const { login } = useLogin();
  const [formToShow, setFormToShow] = useState<"join" | "new" | string>("join");

  // const isConnected = status === "authenticated";
  const { onClose, onOpen, isOpen } = useDisclosure();
  function handleStartMeetingClick(form = "new") {
    if (!authenticated) {
      login();
      return;
    }
    setFormToShow(form);
    onOpen();
  }
  function handleJoinClick(form = "join") {
    setFormToShow(form);
    onOpen();
  }
  let url = "https://aghota.vercel.app";
  return (
    <PageWrapper maxW={1200}>
      <Head>
        <title>Aghota | Seamlessly Connect, Anywhere, Anytime </title>
        <meta
          name="description"
          content=" Unlock the Future of Collaboration: Aghọta - Where Web3 Innovations
            Meet, Ideas Converge, and Opportunities Thrive. Join Us in Shaping
            the Next Era of Digital Interaction!"
        />
        <meta property="og:image" content={`${url}/images/og.png`}></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavHeader />
      {/* <Box as="main" mx={"auto"} maxW={"1400px"}>
        <Flex align={"center"} as="main" h={"var(--chakra-vh)"}>
          <Flex flexDir={"column"} p={8}>
            <Heading maxW={500}>Video Calls and meetings for everyone</Heading>
            <NewMeeting />
          </Flex>
        </Flex>
      </Box> */}
      <HStack
        wrap={"wrap-reverse"}
        gap={5}
        mt={16}
        justify={"space-between"}
        maxW={1100}
      >
        <Stack maxW={600} px={5}>
          <Heading size={"2xl"} mb={4}>
            <Text as={"span"} color={"teal.500"} fontWeight={700}>
              Aghota:
            </Text>{" "}
            Seamlessly Connect, Anywhere, Anytime
          </Heading>
          <Text mb={2} fontSize={"md"} color={"gray.500"}>
            Unlock the Future of Collaboration: Aghọta - Where Web3 Innovations
            Meet, Ideas Converge, and Opportunities Thrive. Join Us in Shaping
            the Next Era of Digital Interaction!
          </Text>
          <HStack mt={2} gap={4} wrap={"wrap"}>
            <Button
              onClick={() => handleJoinClick("join")}
              rounded={"full"}
              size={"md"}
              px={6}
            >
              Join a meeting
            </Button>
            <Button
              onClick={() => handleStartMeetingClick("new")}
              rounded={"full"}
              gap={2}
              variant={"outline"}
              size={"md"}
              px={6}
            >
              <BiVideoPlus size={24} />
              Start Instant Meeting
            </Button>
          </HStack>
        </Stack>
        <Box maxW={650} px={5}>
          <Image src="/images/chat-lg.png" alt="" maxH={500} />
        </Box>
      </HStack>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
            <Heading size={"lg"}>
              {formToShow === "join" ? "Join" : "Start"} a meeting
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formToShow === "join" ? <JoinMeeting /> : <NewMeeting />}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Box as="footer"></Box>
    </PageWrapper>
  );
}
