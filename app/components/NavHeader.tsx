import { HStack, Heading, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "@chakra-ui/next-js";

export default function NavHeader() {
  const linkStyles = {
    fontSize: "18px",
    color: "gray.600",
    _hover: { color: "teal.400" },
  };
  return (
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
        <ConnectButton />
      </HStack>
    </HStack>
  );
}
