import {
  Box,
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
import { FiSend } from "react-icons/fi";

export type TMessage = {
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: number;
};

// TODO move the chat input to a separate component
export const ChatArea = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const { peerId, role, metadata } = useLocalPeer<{
    displayName: string;
    avatarUrl?: string;
  }>();

  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            text: payload,
            senderId: from,
            senderName: metadata?.displayName as string,
            timestamp: new Date().getTime(),
          },
        ]);
      }
    },
  });
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

  return (
    <Stack h={"full"} p={2} pb={1}>
      <HStack justify={"center"} roundedTop={"20px"} px={4} py={2} bg={"white"}>
        <Heading flex={1} size={"sm"}>
          Room Chat
        </Heading>
        <IconButton variant={"ghost"} rounded={"full"} aria-label="close chat">
          <CgClose />
        </IconButton>
      </HStack>
      <Stack
        gap={1}
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
                bg={"blue.100"}
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
  );
};
