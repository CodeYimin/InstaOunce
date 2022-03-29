import { Box } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  variant?: "small" | "normal";
}

function Wrapper({ children, variant = "normal" }: WrapperProps): ReactElement {
  return (
    <Box my={8} mx="auto" w={variant === "normal" ? 800 : 400}>
      {children}
    </Box>
  );
}

export default Wrapper;
