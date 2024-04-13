import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Uncomment and ensure Footer is correctly imported
import { XRPLEVMProvider } from "@/contexts/XRPL_EVM_context";
function MyApp({ Component, pageProps }) {
  return (
    <XRPLEVMProvider>
      <ChakraProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </XRPLEVMProvider>
  );
}

export default MyApp;
