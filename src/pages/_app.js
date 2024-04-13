import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Uncomment and ensure Footer is correctly imported

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}

export default MyApp;
