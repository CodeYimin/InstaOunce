import { Center } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useMeQuery } from "../graphql/generated/graphql";

interface HomeProps {}

function Home({}: HomeProps): ReactElement {
  const { loading, data, error } = useMeQuery();

  return <Center fontSize="5xl">Welcome {data?.me?.username}</Center>;
}

export default Home;
