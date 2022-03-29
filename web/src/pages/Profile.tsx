import { Box, Button, HStack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useParams } from "react-router-dom";
import UserListButton from "../components/UserListButton";
import Wrapper from "../components/Wrapper";
import {
  useFollowUserMutation,
  useMeQuery,
  UserByUsernameDocument,
  useUnfollowUserMutation,
  useUserByUsernameQuery,
} from "../graphql/generated/graphql";

interface ProfileProps {}

function Profile({}: ProfileProps): ReactElement {
  const params = useParams<{ username: string }>();

  const { loading: meLoading, data: meData } = useMeQuery();
  const {
    loading: userLoading,
    data: userData,
    error,
  } = useUserByUsernameQuery({
    variables: { username: params.username! },
  });
  const [followUser] = useFollowUserMutation({
    refetchQueries: [UserByUsernameDocument],
  });
  const [unfollowUser] = useUnfollowUserMutation({
    refetchQueries: [UserByUsernameDocument],
  });

  const me = meData?.me;
  const user = userData?.userByUsername;
  const following = user?.followers.some((u) => u.id === me?.id);
  const isMe = me && user && user.id === me.id;

  if (error) {
    return (
      <Wrapper>
        <Box textAlign="center">Error: {error.message}</Box>
      </Wrapper>
    );
  }

  if (userLoading || !user) {
    return <></>;
  }

  return (
    <Wrapper>
      <Box fontSize="2xl">{user.username}</Box>
      <Box fontSize="sm">
        {user.profile?.firstName} {user.profile?.lastName}
      </Box>
      <Box mt="2">{user.profile?.bio}</Box>
      <HStack mt="5" spacing="3">
        <UserListButton
          users={user.followers}
          label={`Followers: ${user.followers.length}`}
        />
        <UserListButton
          users={user.following}
          label={`Following: ${user.following.length}`}
        />
      </HStack>
      {!isMe && (
        <Button
          mt="5"
          onClick={() => {
            if (following) {
              unfollowUser({
                variables: { userId: user.id },
              });
            } else {
              followUser({ variables: { userId: user.id } });
            }
          }}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
    </Wrapper>
  );
}

export default Profile;
