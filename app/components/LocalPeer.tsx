import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  ResponsiveValue,
  Spinner,
  Stack,
  Text,
  Tooltip,
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
import { BsRecordCircle, BsStop, BsStopCircle } from "react-icons/bs";
import {
  FiMic,
  FiMicOff,
  FiPhone,
  FiStopCircle,
  FiUser,
  FiVideo,
  FiVideoOff,
  FiVolume,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { Room } from "@huddle01/web-core";
import { RoomEvents, RoomStates } from "@huddle01/web-core/types";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export interface Props {
  local: Record<string, any>;
  room: Room;
  state: RoomStates;
  joinRoom: (data: { roomId: string; token: string }) => Promise<Room>;
  leaveRoom: () => void;
  closeRoom: () => void;
  kickPeer: (peerId: string) => Promise<void>;
  muteEveryone: () => Promise<void>;
  closeStreamOfLabel: (data: {
    label: string;
    peerIds?: string[] | undefined;
  }) => Promise<void>;
}
export default function LocalPeer(props: Props) {
  const localState = useSelector((state: RootState) => state.local);
  console.log({ localState });

  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Lucky");
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMutedAll, setIsMutedAll] = useState<boolean>(false);

  const isIdle = props.state === "idle";

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
    await props.joinRoom({
      roomId: roomId as string,
      token,
    });
  }

  async function handleControls(
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
          if (isMutedAll) {
            await props.room.updateRoomControls({
              type: "allowProduce",
              value: true,
            });
            setIsMutedAll(false);
          } else {
            await props.muteEveryone();
            setIsMutedAll(true);
          }
        } catch (error) {}
        break;

      default:
        break;
    }
  }

  function handleLeaveRoom() {
    props.leaveRoom();
    router.push("/");
  }

  const controlsBtnStyle = {
    bg: "rgba(0,0,0,0.25)",
    _hover: {
      bg: "rgba(0,0,0,0.71)",
    },
    backdropFilter: "blur(5px)",
    rounded: "full",
    color: "white",
    fontSize: "20px",
    p: 3,
    h: "auto",
    isDisabled: isIdle,
  };
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
      {props.state === "connected" && (
        <>
          <HStack justify={"space-between"}>
            <Box
              rounded={"full"}
              px={3}
              py={1}
              bg={"whiteAlpha.400"}
              backdropFilter={"auto"}
              backdropBlur={"5px"}
            >
              <Text as={"span"} fontWeight={500}>
                You
              </Text>
            </Box>
            <Box
              rounded={"full"}
              px={3}
              py={1}
              bg={"whiteAlpha.400"}
              backdropFilter={"auto"}
              backdropBlur={"5px"}
            >
              <FiStopCircle color="red" />
              <Text as={"span"}>Recording...</Text>
            </Box>
          </HStack>
          {shareScreenStream && videoStream && (
            <Box
              w={"250px"}
              zIndex={3}
              h={"150px"}
              rounded={"lg"}
              pos={"absolute"}
              overflow={"hidden"}
              top={2}
              left={2}
            >
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
          {!(isVideoOn && shareScreenStream) && (
            <Stack flex={1} align={"center"} justify={"center"} h={"full"}>
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
      {isIdle && (
        <Flex
          pos={"fixed"}
          top={0}
          left={0}
          gap={5}
          backdropBlur={"15px"}
          backdropFilter={"auto"}
          bg={"blackAlpha.600"}
          w={"full"}
          h={"full"}
          zIndex={100}
          justify={"center"}
          align={"center"}
        >
          <Spinner
            thickness="4px"
            speed="0.75s"
            emptyColor="gray.200"
            color="gray.600"
            size="xl"
          />
          <Text fontSize={"20px"}>Waiting...</Text>
        </Flex>
      )}
      {props.state == "connecting" && (
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
          aria-label={`${isAudioOn ? "disable" : "enable"} mic`}
          {...controlsBtnStyle}
          onClick={() => handleControls("audio")}
        >
          {isAudioOn ? <FiMic /> : <FiMicOff />}
          {/* <FiMic /> */}
          {/* <FiMicOff /> */}
        </IconButton>
        <IconButton
          {...controlsBtnStyle}
          aria-label={`${isVideoOn ? "disable" : "enable"} video`}
          onClick={() => handleControls("video")}
        >
          {isVideoOn ? <FiVideo /> : <FiVideoOff />}
          {/* <FiVideoOff /> */}
        </IconButton>
        <IconButton
          {...controlsBtnStyle}
          aria-label={`${shareScreenStream ? "stop" : "start"} screen share`}
          onClick={() => handleControls("screen")}
        >
          {shareScreenStream ? <LuScreenShare /> : <LuScreenShareOff />}
          {/* <LuScreenShare /> */}
          {/* <LuScreenShareOff /> */}
        </IconButton>
        {props.local.role === "host" && (
          <IconButton
            onClick={() => handleControls("record")}
            {...controlsBtnStyle}
            aria-label={`${isRecording ? "stop" : "start"} recording`}
          >
            {isRecording ? <BsStopCircle color="red" /> : <BsRecordCircle />}
          </IconButton>
        )}

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
