import { ReactElement } from "react";
import styled from "styled-components";

interface PostProps {
  username: string;
  content: string;
}

export default function Post({ username, content }: PostProps): ReactElement {
  return (
    <Container>
      <div>{content}</div>
    </Container>
  );
}

const Container = styled.div`
  border: 0.1rem solid;
  padding: 1rem;
  margin: 5rem 0;
`;
