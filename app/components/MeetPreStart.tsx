import { Box, Button, Stack } from "@chakra-ui/react";
import {
  useDevices,
  useLocalAudio,
  useLocalVideo,
} from "@huddle01/react/hooks";

export default function MeetPreStart() {
  return (
    <Box>
      <Stack>
        <Button colorScheme="teal" rounded={"full"} size={"lg"}>
          Ask to join
        </Button>
      </Stack>
    </Box>
  );
}
