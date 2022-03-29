import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ReactElement } from "react";
import ToggleButton from "./ToggleButton";
import UserList, { UserListProps } from "./UserList";

type UserListButtonProps = UserListProps & {
  label: string;
};

function UserListButton({
  label,
  ...userListProps
}: UserListButtonProps): ReactElement {
  return (
    <ToggleButton variant="ghost" fontWeight="normal" label={label}>
      {({ isOpen, onClose }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <UserList {...userListProps} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </ToggleButton>
  );
}

export default UserListButton;
