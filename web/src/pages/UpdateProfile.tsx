import { Button, useToast, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { ReactElement } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  useMeProfileQuery,
  useUpdateProfileMutation,
} from "../graphql/generated/graphql";

interface UpdateProfileProps {}

function UpdateProfile({}: UpdateProfileProps): ReactElement {
  const { loading, data, error } = useMeProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const toast = useToast();

  const profile = data?.me?.profile;

  if (loading) {
    return <></>;
  }

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          avatar: profile?.avatar || "",
          bio: profile?.bio || "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await updateProfile({ variables: { data: values } });
          const errors = response.errors;

          if (errors) {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Profile updated",
              description: "Your profile has been updated",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={6}>
              <InputField
                name="firstName"
                label="First name"
                placeholder="First name"
              />
              <InputField
                name="lastName"
                label="Last name"
                placeholder="Last name"
              />
              <InputField name="bio" label="Bio" placeholder="Bio" />
              <InputField
                name="avatar"
                label="Avatar"
                placeholder="Avatar url"
              />
              <Button type="submit" isLoading={isSubmitting} color="teal">
                Update Profile
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default UpdateProfile;
