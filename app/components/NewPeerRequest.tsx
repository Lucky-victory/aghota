import { TPeerMetadata } from "@/pages/meet/[roomId]";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";

import { Room } from "@huddle01/web-core";
import { FiCheck, FiSlash } from "react-icons/fi";

export default function NewPeerRequest({
  room,
  peerId,
}: {
  room: Room;
  peerId?: string;
}) {
  function acceptPeer(peerId: string) {
    room.admitPeer(peerId);
  }
  function denyPeer(peerId: string) {
    room.denyPeer(peerId);
  }
  function getLobbyPeerMeta(peerId: string) {
    return room.getLobbyPeerMetadata<TPeerMetadata>(peerId);
  }

  return (
    <Box>
      {room.lobbyPeerIds.map((peerId) => (
        <HStack
          key={peerId}
          gap={4}
          bg={"gray.100"}
          px={"10px"}
          py={"6px"}
          rounded={"full"}
        >
          <Text as={"span"}>
            <Text as={"span"} fontWeight={500}>
              {getLobbyPeerMeta(peerId).metadata?.displayName}
            </Text>
            <Text as={"span"}>wants to join</Text>
          </Text>
          <HStack>
            <IconButton
              rounded={"full"}
              size={"sm"}
              aria-label="reject"
              colorScheme="red"
              onClick={() => denyPeer(peerId)}
            >
              <FiSlash size={20} />
            </IconButton>
            <IconButton
              onClick={() => acceptPeer(peerId)}
              size={"sm"}
              colorScheme="green"
              rounded={"full"}
              aria-label="accept"
            >
              <FiCheck size={22} />
            </IconButton>
          </HStack>
        </HStack>
      ))}
    </Box>
  );
}
