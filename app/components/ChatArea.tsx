import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import { Room } from "@huddle01/web-core";
import { TPeerMetadata } from "@/pages/meet/[roomId]";
import { BsChatDots } from "react-icons/bs";
export type TMessage = {
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: number;
};

// TODO move the chat input to a separate component
export const ChatArea = ({
  room,
  onMinimized,
}: {
  room: Room;
  onMinimized: (isMinimized: boolean) => void;
}) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const {
    peerId,
    role,
    metadata: localPeerMetadata,
  } = useLocalPeer<TPeerMetadata>();
  // room.peerIds
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            text: payload,
            senderId: from,
            senderName: getPeerMetadata(from)?.displayName as string,
            timestamp: new Date().getTime(),
          },
        ]);
      }
    },
  });
  function getPeerMetadata(peerId: string) {
    if (isLocalPeer(peerId)) {
      return localPeerMetadata;
    } else {
      return room.remotePeerExists(peerId)?.getMetadata<TPeerMetadata>();
    }
  }
  function handleInputChange(evt: ChangeEvent<HTMLInputElement>) {
    setText(evt.target.value);
  }
  const sendMessage = () => {
    sendData({
      to: "*",
      payload: text,
      label: "chat",
    });
    setText("");
  };
  function isLocalPeer(senderId: string): boolean {
    return peerId === senderId;
  }
  function handleInputKeyUp(evt: KeyboardEvent<HTMLInputElement>): void {
    if (evt.key === "Enter" && !evt.shiftKey) {
      sendMessage();
    }
  }
  function formatMessageTime(time: number): string {
    let label = "";
    const distance = formatDistanceToNowStrict(new Date(time));
    const splitDistance = distance.split(" ");
    const distanceTime = splitDistance[0];
    const distanceLabel = splitDistance[1];

    switch (distanceLabel) {
      case "seconds":
        label = "s";
        break;
      case "minutes":
      case "minute":
        label = "m";
        break;
      case "hours":
      case "hour":
        label = "h";
        break;
      case "days":
      case "day":
        label = "d";
        break;

      default:
        break;
    }
    return `${distanceTime}${label}`;
  }
  useEffect(() => {
    if (messages.length) {
      scrollToBottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages.length]);
  function handleChatAreaMinimize() {
    const _isMinimized = !isMinimized;
    setIsMinimized(_isMinimized);
    onMinimized?.(_isMinimized);
  }
  const btnStyles = isMinimized ? { translateY: "0" } : { translateY: "100vh" };
  return (
    <>
      <Button
        colorScheme="teal"
        size={"lg"}
        rounded={"full"}
        shadow={"lg"}
        right={4}
        bottom={4}
        zIndex={999}
        onClick={handleChatAreaMinimize}
        {...btnStyles}
        transition={"0.5s ease-in-out"}
        transform={"auto"}
        pos={"absolute"}
        gap={2}
      >
        <FiMessageCircle />
        Live Chat
      </Button>
      <Box
        zIndex={993}
        border={"1px"}
        borderColor={"gray.300"}
        overflow={"hidden"}
        pos={"absolute"}
        right={3}
        bottom={2}
        minW={"calc(var(--chat-area-width) - 12px)"}
        maxW={"350px"}
        top={2}
        // h={"full"}
        bg={"gray.100"}
        rounded={"30px"}
        transition={"0.5s ease-in-out"}
        transform={"auto"}
        {...(isMinimized ? { translateX: "200%" } : { translateX: 0 })}

        // translateX={200}
      >
        <Stack h={"full"} p={2} pb={1}>
          <HStack
            justify={"center"}
            roundedTop={"20px"}
            px={4}
            py={2}
            bg={"white"}
          >
            <Heading flex={1} size={"sm"}>
              Room Chat
            </Heading>
            <IconButton
              onClick={handleChatAreaMinimize}
              variant={"ghost"}
              zIndex={3}
              rounded={"full"}
              aria-label="close chat"
            >
              <CgClose />
            </IconButton>
          </HStack>
          <Stack
            gap={0}
            flex={1}
            px={1}
            // bg={"white"}
            py={2}
            maxH={500}
            overflowY={"auto"}
          >
            {messages.map((message, i) => {
              return isLocalPeer(message.senderId) ? (
                <Stack
                  gap={1}
                  key={"chat" + i}
                  alignSelf={"flex-end"}
                  p={1}
                  maxW={"280px"}
                >
                  <HStack
                    gap={1}
                    align={"flex-start"}
                    fontSize={"12px"}
                    justify={"space-between"}
                  >
                    <Text as={"span"} fontWeight={500}>
                      {message?.senderName} (You)
                    </Text>
                    <Text as={"span"} flexShrink={0}>
                      {formatMessageTime(message.timestamp)} ago
                    </Text>
                  </HStack>
                  <Text
                    py={1}
                    px={3}
                    bg={"teal"}
                    color={"white"}
                    roundedBottomRight={"35px"}
                    roundedLeft={"35px"}
                    shadow={"sm"}
                    fontSize={"15px"}
                  >
                    {message.text}
                  </Text>
                </Stack>
              ) : (
                <Stack
                  key={"chat" + i}
                  // shadow={"sm"}
                  alignSelf={"flex-start"}
                  p={1}
                  maxW={"280px"}
                >
                  <HStack
                    align={"flex-start"}
                    fontSize={"12px"}
                    justify={"space-between"}
                  >
                    <Text as={"span"} fontWeight={500}>
                      {message?.senderName}
                    </Text>
                    <Text as={"span"} flexShrink={0}>
                      {formatMessageTime(message.timestamp)} ago
                    </Text>
                  </HStack>
                  <Text
                    py={1}
                    px={3}
                    bg={"white"}
                    roundedBottomLeft={"35px"}
                    roundedRight={"35px"}
                    shadow={"sm"}
                    fontSize={"15px"}
                  >
                    {message.text}
                  </Text>
                </Stack>
              );
            })}
            <div ref={scrollToBottomRef} />
          </Stack>
          {/* message input area */}
          <Box px={1} py={3}>
            <HStack p={2} bg={"white"} rounded={"full"}>
              <Input
                name="message"
                value={text}
                autoComplete="off"
                onKeyUp={handleInputKeyUp}
                onChange={handleInputChange}
                _focus={{ boxShadow: "0 0 0 1px teal", borderColor: "teal" }}
                placeholder="Type a message..."
                fontWeight={500}
                colorScheme="teal"
                rounded={"full"}
              />
              <IconButton
                isDisabled={text === ""}
                onClick={sendMessage}
                rounded={"full"}
                colorScheme="teal"
                aria-label="send message"
              >
                <FiSend />
              </IconButton>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
