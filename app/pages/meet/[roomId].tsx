import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Button,
  Input,
  Stack,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FiChevronRight } from "react-icons/fi";
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
  useActivePeers,
} from "@huddle01/react/hooks";
import MeetingHeader from "@/components/MeetingHeader";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import RemotePeer from "@/components/RemotePeer";
import LocalPeer from "@/components/LocalPeer";
import { ChatArea } from "@/components/ChatArea";
import { RootState, useAppDispatch } from "../../state/store";
import { useSelector } from "react-redux";

export type TPeerMetadata = {
  displayName: string;
  avatarUrl?: string;
};
interface Props {
  token: string;
}
export default function MeetPage() {
  const dispatch = useAppDispatch();

  const meetingCreator = useSelector(
    (state: RootState) => state.meetingCreator
  );

  const activePeers = useActivePeers();

  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [lobbyPeersIds, setLobbyPeersIds] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  const roomInstance = useRoom({
    onFailed(data) {
      console.log("Failed to join room", { data });
    },
    onJoin: (data) => {
      // data.room
      console.log("onRoomJoin", data);

      updateLocalPeerMetadata({ displayName });
    },
    onWaiting(data) {
      setIsWaiting(
        data.reason === "WAITING_FOR_ADMIN_TO_JOIN" ||
          data.reason === "WAITING_FOR_PERMISSIONS"
      );
      // setLobbyPeersIds(room.lobbyPeerIds);
    },
    onPeerJoin: (peerId) => {
      // dispatch(
      //   updateRemotePeer({
      //     peerId,
      //     metadata: { displayName: displayName },
      //   })
      // );
      // dispatch(updateRemotePeerIds([...remotePeersInState, peerId]));
      console.log("onPeerJoin", peerId);
    },
  });

  const { joinRoom, state, room } = roomInstance;

  const isIdle = state === "idle";
  const isConnecting = state === "connecting";
  const isConnected = state === "connected";
  const { roomId } = router.query;

  const { stream: videoStream } = useLocalVideo();

  const { shareStream: shareScreenStream } = useLocalScreenShare();
  const {
    updateMetadata: updateLocalPeerMetadata,
    role,
    peerId: localPeerId,
  } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();
  // const remotePeer=useRemotePeer()
  useEffect(() => {
    if (!shareScreenStream && videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, shareScreenStream]);

  useEffect(() => {
    if (shareScreenStream && screenShareRef.current) {
      screenShareRef.current.srcObject = shareScreenStream;
    }
  }, [shareScreenStream]);

  async function handleJoinRoom(token?: string) {
    try {
      // setIsJoining(true);
      await joinRoom({
        roomId: roomId as string,
        token: token as string,
      });
    } catch (error) {
      console.log("Error while joining room", { error });
    }
  }
  // useEffect(() => {
  //   const fetcher = async () => {
  //     await handleCreateNewToken();
  //   };
  //   fetcher();
  // }, []);

  async function handleCreateNewToken() {
    console.log("handleCreateToken");
    try {
      setIsJoining(true);
      if (meetingCreator.isCreator && meetingCreator.token) {
        await handleJoinRoom(meetingCreator.token);
        return;
      } else {
        const response = await axios.post(
          `/api/create-token?roomId=${roomId}&isCreator=${meetingCreator.isCreator}`,
          {
            metadata: { displayName: displayName },
          }
        );
        const data = response.data;

        setDisplayName(data?.metadata?.displayName);
        await handleJoinRoom(data?.token);
      }
      setIsJoining(false);
    } catch (error) {}
  }
  function handleChatAreaMinimize(isMinimized: boolean) {
    setIsMinimized(isMinimized);
  }

  async function startRecording() {
    try {
      setIsRecording(true);
      const recording = await axios("/api/start-recording?roomId=" + roomId);
      console.log({ recording });
    } catch (error) {
      console.log("Error while starting recording");
    }
  }
  async function stopRecording() {
    try {
      setIsRecording(false);
      const recording = await axios("/api/stop-recording?roomId=" + roomId);
      console.log({ recording });
    } catch (error) {
      console.log("Error while stopping recording");
    }
  }
  function isNotBot(remotePeerId: string) {
    return !remotePeerId.includes("bot");
  }
  const hasRemotePeers = peerIds?.length > 0;
  return (
    <Flex as="main" minH={"var(--chakra-vh)"} bg={"gray.100"} p={2}>
      {isIdle && (
        <Stack
          gap={4}
          minW={300}
          shadow={"md"}
          mx={"auto"}
          alignSelf={"center"}
          py={8}
          px={6}
          rounded={"md"}
        >
          <Box>
            <Heading mb={2} size={"sm"} fontWeight={500}>
              Enter your name:
            </Heading>
            <Input
              colorScheme="teal"
              _focus={{
                boxShadow: "0 0 0 1px teal",
                borderColor: "teal",
              }}
              onKeyUp={async (e: KeyboardEvent) => {
                if (e.key == "Enter") await handleCreateNewToken();
              }}
              placeholder="John doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Box>
          <Button
            isDisabled={!displayName || displayName.length < 2}
            isLoading={isJoining}
            onClick={async () => await handleCreateNewToken()}
            colorScheme="teal"
          >
            {meetingCreator.isCreator ? "Start Meeting" : "Ask to Join"}
          </Button>
        </Stack>
      )}

      {isConnecting && isWaiting && (
        <Stack
          gap={4}
          minW={300}
          shadow={"md"}
          mx={"auto"}
          alignSelf={"center"}
          py={8}
          px={6}
          rounded={"md"}
        >
          <Heading>Asking to join</Heading>
          <Text>You will be let in a moment.</Text>
        </Stack>
      )}
      {!isIdle && isConnected && (
        <Flex direction={"column"} gap={2} flex={1} minH={"full"}>
          <MeetingHeader room={room} />
          <Flex
            h={"full"}
            bg={"white"}
            rounded={"30px"}
            p={2}
            gap={3}
            overflow={"hidden"}
            pos={"relative"}
          >
            {/* video area */}
            {/* <Flex
              flexDir={"column"}
              gap={3}
              flex={1}
              minH={"full"}
              transition={"0.65s ease-in-out"}
             */}
            <Stack
              minH="full"
              flex={1}
              gap={3}
              mr={{
                lg: !isMinimized ? "var(--chat-area-width,330px)" : "auto",
              }}
            >
              <LocalPeer
                {...roomInstance}
                local={{
                  isRecording: isRecording,
                  onStartRecord: startRecording,
                  onStopRecord: stopRecording,
                  displayName: displayName,
                  role: role,
                  activePeers,
                  localPeerId: localPeerId as string,
                }}
              />

              {/* participants area */}
              {peerIds?.length > 0 && (
                <Flex h={150} gap={3} overflowX={"auto"}>
                  <HStack gap={3} flex={1}>
                    {peerIds.map(
                      (peerId) =>
                        isNotBot(peerId) && (
                          <RemotePeer
                            activePeers={activePeers}
                            key={peerId}
                            peerId={peerId}
                          />
                        )
                    )}
                  </HStack>
                  <IconButton
                    pos={"sticky"}
                    right={0}
                    aria-label="show all participants"
                    h={"full"}
                    colorScheme="gray"
                    rounded={"30px"}
                  >
                    <FiChevronRight />
                  </IconButton>
                </Flex>
              )}
            </Stack>

            {/* chat area */}

            <ChatArea room={room} onMinimized={handleChatAreaMinimize} />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
