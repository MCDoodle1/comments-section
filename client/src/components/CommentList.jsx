import { useState, useEffect } from "react";

const CommentList = () => {
  const [comments, setComments] = useState([]);
  console.log(comments);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.log("Failed to fetch comments", res.status, await res.text());
        }
      } catch (error) {
        console.log("Error fetching commments:", error.message);
      }
    };

    getComments();
  }, []);

  return (
    <div className="">
      {comments.map((comment) => (
        <div key={comment._id} className="commentlist__container">
          <div className="commentlist__likes"></div>
          <div>
            <img
              src={comment.avatar}
              alt="User avatar"
              className="commentlist__avatar"
            />
            <p className="commentlist__username">{comment.name}</p>
            <p className="commentlist__text">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CommentList;
