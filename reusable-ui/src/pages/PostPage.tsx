import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../apis/api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { TextField } from "../components/TextField";
import { useAuth } from "../hooks/useAuth";
import { Post } from "../types/types";
import Header from "../components/Header";
import {
  LikeButton,
  ReloadButton,
  TrashButton,
} from "../components/IconButton";

export const PostCreateForm: React.FC<{ fetchPosts: () => {} }> = (props) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreatePost = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    try {
      const result = await apiService.createPost(content, user.id);
      if (result.success) {
        setContent("");
        props.fetchPosts();
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <Card className="mb-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How's it going?"
        multiline
        rows={4}
        className="w-full"
      />
      <div className="flex justify-end items-center">
        <Button
          className="mt-1 rounded-md"
          onClick={handleCreatePost}
          disabled={content.length == 0}
        >
          Post
        </Button>
      </div>
    </Card>
  );
};

export const PostItem: React.FC<{ post: Post; fetchPosts?: () => {} }> = ({
  post,
  fetchPosts,
}) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {
    if (!user) return;

    try {
      const result = await apiService.likePost(post.id, user.id);
      if (result.success) {
        setLikes(likes + 1);
      }
    } catch (err) {
      console.error("An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      const result = await apiService.deletePost(post.id);
      if (result.success) {
        if (fetchPosts) {
          fetchPosts();
        }
      }
    } catch (err) {
      console.error("An error occurred");
    }
  };

  return (
    <Card className="mb-4">
      <div className="flex items-start">
        {post.author ? (
          post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.display_name}
              className="w-10 h-10 rounded-full mr-4"
            />
          ) : (
            <div className="w-10 h-10 rounded-full mr-4 flex items-center justify-center bg-gray-300 text-gray-600">
              {post.author.display_name.charAt(0).toUpperCase()}
            </div>
          )
        ) : (
          <div className="w-10 h-10 rounded-full mr-4 bg-gray-200"></div>
        )}
        <div className="w-full">
          <div className="flex items-start">
          <div className="flex-grow">
            <div className="flex gap-1 items-center">
            <div className="font-bold">{post.author?.username}</div>
            <div className="text-sm text-gray-500">{"@" + post.author?.display_name}</div></div>
            <p className="mt-2">{post.content}</p>
          </div>
          {post.author?.id == user?.id ? (
            <TrashButton onClick={handleDelete}></TrashButton>
          ) : (
            <></>
          )}</div>
          <div className="mt-4 flex justify-between items-center">
            <div className="mt-2 text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </div>
            <div className="flex justify-center items-center">
              <LikeButton onClick={handleLike}></LikeButton>
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const result = await apiService.getPosts();
      if (result.success && result.data) {
        setPosts(result.data.items);
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchPosts();
    console.log(posts);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <Header
        pageName="Home"
        user={user}
        onLogout={() => {
          logout();
        }}
      />
      <div className="container mx-auto max-w-2xl p-4">
        <PostCreateForm fetchPosts={fetchPosts} />
        <div className="flex justify-end items-center">
          <ReloadButton onClick={fetchPosts}></ReloadButton>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {posts.map((post) => (
          <PostItem key={post.id} post={post} fetchPosts={fetchPosts} />
        ))}
      </div>
    </>
  );
};
