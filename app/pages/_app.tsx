import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HuddleClient, HuddleProvider } from "@huddle01/react";

const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
  options: {
    // `activeSpeakers` will be most active `n` number of peers, by default it's 8
    activeSpeakers: {
      size: 8,
    },
  },
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <HuddleProvider client={huddleClient}>
      <Component {...pageProps} />;
    </HuddleProvider>
  );
}
