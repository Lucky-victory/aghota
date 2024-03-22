import {
  Box,
  Button,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "@chakra-ui/next-js";
import {
  useLogin,
  useLogout,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { maskWalletAddress } from "@/utils";
import { BiChevronDown } from "react-icons/bi";
import BoringAvatars from "boring-avatars";
import { FiLogOut } from "react-icons/fi";
import { LuChevronDown } from "react-icons/lu";
export default function NavHeader() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { authenticated, ready, login, logout, user } = usePrivy();
  console.log({ user });

  const { ready: walletReady, wallets } = useWallets();
  const linkStyles = {
    fontSize: "18px",
    color: "gray.600",
    _hover: { color: "teal.400" },
  };
  function disconnect() {
    logout();
    onClose();
  }
  return (
    <>
      <HStack
        borderBottom={"1px"}
        borderBottomColor={"gray.200"}
        justify={"space-between"}
        pt={4}
        py={3}
        px={5}
      >
        <Link href="/" textDecor={"none!important"}>
          <Heading as="h1" size="xl" color={"teal"}>
            Aghota
          </Heading>
        </Link>
        <HStack fontWeight={"500"} gap={4}>
          <Link href="#" {...linkStyles} textDecor={"none!important"}>
            <Text>About</Text>
          </Link>
          <Link href="#" {...linkStyles} textDecor={"none!important"}>
            Pricing
          </Link>
        </HStack>
        <HStack>
          {" "}
          {ready && !authenticated && (
            <Button shadow={"md"} rounded={"lg"} onClick={() => login()}>
              Connect wallet
            </Button>
          )}
          <Box>
            {authenticated && walletReady && (
              <Button
                gap={2}
                onClick={() => onOpen()}
                variant={"outline"}
                rounded={"lg"}
                shadow={"md"}
                colorScheme={"gray"}
                fontWeight={700}
              >
                <BoringAvatars variant="beam" size={24} />
                {maskWalletAddress(wallets[0]?.address, 5)}
                <LuChevronDown size={24} />{" "}
              </Button>
            )}
          </Box>
        </HStack>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody py={12}>
            <Stack align={"center"} gap={5}>
              <HStack gap={2} fontWeight={700} fontSize={"20px"}>
                <BoringAvatars variant="beam" />
                <Text as={"span"}>
                  {maskWalletAddress(wallets[0]?.address, 5)}
                </Text>
              </HStack>
              <Button
                colorScheme="gray"
                gap={3}
                rounded={"lg"}
                variant={"outline"}
                onClick={() => disconnect()}
              >
                <FiLogOut /> Disconnect
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
