import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import axios from "axios";
import { useRouter, NextRouter } from "next/router";
import { useState } from "react";

export default function NewMeeting({ router }: { router: NextRouter }) {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleCreateNewMeeting() {
    console.log("handleCreateNewMeeting");
    try {
      setIsSending(true);

      const response = await axios.post<{ roomId: string }>(
        "/api/create-room",
        {
          title: meetingTitle,
        }
      );
      const { data } = response;

      router.push(`/meet/${data?.roomId}`);
      setIsSending(false);
    } catch (error) {}
  }
  return (
    <Flex flexDir={"column"} gap={4} maxW={400}>
      <Heading>Create A Meeting</Heading>

      <Input
        placeholder="What's the meeting for?..."
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
      />
      <Button
        isLoading={isSending}
        onClick={() => handleCreateNewMeeting()}
        colorScheme="teal"
      >
        Create Meeting
      </Button>
    </Flex>
  );
}
