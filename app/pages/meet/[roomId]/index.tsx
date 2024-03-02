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
  Tabs,
  Text,
} from "@chakra-ui/react";
import { BsRecordCircle } from "react-icons/bs";
import {
  FiCast,
  FiCheck,
  FiChevronRight,
  FiMic,
  FiMicOff,
  FiPhone,
  FiSlash,
  FiUser,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
export default function MeetPage() {
  const participantsCardStyle = {
    overflow: "hidden",
    w: 200,
    flex: 1,
    h: "full",
    bg: "gray.200",
    rounded: "20px",
    pos: "relative" as ResponsiveValue<"relative">,
    maxW: 300,
  };

  return (
    <Box as="main" h={"var(--chakra-vh)"} minH={"800px"} bg={"gray.100"} p={3}>
      <Flex direction={"column"} gap={3} h={"full"}>
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
          <Box>
            <HStack
              gap={4}
              bg={"gray.100"}
              px={"10px"}
              py={"6px"}
              rounded={"full"}
            >
              <Text as={"span"}>
                <Text as={"span"} fontWeight={500}>
                  Mary
                </Text>{" "}
                wants to join the meeting
              </Text>
              <HStack>
                <IconButton
                  rounded={"full"}
                  size={"sm"}
                  aria-label="reject"
                  colorScheme="red"
                >
                  <FiSlash size={20} />
                </IconButton>
                <IconButton
                  size={"sm"}
                  colorScheme="green"
                  rounded={"full"}
                  aria-label="accept"
                >
                  <FiCheck size={22} />
                </IconButton>
              </HStack>
            </HStack>
          </Box>
        </HStack>

        <Flex bg={"white"} h={"full"} rounded={"30px"} p={3} gap={4}>
          <Stack flex={1}>
            {/* video area */}
            <Box
              flex={1}
              overflow={"hidden"}
              pos={"relative"}
              rounded={"30px"}
              w={"full"}
              bg={"gray.300"}
            >
              <Box
                as="video"
                muted
                autoPlay
                h={"full"}
                w={"full"}
                left={0}
                // aspectRatio={"16:9"}
                objectFit={"cover"}
                top={0}
                pos={"absolute"}
                src="https://vod-progressive.akamaized.net/exp=1709412422~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2330%2F20%2F511650154%2F2362955544.mp4~hmac=166aa8d355f5f5190fb59065837c647ec17800e466fc3c766ec980434d67da4a/vimeo-prod-skyfire-std-us/01/2330/20/511650154/2362955544.mp4"
              ></Box>

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
                >
                  {/* <FiMic /> */}
                  <FiMicOff />
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
                  aria-label="enable or disable camera"
                >
                  {/* <FiVideo /> */}
                  <FiVideoOff />
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
                >
                  <LuScreenShare />
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
                >
                  <FiPhone />
                </IconButton>
              </HStack>
            </Box>

            {/* participants area */}
            <HStack h={"150px"} rounded={"30px"} gap={3}>
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
          </Stack>

          {/* chat area */}
          <Box overflow={"hidden"} w={"350px"} bg={"gray.100"} rounded={"30px"}>
            <ChatArea />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export const ChatArea = () => {
  return (
    <Stack gap={4} h={"full"}>
      <Box roundedTop={"20px"} p={4} bg={"gray.700"}>
        <Heading size={"sm"} color={"white"} textAlign={"center"}>
          Room Chat
        </Heading>
      </Box>
      <Stack bg={"gray.200"} gap={3} flex={1} px={3} py={2}>
        {/* chat by you */}
        <Stack
          bg={"white"}
          alignSelf={"flex-end"}
          p={3}
          maxW={"280px"}
          roundedBottomRight={"25px"}
          roundedLeft={"25px"}
        >
          <HStack fontSize={"14px"} justify={"space-between"}>
            <Text as={"span"} fontWeight={500}>
              You
            </Text>
            <Text as={"span"}>10:30 am</Text>
          </HStack>
          <Text fontSize={"14px"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem, quia.
          </Text>
        </Stack>
        {/* chat from others*/}
        <Stack
          bg={"white"}
          alignSelf={"flex-start"}
          p={3}
          maxW={"280px"}
          roundedBottomLeft={"25px"}
          roundedRight={"25px"}
        >
          <HStack fontSize={"14px"} justify={"space-between"}>
            <Text as={"span"} fontWeight={500}>
              Mary Ekene
            </Text>
            <Text as={"span"}>10:30 am</Text>
          </HStack>
          <Text fontSize={"14px"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem, quia.
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
export function GenIcon() {
  return <Box></Box>;
}
