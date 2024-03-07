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

  const { peerId } = useLocalPeer();
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
    <Stack h={"full"}>
      <HStack justify={"center"} roundedTop={"20px"} p={2} bg={"gray.700"}>
        <Heading flex={1} size={"sm"} color={"white"} textAlign={"center"}>
          Room Chat
        </Heading>
        <IconButton
          color={"white"}
          _hover={{ bg: "gray.600" }}
          variant={"ghost"}
          rounded={"full"}
          aria-label="close chat"
        >
          <CgClose />
        </IconButton>
      </HStack>
      <Stack gap={3} flex={1} px={3} py={2} maxH={500} overflowY={"auto"}>
        {messages.map((message, i) => {
          return isLocalPeer(message.sender) ? (
            <Stack
              key={"chat" + i}
              bg={"blue.50"}
              shadow={"sm"}
              alignSelf={"flex-end"}
              p={3}
              maxW={"280px"}
              roundedBottomRight={"25px"}
              roundedLeft={"25px"}
            >
              <HStack
                align={"flex-start"}
                fontSize={"14px"}
                justify={"space-between"}
              >
                <Text as={"span"} fontWeight={500}>
                  You
                </Text>
                <Text as={"span"} flexShrink={0}>
                  {format(message.timestamp, "hh:mm aaa")}
                </Text>
              </HStack>
              <Text fontSize={"14px"}>{message.text}</Text>
            </Stack>
          ) : (
            <Stack
              bg={"white"}
              // shadow={"sm"}
              alignSelf={"flex-start"}
              p={3}
              maxW={"280px"}
              roundedBottomLeft={"25px"}
              roundedRight={"25px"}
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
              <Text fontSize={"14px"}>{message.text}</Text>
            </Stack>
          );
        })}
        <div ref={scrollToBottomRef} />
      </Stack>
      {/* message input area */}
      <Box px={2} py={3}>
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
