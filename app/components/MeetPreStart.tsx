// import { Box, Button, Heading, Input, Stack } from "@chakra-ui/react";

// export default function MeetPreStart() {
//   return (
//     <Box>
//       <Stack
//         gap={4}
//         minW={300}
//         shadow={"md"}
//         mx={"auto"}
//         alignSelf={"center"}
//         py={8}
//         px={6}
//         rounded={"md"}
//       >
//         <Box>
//           <Heading mb={2} size={"sm"} fontWeight={500}>
//             Enter your name:
//           </Heading>
//           <Input
//             onKeyUp={async (e: KeyboardEvent) => {
//               if (e.key == "Enter") await handleCreateNewToken();
//             }}
//             colorScheme="teal"
//             placeholder="John doe"
//             value={displayName}
//             onChange={(e) => setDisplayName(e.target.value)}
//           />
//         </Box>
//         <Button
//           isDisabled={!displayName || displayName.length < 2}
//           isLoading={isJoining}
//           onClick={async () => await handleCreateNewToken()}
//           colorScheme="teal"
//         >
//           {meetingCreator.isCreator ? "Start Meeting" : "Ask to Join"}
//         </Button>
//       </Stack>
//     </Box>
//   );
// }
