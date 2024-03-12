import { RootState } from "@/state/store";
import { Box, Flex, IconButton, ResponsiveValue } from "@chakra-ui/react";
import {
  useRemoteAudio,
  useRemoteScreenShare,
  useRemoteVideo,
} from "@huddle01/react/hooks";
import React, { useEffect, useRef } from "react";
import { FiMicOff } from "react-icons/fi";
import { useSelector } from "react-redux";

type Props = {
  peerId: string;
};

const RemotePeer = ({ peerId }: Props) => {
  const { stream, state } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  const remoteState = useSelector((state: RootState) => state.remote);
  console.log({ remoteState });

  const { videoStream: screenVideo, audioStream: screenAudio } =
    useRemoteScreenShare({ peerId });
  const vidRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);
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
  useEffect(() => {
    if (stream && vidRef.current && state === "playable") {
      vidRef.current.srcObject = stream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          vidRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      vidRef.current.onerror = () => {
        console.error("videoCard() | Error is happening...");
      };
    }
  }, [stream]);

  useEffect(() => {
    if (audioStream && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = audioStream;

      audioRef.current.onloadedmetadata = async () => {
        try {
          audioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      audioRef.current.onerror = () => {
        console.error("videoCard() | Error is happening...");
      };
    }
  }, [audioStream]);

  useEffect(() => {
    if (screenVideo && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenVideo;

      screenVideoRef.current.onloadedmetadata = async () => {
        try {
          screenVideoRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      screenVideoRef.current.onerror = () => {
        console.error("videoCard() | Error is happening...");
      };
    }
  }, [screenVideo]);

  useEffect(() => {
    if (screenAudio && screenAudioRef.current) {
      screenAudioRef.current.srcObject = screenAudio;

      screenAudioRef.current.onloadedmetadata = async () => {
        try {
          screenAudioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      screenAudioRef.current.onerror = () => {
        console.error("videoCard() | Error is happening...");
      };
    }
  }, [screenAudio]);

  return (
    <Box {...participantsCardStyle}>
      <IconButton
        zIndex={10}
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
      <Box
        as="video"
        muted
        autoPlay
        ref={vidRef}
        h={"full"}
        w={"full"}
        left={0}
        // aspectRatio={"16:9"}
        objectFit={"contain"}
        top={0}
        pos={"absolute"}
      ></Box>
      {screenVideo && (
        <Box
          as="video"
          muted
          autoPlay
          ref={screenVideoRef}
          h={"full"}
          w={"full"}
          left={0}
          // aspectRatio={"16:9"}
          objectFit={"contain"}
          top={0}
          pos={"absolute"}
        ></Box>
      )}
      <audio ref={audioRef} autoPlay></audio>
      {screenAudio && <audio ref={screenAudioRef} autoPlay></audio>}
    </Box>
  );
};

export default React.memo(RemotePeer);
