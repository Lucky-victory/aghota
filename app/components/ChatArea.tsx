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
import { format } from "date-fns";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiSend } from "react-icons/fi";

export type TMessage = {
  text: string;
  sender: string;
  timestamp: number;
};
export const ChatArea = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const { peerId, role, metadata } = useLocalPeer();
  console.log({ peerId, role, metadata });

  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [
          ...prev,
          { text: payload, sender: from, timestamp: new Date().getTime() },
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
      <Stack gap={3} flex={1} px={1} py={2} maxH={500} overflowY={"auto"}>
        {messages.map((message, i) => {
          return isLocalPeer(message.sender) ? (
            <Stack
              gap={1}
              key={"chat" + i}
              alignSelf={"flex-end"}
              p={3}
              maxW={"280px"}
            >
              <HStack
                gap={1}
                align={"flex-start"}
                fontSize={"13px"}
                justify={"space-between"}
              >
                <Text as={"span"} fontWeight={500}>
                  You
                </Text>
                <Text as={"span"} flexShrink={0}>
                  {format(message.timestamp, "hh:mm aaa")}
                </Text>
              </HStack>
              <Text
                py={1}
                px={3}
                bg={"blue.50"}
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
              // shadow={"sm"}
              alignSelf={"flex-start"}
              p={2}
              maxW={"280px"}
            >
              <HStack
                align={"flex-start"}
                fontSize={"14px"}
                justify={"space-between"}
              >
                <Text as={"span"} fontWeight={500}>
                  {message.sender}
                </Text>
                <Text as={"span"} flexShrink={0}>
                  {format(message.timestamp, "hh:mm aaa")}
                </Text>
              </HStack>
              <Text
                py={1}
                px={3}
                bg={"blue.50"}
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
