import { useAddMeetingMutation, useCreateRoomMutation } from "@/state/services";
import { update } from "@/state/slices";
import { useAppDispatch } from "@/state/store";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { KeyboardEvent, useState } from "react";

export default function NewMeeting() {
  const router = useRouter();

  const [meetingTitle, setMeetingTitle] = useState("");
  const [isSending, setIsSending] = useState(false);
  const dispatch = useAppDispatch();
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const [addMeeting] = useAddMeetingMutation();
  async function handleCreateNewMeeting() {
    let roomId = "";
    try {
      setIsSending(true);

      const response = await axios.post<{ roomId: string; token: string }>(
        "/api/create-room",
        {
          title: meetingTitle,
          // userMeta: session.user,
        }
      );
      const { data } = response;
      roomId = data?.roomId;
      // await addMeeting({
      //   roomId,
      //   title: meetingTitle,
      //   userAddress: session.address,
      // });

      dispatch(update({ isCreator: true, token: data?.token }));
      setIsSending(false);
      router.push(`/meet/${roomId}`);
    } catch (error) {
      console.log("Error creating room", { error });
    }

    // handleCreateNewToken();
  }
  return (
    <Flex flexDir={"column"} gap={4} maxW={400}>
      {/* <Heading>Create A Meeting</Heading> */}
      <FormControl>
        <FormLabel>Meeting Title:</FormLabel>
        <Input
          autoComplete="off"
          py={3}
          isDisabled={isSending}
          colorScheme="teal"
          _focus={{
            boxShadow: "0 0 0 1px teal",
            borderColor: "teal",
          }}
          onKeyUp={async (e: KeyboardEvent) => {
            if (e.key == "Enter") await handleCreateNewMeeting();
          }}
          placeholder="What's the meeting about?..."
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
        />
      </FormControl>
      <HStack>
        <Button
          rounded={"full"}
          // flex={1}
          gap={2}
          isLoading={isSending}
          onClick={async () => await handleCreateNewMeeting()}
          colorScheme="teal"
        >
          {/* <BiVideoPlus size={24} /> */}
          Continue
        </Button>
      </HStack>
    </Flex>
  );
}
