import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiClipboard, FiUserPlus, FiUsers } from "react-icons/fi";
import NewPeerRequest from "./NewPeerRequest";
import { Room } from "@huddle01/web-core";
import { useLobby } from "@huddle01/react/hooks";
import { updateLobbyPeerIds } from "@/state/slices";
import { useAppDispatch } from "@/state/store";
import { useFormik } from "formik";
import {
  LuClipboard,
  LuClipboardCopy,
  LuCopy,
  LuUsers,
  LuUsers2,
} from "react-icons/lu";
export default function MeetingHeader({ room }: { room: Room }) {
  const dispatch = useAppDispatch();
  const lobbyPeers = useLobby({
    onLobbyPeersUpdated: (lobbyPeers) => {
      dispatch(updateLobbyPeerIds(lobbyPeers));
    },
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <HStack
      justify={"space-between"}
      gap={5}
      bg={"white"}
      rounded={"40px"}
      py={2}
      px={4}
    >
      <Box>
        <Heading size={"md"}>Meeting Title</Heading>
      </Box>
      <HStack px={4} gap={5}>
        <Box zIndex={3999}>
          <Popover>
            <PopoverTrigger>
              <Button
                mr={3}
                colorScheme="teal"
                variant={"ghost"}
                bg={"teal.50"}
                pos={"relative"}
                // rounded={"full"}
                gap={3}
                size={"sm"}
                aria-label="active peers"
              >
                <FiUserPlus />
                <Text>Invite people</Text>
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />

              <PopoverBody py={4} mt={4}>
                <VStack divider={<Divider />} gap={2}>
                  <Button
                    size={"md"}
                    w={"full"}
                    gap={3}
                    colorScheme="teal"
                    variant={"ghost"}
                    bg={"teal.50"}
                  >
                    <LuCopy /> Copy Link
                  </Button>
                  <Stack bg={"gray.50"} p={2} w={"full"}>
                    {/* This code works fine, the ts-ignore is because of the types of Stack(which is a div) and a div doesn't have an onSubmit, but in reality the code renders a form*/}
                    {/* @ts-ignore */}
                    <Stack as={"form"} onSubmit={formik.handleSubmit}>
                      <FormControl>
                        <FormLabel>Invite by email:</FormLabel>

                        <Input
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          colorScheme="teal"
                          _focus={{
                            boxShadow: "0 0 0 1px teal",
                            borderColor: "teal",
                          }}
                          placeholder="Enter email"
                        />
                      </FormControl>
                      <Button type="submit" colorScheme="teal">
                        {" "}
                        Send
                      </Button>
                    </Stack>
                  </Stack>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
        <HStack>
          <HStack>
            <FiUsers />
            <Text fontSize={"13px"} as={"span"}>
              Pending Invites
            </Text>
          </HStack>

          <Badge colorScheme="orange">{lobbyPeers.lobbyPeersIds.length}</Badge>
        </HStack>

        {lobbyPeers.lobbyPeersIds.length > 0 && <NewPeerRequest room={room} />}
      </HStack>
    </HStack>
  );
}
