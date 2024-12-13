import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: ({ queryKey }) => fetchPosts(queryKey[1]),
      });
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: ({ queryKey }) => fetchPosts(queryKey[1]),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  const updateMutation = useMutation({
    mutationFn: (postID) => updatePost(postID),
  });

  if (isLoading) return <h3>Loading ...</h3>;

  if (isError)
    return (
      <>
        <h3>Opps something went wrong! </h3>
        <h1>{error.name}</h1>
        <h2>{error.message}</h2>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousPage) => previousPage - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage === maxPostPage}
          onClick={() => {
            setCurrentPage((previousPage) => previousPage + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          updateMutation={updateMutation}
          deleteMutation={deleteMutation}
          post={selectedPost}
        />
      )}
    </>
  );
}
