import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsRecord } from "react-icons/bs";
import {
  FiCamera,
  FiCameraOff,
  FiCast,
  FiCheck,
  FiChevronRight,
  FiMic,
  FiMicOff,
  FiPhone,
  FiSlash,
  FiThumbsDown,
  FiThumbsUp,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";
export default function MeetPage() {
  const participantsCardStyle = {
    w: 200,
    flex: 1,
    h: "full",
    bg: "gray.100",
    rounded: "20px",
    maxW: 300,
  };
  const videoControlsStyle = {
    color: "white",
    size: 20,
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
                // opacity={0}
                muted
                autoPlay
                h={"full"}
                w={"full"}
                left={0}
                top={0}
                pos={"absolute"}
              >
                <source src="https://youtu.be/3L-8UKhwJ04" type="video/mp4" />
              </Box>

              {/* video controls area */}
              <HStack>
                <IconButton
                  aria-label="enable or disable mic"
                  bg={"rgba(0,0,0,0.3)"}
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
                  bg={"rgba(0,0,0,0.3)"}
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
                  bg={"rgba(0,0,0,0.3)"}
                  rounded={"full"}
                  p={3}
                  h={"auto"}
                  color={"white"}
                  fontSize={"20px"}
                  aria-label="start or stop recording"
                >
                  <FiCast />
                </IconButton>
                <IconButton
                  bg={"rgba(0,0,0,0.3)"}
                  rounded={"full"}
                  color={"white"}
                  fontSize={"20px"}
                  p={3}
                  h={"auto"}
                  aria-label="start or stop sharing screen"
                >
                  <BsRecord />
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
            <HStack h={"150px"} rounded={"30px"} gap={3} p={2}>
              <Box {...participantsCardStyle}></Box>
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
          <Box w={"300px"} bg={"gray.200"} rounded={"30px"}></Box>
        </Flex>
      </Flex>
    </Box>
  );
}
