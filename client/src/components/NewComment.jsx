import { useDispatch, useSelector } from "react-redux";
import { useId, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { commentFailure } from "../../redux/user/userSlice";

const NewComment = ({ commentId, onCommentAdded }) => {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.user);
  const commentTextAreaId = useId();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          commentId,
          userId: currentUser._id,
        }),
      });

      if (res.ok) {
        setContent("");
        onCommentAdded();
      } else {
        const data = await res.json();
        dispatch(commentFailure(data.message || "Something went wrong"));
      }
    } catch (error) {
      dispatch(commentFailure("An error occurred. Please try again"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return currentUser ? (
    <>
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
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            />
          </label>
        </div>
        <div className="comment__button">
          <button type="submit" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "SENDING" : "SEND"}
          </button>
        </div>
        {error && <p className="comment__error"></p>}
      </form>
    </>
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
export default NewComment;
