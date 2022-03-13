import { ReactElement, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";

export default function HomePage(): ReactElement {
  const [cookies, setCookie, removeCookie] = useCookies(["username"]);
  const [posts, setPosts] = useState<{ authorId: string; content: string }[]>(
    []
  );

  useEffect(() => {
    const updater = setInterval(async () => {
      const postsResponse = await fetch("http://localhost:4000/posts");
      const posts = await postsResponse.json();

      setPosts(posts);
    }, 1000);

    return () => clearInterval(updater);
  }, []);

  function handleLogout(): void {
    removeCookie("username");
  }

  return (
    <Container>
      <CreatePost />
      <PostsContainer>
        {posts.map((post) => (
          <Post
            key={post.content}
            username={post.authorId}
            content={post.content}
          />
        ))}
      </PostsContainer>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
`;

const PostsContainer = styled.div`
  width: 50vw;
  margin: 0 auto;
`;
