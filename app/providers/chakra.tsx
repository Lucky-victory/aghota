import { ChakraProvider, theme } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function AppChakraProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
