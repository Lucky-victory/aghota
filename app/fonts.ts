import { Raleway, Sigmar_One } from "next/font/google";
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
});

export const fonts = {
  raleway,
};
