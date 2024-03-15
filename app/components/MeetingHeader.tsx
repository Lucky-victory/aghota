import { Badge, Box, Button, HStack, Heading, Text } from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import NewPeerRequest from "./NewPeerRequest";
import { Room } from "@huddle01/web-core";
import { useLobby } from "@huddle01/react/hooks";
import { updateLobbyPeerIds } from "@/state/slices";
import { useAppDispatch } from "@/state/store";
import { LuUsers, LuUsers2 } from "react-icons/lu";
export default function MeetingHeader({ room }: { room: Room }) {
  const dispatch = useAppDispatch();
  const lobbyPeers = useLobby({
    onLobbyPeersUpdated: (lobbyPeers) => {
      dispatch(updateLobbyPeerIds(lobbyPeers));
    },
  });
  return (
    <HStack
      justify={"space-between"}
      gap={5}
      bg={"white"}
      rounded={"40px"}
      py={2}
      px={3}
    >
      <Box>
        <Heading size={"md"}>Meeting Title</Heading>
      </Box>
      <HStack>
        <HStack>
          <HStack>
            <FiUsers />
            <Text fontSize={"13px"} as={"span"}>
              Pending Invites
            </Text>
          </HStack>

          <Badge colorScheme="orange">{lobbyPeers.lobbyPeersIds.length}</Badge>
        </HStack>
        <Button
          mr={3}
          colorScheme="teal"
          variant={"ghost"}
          pos={"relative"}
          rounded={"full"}
          aria-label="active peers"
        >
          <Badge
            colorScheme="teal"
            top={"-2px"}
            right={2}
            pos={"absolute"}
          ></Badge>

          <FiUsers />
        </Button>
        {lobbyPeers.lobbyPeersIds.length > 0 && <NewPeerRequest room={room} />}
      </HStack>
    </HStack>
  );
}
