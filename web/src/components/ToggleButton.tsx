import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { ReactElement } from "react";

export type ToggleButtonProps = ButtonProps & {
  children: (data: { isOpen: boolean; onClose: () => void }) => ReactElement;
  label: string;
};

function ToggleButton({
  children,
  label,
  ...props
}: ToggleButtonProps): ReactElement {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      <Button
        {...props}
        onClick={(event) => {
          props.onClick && props.onClick(event);
          onToggle();
        }}
      >
        {label}
      </Button>
      {children({ isOpen, onClose })}
    </>
  );
}

export default ToggleButton;
