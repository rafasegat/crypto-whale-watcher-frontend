import type { AppProps } from "next/app";
import "../src/assets/styles/globals.scss";
import "../src/components/Icons/BaseIcon.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
