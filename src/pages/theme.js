import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    // useSystemColorMode: false, // Uncomment if you want to disable automatic color mode switching
  },
  fonts: {
    heading: '"Inconsolata", monospace', // Use for headings
    body: '"Inconsolata", monospace', // Use for body text
  },
  fontSizes: {
    xs: "9px",
    sm: "12px",
    md: "18px", // Default font size for body text
    lg: "24px", // Approximately 2x larger than md
    xl: "36px", // Approximately 3x larger than md
    xxl: "48px",
    xxxl: "64px",
    xxxxl: "72px",
  },
  styles: {
    global: (props) => ({
      body: {
        fontSize: "md", // Now using 'lg' size for body text
        color: props.colorMode === "dark" ? "white" : "gray.800",
        // Set the background color based on color mode
        bg: props.colorMode === "dark" ? "#2c5282" : "#4299e1", // Adjust the color code for darker blue as needed
      },
    }),
  },
  components: {
    Heading: {
      baseStyle: {
        fontSize: "md", // Now using 'xl' for all headings by default
        fontWeight: "900",
      },
    },
  },
});

export default theme;
