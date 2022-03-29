import { Box, Center, Divider, VStack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../graphql/generated/graphql";

export interface UserListProps {
  users: Partial<User> & { username: string }[];
}

function UserList({ users }: UserListProps): ReactElement {
  const navigate = useNavigate();

  if (!users.length) {
    return <Center>No users found.</Center>;
  }

  return (
    <VStack align="start" divider={<Divider />}>
      {users.map((user) => (
        <Box
          key={user.username}
          w="100%"
          _hover={{ cursor: "pointer" }}
          onClick={() => navigate(`/profile/${user.username}`)}
        >
          {user.username}
        </Box>
      ))}
    </VStack>
  );
}

export default UserList;
