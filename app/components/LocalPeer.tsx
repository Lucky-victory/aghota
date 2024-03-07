import { TPeerMetadata } from "@/pages/meet/[roomId]";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
  useRoomControls,
} from "@huddle01/react/hooks";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsRecordCircle } from "react-icons/bs";
import {
  FiMic,
  FiMicOff,
  FiPhone,
  FiUser,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";

export default function LocalPeer() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Lucky");
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  // const activePeers = useActivePeers();
  // console.log({ actPeers: activePeers.activePeerIds });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMutedAll, setIsMutedAll] = useState<boolean>(false);

  const { joinRoom, state, room, closeRoom, muteEveryone, leaveRoom } = useRoom(
    {
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
      onPeerLeft(peerId) {},
    }
  );
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
    async function handleCreateNewToken() {
      console.log("handleCreateNewMeeting");
      try {
        const response = await axios.get(
          `/api/create-access-token?roomId=${roomId}`
        );
        const data = response.data;

        await handleJoinRoom(data?.token);
      } catch (error) {}
    }
    handleCreateNewToken();
  }, [roomId]);
  async function handleEvents(
    type: "audio" | "video" | "screen" | "record" | "muteAll"
  ) {
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
      case "record":
        try {
          isRecording ? await stopScreenShare() : await startScreenShare();
        } catch (error) {}
        break;
      case "muteAll":
        try {
          isRecording ? await stopScreenShare() : await startScreenShare();
        } catch (error) {}
        break;

      default:
        break;
    }
  }

  function handleLeaveRoom() {
    leaveRoom();
    router.push("/");
  }
  return (
    <Flex
      flex={1}
      // overflow={"hidden"}
      pos={"relative"}
      rounded={"30px"}
      w={"full"}
      bg={"gray.100"}
      // p={4}
    >
      {state === "connected" && (
        <>
          {!(isVideoOn && shareScreenStream) && (
            <Stack align={"center"} justify={"center"} h={"full"}>
              <Avatar
                name={displayName}
                size={"xl"}
                icon={<FiUser size={50} />}
              />
            </Stack>
          )}
          {isVideoOn && (
            <Box
              as="video"
              muted
              autoPlay
              h={"full"}
              w={"full"}
              left={0}
              top={0}
              ref={videoRef}
              rounded={"md"}
              // aspectRatio={"16/9"}
              objectFit={"contain"}
              pos={"absolute"}
            ></Box>
          )}
          {shareScreenStream && (
            <Box
              as="video"
              muted
              autoPlay
              ref={screenShareRef}
              h={"full"}
              w={"full"}
              left={0}
              top={0}
              rounded={"md"}
              // aspectRatio={"16/9"}
              objectFit={"contain"}
              pos={"absolute"}
            ></Box>
          )}
        </>
      )}
      {state == "connecting" && (
        <Flex gap={5} w={"full"} h={"full"} justify={"center"} align={"center"}>
          <Spinner
            thickness="4px"
            speed="0.75s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
          <Text fontSize={"20px"}>Connecting...</Text>
        </Flex>
      )}
      {/* video controls area */}
      <HStack
        pos={"absolute"}
        bottom={5}
        left={"50%"}
        transform={"auto"}
        translateX={"-50%"}
        gap={3}
      >
        <IconButton
          aria-label="enable or disable mic"
          bg={"rgba(0,0,0,0.5)"}
          _hover={{
            bg: "rgba(0,0,0,1)",
          }}
          rounded={"full"}
          color={"white"}
          fontSize={"20px"}
          p={3}
          h={"auto"}
          onClick={() => handleEvents("audio")}
        >
          {isAudioOn ? <FiMic /> : <FiMicOff />}
          {/* <FiMic /> */}
          {/* <FiMicOff /> */}
        </IconButton>
        <IconButton
          bg={"rgba(0,0,0,0.5)"}
          _hover={{
            bg: "rgba(0,0,0,1)",
          }}
          rounded={"full"}
          color={"white"}
          fontSize={"20px"}
          p={3}
          h={"auto"}
          aria-label="enable or disable video"
          onClick={() => handleEvents("video")}
        >
          {isVideoOn ? <FiVideo /> : <FiVideoOff />}
          {/* <FiVideoOff /> */}
        </IconButton>
        <IconButton
          bg={"rgba(0,0,0,0.5)"}
          _hover={{
            bg: "rgba(0,0,0,1)",
          }}
          rounded={"full"}
          p={3}
          h={"auto"}
          color={"white"}
          fontSize={"20px"}
          aria-label="start or stop screen share"
          onClick={() => handleEvents("screen")}
        >
          {shareScreenStream ? <LuScreenShare /> : <LuScreenShareOff />}
          {/* <LuScreenShare /> */}
          {/* <LuScreenShareOff /> */}
        </IconButton>
        <IconButton
          bg={"rgba(0,0,0,0.5)"}
          _hover={{
            bg: "rgba(0,0,0,1)",
          }}
          rounded={"full"}
          color={"white"}
          fontSize={"20px"}
          p={3}
          h={"auto"}
          aria-label="start or stop recording"
        >
          <BsRecordCircle />
        </IconButton>
        <IconButton
          w={"80px"}
          aria-label="Leave meeting"
          colorScheme="red"
          rounded={"full"}
          fontSize={"20px"}
          onClick={() => {
            handleLeaveRoom();
          }}
        >
          <FiPhone />
        </IconButton>
      </HStack>
    </Flex>
  );
}
