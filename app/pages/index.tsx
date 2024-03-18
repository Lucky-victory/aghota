import Head from "next/head";
import Image from "next/image";
import { Inter, Varela_Round } from "next/font/google";

import { Box, Flex, HStack, Heading } from "@chakra-ui/react";
import NewMeeting from "@/components/NewMeeting";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  console.log({ session });

  return (
    <>
      <Head>
        <title>Aghota</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HStack
        mx={"auto"}
        maxW={"1400px"}
        as={"header"}
        justify={"space-between"}
        px={4}
        py={3}
      >
        <Box></Box>
        <ConnectButton />
      </HStack>
      <Box as="main" mx={"auto"} maxW={"1400px"}>
        <Flex align={"center"} as="main" h={"var(--chakra-vh)"}>
          <Flex flexDir={"column"} p={8}>
            <Heading maxW={500}>Video Calls and meetings for everyone</Heading>
            <NewMeeting router={router} />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
