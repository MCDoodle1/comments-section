import { useSelector } from "react-redux";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

const Comment = ({ commentId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const commentTextAreaId = useId();
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          commentId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return currentUser ? (
    <form className="comment__container" onSubmit={handleSubmit}>
      <img
        src={currentUser.avatar}
        alt="picture of user"
        className="comment__avatar"
      />

      <div className="comment__text">
        <label htmlFor={commentTextAreaId}>
          <textarea
            id={commentTextAreaId}
            name="commentText"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
        </label>
      </div>
      <div className="comment__button">
        <button>SEND</button>
      </div>
    </form>
  ) : (
    <div className="comment__signin-warning">
      <p className="comment__signin-warning-text">
        You must be signed in to read your posts
      </p>
      <Link to={"/sign-in"} className="comment__signin-warning-link">
        Sign in
      </Link>
    </div>
  );
};
export default Comment;
