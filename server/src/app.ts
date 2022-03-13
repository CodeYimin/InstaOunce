import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/user", async (req, res) => {
  const { id, username } = req.query;
  if (!id && !username) {
    return res.status(400).json({ error: "Missing id or username." });
  }

  if (id) {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Id must be a string." });
    } else if (!parseInt(id)) {
      return res.status(400).json({ error: "Id must be a number string." });
    }
  }

  if (username) {
    if (typeof username !== "string") {
      return res.status(400).json({ error: "Username must be a string." });
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      id: id ? parseInt(id) : undefined,
      username: { equals: username, mode: "insensitive" },
    },

    include: {
      posts: true,
      following: true,
      followers: true,
    },
  });
  res.json(user);
});

app.post("/user", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send("Username is required");
  } else if (typeof username !== "string") {
    return res.status(400).send("Username must be a string");
  }

  const user = await prisma.user.create({
    data: { username },
  });
  res.json(user);
});

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.post("/post", async (req, res) => {
  const { username, content } = req.body;

  if (!content) {
    return res.status(400).send("Content is required");
  } else if (typeof content !== "string") {
    return res.status(400).send("Content must be a string");
  }

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return res.status(404).send("User not found");
  }

  const post = await prisma.post.create({
    data: {
      content,
      author: { connect: { id: user.id } },
    },
  });
  res.json(post);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
