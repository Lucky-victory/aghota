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
  useRemotePeer,
  useLobby,
} from "@huddle01/react/hooks";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NewPeerRequest from "@/components/NewPeerRequest";
import RemotePeer from "@/components/RemotePeer";
import LocalPeer from "@/components/LocalPeer";
import { ChatArea } from "@/components/ChatArea";
import isEmpty from "just-is-empty";
import { RootState, useAppDispatch } from "../../state/store";
import {
  updateLobbyPeer,
  updateLobbyPeerIds,
  updateRemotePeer,
  updateRemotePeerIds,
} from "@/state/slices";
import { useSelector } from "react-redux";

export type TPeerMetadata = {
  displayName: string;
};
interface Props {
  token: string;
}
export default function MeetPage({ token }: Props) {
  const dispatch = useAppDispatch();
  const remotePeersInState = useSelector(
    (state: RootState) => state.remote.peerIds
  );
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
  let roomToken = "";
  if (typeof window !== "undefined") {
    roomToken = window.localStorage.getItem("roomToken") as string;
  }
  const lobbyPeers = useLobby({
    onLobbyPeersUpdated: (lobbyPeers) => {
      dispatch(updateLobbyPeerIds(lobbyPeers));
    },
  });
  console.log({ lobbyPeers, token });

  const activePeers = useActivePeers();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Lucky");
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [lobbyPeersIds, setLobbyPeersIds] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const roomInstance = useRoom({
    onFailed(data) {
      console.log("Failed to join room", data);
    },
    onJoin: (data) => {
      // data.room
      console.log("onRoomJoin", data);
      console.log({ roomLocked: room.config, room: room });
      updateLocalPeerMetadata({ displayName });
    },
    onWaiting(data) {
      setLobbyPeersIds(room.lobbyPeerIds);
      console.log({ data, wait: room.lobbyPeerIds }, "on waiting");
    },
    onPeerJoin: (peerId) => {
      dispatch(
        updateRemotePeer({
          peerId,
          metadata: { displayName: "Mike" },
        })
      );
      dispatch(updateRemotePeerIds([...remotePeersInState, peerId]));
      console.log("onPeerJoin", peerId);
    },
  });

  const { joinRoom, state, room, muteEveryone, leaveRoom } = roomInstance;

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
  const { updateMetadata: updateLocalPeerMetadata, role } =
    useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();
  const roomId = router.query.roomId as string;
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
  //     if (!isEmpty(roomToken) && roomId) {
  //       await joinRoom({
  //         roomId: roomId as string,
  //         token: roomToken,
  //       });
  //     }
  //   };
  //   fetcher();
  // }, [roomId, roomToken]);

  async function handleCreateNewToken() {
    console.log("handleCreateNewMeeting");
    try {
      const response = await axios.post(
        `/api/create-user-token?roomId=${roomId}`,
        {
          displayName: "Mark Emy",
        }
      );
      const data = response.data;

      setDisplayName(data?.metadata?.displayName);
      await handleJoinRoom(data?.token);
    } catch (error) {}
  }

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
    <Flex as="main" minH={"var(--chakra-vh)"} bg={"gray.100"} p={2}>
      {
        <Box>
          <Button onClick={() => handleJoinRoom(token)}>Join room</Button>
        </Box>
      }
      <Flex direction={"column"} gap={2} flex={1} minH={"full"}>
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

              <FiUsers />
            </Button>
            {lobbyPeers.lobbyPeersIds.length > 0 && (
              <NewPeerRequest room={room} peerId={""} />
            )}
          </HStack>
        </HStack>

        <Flex h={"full"} bg={"white"} rounded={"30px"} p={2} gap={3}>
          {/* video area */}
          <Flex flexDir={"column"} gap={3} flex={1} minH={"full"}>
            <LocalPeer {...roomInstance} local={{ role: role }} />
            {/* participants area */}
            <HStack h={"150px"} rounded={"30px"} gap={3}>
              {peerIds?.length > 0 &&
                peerIds.map((peerId) => (
                  <RemotePeer key={peerId} peerId={peerId} />
                ))}

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
import { GetServerSidePropsContext } from "next";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let token = "";

  const roomId = ctx.params?.roomId?.toString();
  const { data } = await axios.post(
    "/api/create-admin-token",
    {
      metadata: { displayName: "Vick" },
    },
    { params: { roomId } }
  );
  token = data?.token;
  console.log({ token, data });

  return {
    props: { token },
  };
};
