import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import AppChakraProvider from "../providers/chakra";
import { Provider } from "react-redux";
import store from "@/state/store";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { fonts } from "@/fonts";

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Aghota",
});
const config = getDefaultConfig({
  appName: "Aghota",
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();
const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
  options: {
    // `activeSpeakers` will be most active `n` number of peers, by default it's 8
    activeSpeakers: {
      size: 8,
    },
  },
});
export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-raleway: ${fonts.raleway.style.fontFamily};
          }
        `}
      </style>
      <WagmiProvider config={config}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider>
                <Provider store={store}>
                  <HuddleProvider client={huddleClient}>
                    <AppChakraProvider>
                      <Component {...pageProps} />;
                    </AppChakraProvider>
                  </HuddleProvider>
                </Provider>
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
    </>
  );
}
