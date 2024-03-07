import {
  Avatar,
  Box,
  Flex,
  GenericAvatarIcon,
  HStack,
  Heading,
  IconButton,
  ResponsiveValue,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Input,
  Tabs,
  Text,
  Spinner,
  Badge,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { BsRecordCircle } from "react-icons/bs";
import {
  FiCast,
  FiCheck,
  FiChevronRight,
  FiMic,
  FiMicOff,
  FiPhone,
  FiSend,
  FiSlash,
  FiUser,
  FiUsers,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
  useActivePeers,
} from "@huddle01/react/hooks";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NewPeerRequest from "@/components/NewPeerRequest";
import RemotePeer from "@/components/RemotePeer";
import LocalPeer from "@/components/LocalPeer";
import { ChatArea } from "@/components/ChatArea";

export type TPeerMetadata = {
  displayName: string;
};
export default function MeetPage() {
  const participantsCardStyle = {
    overflow: "hidden",
    minW: 200,
    flex: 1,
    h: "full",
    bg: "gray.200",
    rounded: "20px",
    pos: "relative" as ResponsiveValue<"relative">,
    maxW: 300,
  };
  const activePeers = useActivePeers();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Lucky");
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);

  const { joinRoom, state, room, muteEveryone, leaveRoom } = useRoom({
    onFailed(data) {
      console.log("Failed to join room", data);
    },
    onJoin: (data) => {
      // data.room
      console.log("onRoomJoin", data);
      console.log({ roomLocked: room.config });
      updateLocalPeerMetadata({ displayName });
    },
    onWaiting(data) {
      console.log({ data }, "on waiting");
    },
    onPeerJoin: (peerId) => {
      console.log("onPeerJoin", peerId);
    },
  });
  console.log({ peers: room.remotePeers });
  const {
    enableVideo,
    isVideoOn,
    stream: videoStream,
    disableVideo,
  } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const {
    startScreenShare,
    stopScreenShare,
    shareStream: shareScreenStream,
  } = useLocalScreenShare();
  const { updateMetadata: updateLocalPeerMetadata } =
    useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();
  const roomId = router.query.roomId as string;

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
  useEffect(() => {
    if (videoStream && shareScreenStream && miniVideoRef.current) {
      miniVideoRef.current.srcObject = videoStream;
    }
  }, [shareScreenStream, videoStream]);

  async function handleJoinRoom(token: string) {
    await joinRoom({
      roomId: roomId as string,
      token,
    });
  }
  useEffect(() => {
    // async function handleCreateNewToken() {
    //   console.log("handleCreateNewMeeting");
    //   try {
    //     const response = await axios.get(
    //       `/api/create-access-token?roomId=${roomId}`
    //     );
    //     const data = response.data;
    //     setToken(data?.token);
    //     await handleJoinRoom(data?.token);
    //   } catch (error) {}
    // }
    // handleCreateNewToken();
  }, [roomId]);
  async function handleEvents(type: "audio" | "video" | "screen") {
    switch (type) {
      case "audio":
        try {
          isAudioOn ? await disableAudio() : await enableAudio();
        } catch (error) {}

        break;
      case "video":
        try {
          isVideoOn ? await disableVideo() : await enableVideo();
        } catch (error) {}
        break;
      case "screen":
        try {
          shareScreenStream
            ? await stopScreenShare()
            : await startScreenShare();
        } catch (error) {}
        break;

      default:
        break;
    }
  }
  return (
    <Flex as="main" minH={"var(--chakra-vh)"} bg={"gray.500"} p={3}>
      <Flex direction={"column"} gap={3} flex={1} minH={"full"}>
        <HStack
          justify={"space-between"}
          gap={5}
          bg={"white"}
          rounded={"full"}
          py={2}
          px={3}
        >
          <Box>
            <Heading size={"md"}>Meeting Title</Heading>
          </Box>
          <HStack>
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
              {JSON.stringify(room.config)}
              <FiUsers />
            </Button>
            <NewPeerRequest room={room} peerId={""} />
          </HStack>
        </HStack>

        <Flex h={"full"} rounded={"30px"} p={3} gap={4}>
          {/* video area */}
          <Flex flexDir={"column"} gap={3} flex={1} minH={"full"}>
            <LocalPeer />
            {/* participants area */}
            <HStack h={"150px"} rounded={"30px"} gap={3}>
              {peerIds?.length > 0 &&
                peerIds.map((peerId) => (
                  <RemotePeer key={peerId} peerId={peerId} />
                ))}
              {shareScreenStream && videoStream && (
                <Box {...participantsCardStyle}>
                  <Box
                    as="video"
                    muted
                    autoPlay
                    ref={miniVideoRef}
                    h={"full"}
                    w={"full"}
                    left={0}
                    top={0}
                    // aspectRatio={"16:9"}
                    objectFit={"cover"}
                    pos={"absolute"}
                  ></Box>
                </Box>
              )}
              <Box {...participantsCardStyle}>
                <IconButton
                  pos={"absolute"}
                  aria-label="enable or disable mic"
                  bg={"rgba(0,0,0,0.4)"}
                  _hover={{
                    bg: "rgba(0,0,0,0.71)",
                  }}
                  rounded={"full"}
                  color={"white"}
                  fontSize={"14px"}
                  p={1}
                  top={1}
                  right={2}
                  w={"auto"}
                  h={"auto"}
                >
                  {/* <FiMic /> */}
                  <FiMicOff />
                </IconButton>
                <Flex h={"full"} justify={"center"} align={"center"}>
                  <Avatar
                    icon={<FiUser />}
                    fontSize={"40px"}
                    size={"lg"}
                    bg={"gray.400"}
                  />
                </Flex>
              </Box>
              <Box {...participantsCardStyle}></Box>
              <Box {...participantsCardStyle}></Box>

              <IconButton
                aria-label="show all participants"
                h={"full"}
                colorScheme="gray"
                rounded={"30px"}
              >
                <FiChevronRight />
              </IconButton>
            </HStack>
          </Flex>

          {/* chat area */}
          <Box overflow={"hidden"} w={"350px"} bg={"gray.200"} rounded={"30px"}>
            <ChatArea />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
