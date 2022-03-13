import { ReactElement, useRef } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";

export default function CreatePost(): ReactElement {
  const [cookies] = useCookies(["username"]);
  const contentInput = useRef<HTMLDivElement>(null);

  async function handlePostButtonClick(): Promise<void> {
    const postContent = contentInput.current?.innerText;
    if (!postContent) {
      return;
    }

    const postResponse = await fetch("http://localhost:4000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: cookies.username,
        content: postContent,
      }),
    });
    const post = await postResponse.json();
    console.log(post);
    contentInput.current.innerHTML = "";
  }

  return (
    <Container>
      <ExpandingInput ref={contentInput} placeholder="Write a post..." />
      <BottomRow>
        <SubmitButton onClick={handlePostButtonClick}>Post</SubmitButton>
      </BottomRow>
    </Container>
  );
}

const Container = styled.div`
  margin: 0 auto;
  padding: 1rem;
  border: 0.1rem solid;
  width: max-content;
`;

const ExpandingInput = styled.div.attrs({
  contentEditable: true,
})`
  width: 30rem;
  padding: 1rem 0.5rem;
  text-align: left;
  font-size: 1.25rem;
  cursor: text;
  border-bottom: 0.1rem solid;

  &:empty:before {
    content: attr(placeholder);
    color: rgba(0, 0, 0, 0.5);
  }

  &:focus {
    outline: none;
  }
`;

const BottomRow = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: center;
`;

const SubmitButton = styled.button`
  font-size: 1.5rem;
  background-color: white;
  border-radius: 100rem;
  padding: 0.5rem 1.5rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
