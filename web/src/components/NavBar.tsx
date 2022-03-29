import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "../graphql/generated/graphql";

interface NavBarProps {}

function NavBar({}: NavBarProps): ReactElement {
  const navigate = useNavigate();
  const { loading, data } = useMeQuery();
  const [logout] = useLogoutMutation();
  const bgColor = useColorModeValue("white", "gray.900");

  const me = data?.me;

  const profileMenu = (
    <Menu>
      <MenuButton>
        <HStack>
          <Text fontSize="lg">{me?.username}</Text> <FiChevronDown />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate(`/profile/${me?.username}`)}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate("/updateProfile")}>
          Update Profile
        </MenuItem>
        <MenuItem
          onClick={async () => {
            await logout();
            navigate(0);
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const loginRegisterStack = (
    <HStack spacing="3">
      <Button variant="link" onClick={() => navigate("/login")}>
        Sign in
      </Button>
      <Button color="orange" onClick={() => navigate("/register")}>
        Sign up
      </Button>
    </HStack>
  );

  return (
    <HStack h="14" bg={bgColor}>
      <Box ml="auto" mr="5">
        {me ? profileMenu : loginRegisterStack}
      </Box>
    </HStack>
  );
}

export default NavBar;
