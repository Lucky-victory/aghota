import { Box, Button, Flex, HStack, Heading, Input } from "@chakra-ui/react";
import axios from "axios";
import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiVideoPlus } from "react-icons/bi";
import { FiVideo } from "react-icons/fi";

export default function NewMeeting({ router }: { router: NextRouter }) {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleCreateNewMeeting() {
    let roomId = "";
    try {
      setIsSending(true);

      const response = await axios.post<{ roomId: string; token: string }>(
        "/api/create-room",
        {
          title: meetingTitle,
          userMeta: { displayName: "Victory" },
        }
      );
      const { data } = response;
      roomId = data?.roomId;
      const token = data?.token;

      try {
        // const response = await axios.post(
        //   `/api/create-admin-token?roomId=${roomId}`
        // );
        // const data = response.data;

        router.push(`/meet/${roomId}?rc=1`);

        //  await handleJoinRoom(data?.token);
      } catch (error) {
        console.log("Error creating admin token", { error });
      }
      setIsSending(false);
    } catch (error) {
      console.log("Error creating room", { error });
    }

    // handleCreateNewToken();
  }
  return (
    <Flex flexDir={"column"} gap={4} maxW={400}>
      <Heading>Create A Meeting</Heading>

      <Input
        placeholder="What's the meeting for?..."
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
      />
      <HStack>
        <Button
          flex={1}
          // isLoading={isSending}
          // onClick={() => handleCreateNewMeeting()}
          colorScheme="teal"
          variant={"outline"}
        >
          Schedule a meeting
        </Button>
        <Button
          // flex={1}
          gap={2}
          isLoading={isSending}
          onClick={() => handleCreateNewMeeting()}
          colorScheme="teal"
        >
          <BiVideoPlus size={24} />
          Start Instant Meeting
        </Button>
      </HStack>
    </Flex>
  );
}
