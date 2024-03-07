import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { useRoom } from "@huddle01/react/hooks";
import { Room } from "@huddle01/web-core";
import { FiCheck, FiSlash } from "react-icons/fi";

export default function NewPeerRequest({
  room,
  peerId,
}: {
  room: Room;
  peerId: string;
}) {
  function acceptPeer() {
    room.admitPeer(peerId);
  }
  function denyPeer() {
    room.denyPeer(peerId);
  }
  return (
    <Box>
      <HStack gap={4} bg={"gray.100"} px={"10px"} py={"6px"} rounded={"full"}>
        <Text as={"span"}>
          <Text as={"span"} fontWeight={500}>
            Mary
          </Text>{" "}
          wants to join the meeting
        </Text>
        <HStack>
          <IconButton
            rounded={"full"}
            size={"sm"}
            aria-label="reject"
            colorScheme="red"
            onClick={() => denyPeer()}
          >
            <FiSlash size={20} />
          </IconButton>
          <IconButton
            onClick={() => acceptPeer()}
            size={"sm"}
            colorScheme="green"
            rounded={"full"}
            aria-label="accept"
          >
            <FiCheck size={22} />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}
