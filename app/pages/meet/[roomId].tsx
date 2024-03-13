import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  ResponsiveValue,
  Badge,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FiChevronRight, FiMicOff, FiUser, FiUsers } from "react-icons/fi";
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
  useActivePeers,
  useLobby,
} from "@huddle01/react/hooks";
import { useEffect, useRef, useState } from "react";
import NewPeerRequest from "@/components/NewPeerRequest";
import RemotePeer from "@/components/RemotePeer";
import LocalPeer from "@/components/LocalPeer";
import { ChatArea } from "@/components/ChatArea";
import { RootState, useAppDispatch } from "../../state/store";
import {
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

  const lobbyPeers = useLobby({
    onLobbyPeersUpdated: (lobbyPeers) => {
      dispatch(updateLobbyPeerIds(lobbyPeers));
    },
  });

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
  const isIdle = state === "idle";

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
  const {
    updateMetadata: updateLocalPeerMetadata,
    role,
    peerId: localPeerId,
  } = useLocalPeer<TPeerMetadata>();
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
      {isIdle && (
        <Box>
          <Button onClick={() => handleJoinRoom(token)}>Join room</Button>
        </Box>
      )}
      {!isIdle && (
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
              <LocalPeer
                {...roomInstance}
                local={{
                  role: role,
                  activePeers,
                  localPeerId: localPeerId as string,
                }}
              />
              {/* participants area */}
              {peerIds?.length > 0 && (
                <HStack h={"150px"} rounded={"30px"} gap={3}>
                  {peerIds.map((peerId) => (
                    <RemotePeer
                      activePeers={activePeers}
                      key={peerId}
                      peerId={peerId}
                    />
                  ))}

                  <IconButton
                    aria-label="show all participants"
                    h={"full"}
                    colorScheme="gray"
                    rounded={"30px"}
                  >
                    <FiChevronRight />
                  </IconButton>
                </HStack>
              )}
            </Flex>

            {/* chat area */}
            <Box
              overflow={"hidden"}
              w={"350px"}
              bg={"gray.100"}
              rounded={"30px"}
            >
              <ChatArea />
            </Box>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
import { GetServerSidePropsContext } from "next";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let token = "";

  const isRoomCreator = ctx.query?.rc == "1";

  let role;
  let permissions;

  if (isRoomCreator) {
    // Room creator
    role = Role.HOST;
    permissions = {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    };
  } else {
    role = Role.LISTENER;
    permissions = {
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    };
  }

  const roomId = ctx.params?.roomId?.toString() || "";
  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY!,
    roomId: roomId as string,
    role,
    permissions,
  });

  token = await accessToken.toJwt();

  return {
    props: { token },
  };
};
