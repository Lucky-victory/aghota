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
  Input,
  Stack,
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
  useRemotePeer,
} from "@huddle01/react/hooks";
import { useEffect, useRef, useState } from "react";
import NewPeerRequest from "@/components/NewPeerRequest";
import RemotePeer from "@/components/RemotePeer";
import LocalPeer from "@/components/LocalPeer";
import { ChatArea } from "@/components/ChatArea";
import { RootState, useAppDispatch } from "../../state/store";
import isEmpty from "just-is-empty";
import {
  updateLobbyPeerIds,
  updateRemotePeer,
  updateRemotePeerIds,
} from "@/state/slices";
import { useSelector } from "react-redux";

export type TPeerMetadata = {
  displayName: string;
  avatarUrl?: string;
};
interface Props {
  token: string;
}
export default function MeetPage({ token }: Props) {
  const dispatch = useAppDispatch();
  const remotePeersInState = useSelector(
    (state: RootState) => state.remote.peerIds
  );
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
  const [isJoining, setIsJoining] = useState<boolean>(false);

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
      setLobbyPeersIds(room.lobbyPeerIds);
    },
    onPeerJoin: (peerId) => {
      dispatch(
        updateRemotePeer({
          peerId,
          metadata: { displayName: displayName },
        })
      );
      dispatch(updateRemotePeerIds([...remotePeersInState, peerId]));
      console.log("onPeerJoin", peerId);
    },
  });

  const { joinRoom, state, room, muteEveryone, leaveRoom } = roomInstance;
  console.log({ roomMeta: room.getMetadata() });
  const isIdle = state === "idle";
  const { roomId } = router.query;

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
      {!isIdle && (
        <Flex direction={"column"} gap={2} flex={1} minH={"full"}>
          <MeetingHeader room={room} />
          <Flex h={"full"} bg={"white"} rounded={"30px"} p={2} gap={3}>
            {/* video area */}
            <Flex flexDir={"column"} gap={3} flex={1} minH={"full"}>
              <LocalPeer
                {...roomInstance}
                local={{
                  displayName: displayName,
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

            <ChatArea room={room} />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
import { GetServerSidePropsContext } from "next";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import MeetingHeader from "@/components/MeetingHeader";
import { meetingCreator } from "../../state/slices";

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
    options: { metadata: { displayName: "mike" } },
    role,
    permissions,
  });

  token = await accessToken.toJwt();

  return {
    props: { token },
  };
};
