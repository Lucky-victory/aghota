import {
  ChakraProvider,
  theme as chakraTheme,
  extendTheme,
} from "@chakra-ui/react";
import { ReactNode } from "react";
const { Button } = chakraTheme.components;
const theme = extendTheme({
  components: {
    Button: {
      ...Button,
      defaultProps: {
        colorScheme: "teal",
      },
    },
  },
});
export default function AppChakraProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
