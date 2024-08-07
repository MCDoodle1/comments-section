import { useDispatch, useSelector } from "react-redux";
import { useId, useState, useEffect } from "react";
import { addComment } from "../../redux/comment/commentSlice.js";

const NewComment = ({ commentId }) => {
  const dispatch = useDispatch();
  const { currentUser, error: userError } = useSelector((state) => state.user);
  const { loading, error: commentError } = useSelector(
    (state) => state.comments
  );
  const commentTextAreaId = useId();
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser && currentUser._id) {
      dispatch(addComment({ content, commentId, userId: currentUser._id }));
      setContent("");
    }
  };

  return (
    currentUser && (
      <form className="newcomment__container" onSubmit={handleSubmit}>
        <img
          src={
            currentUser.avatar
              ? `/uploads/${currentUser.avatar}`
              : "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
          }
          alt="picture of user"
          className="newcomment__avatar"
        />
        <div className="newcomment__text">
          <label htmlFor={commentTextAreaId}>
            <textarea
              id={commentTextAreaId}
              name="newcommentText"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              disabled={loading}
              aria-disabled={loading}
            />
          </label>
        </div>
        <div className="newcomment__button">
          <button type="submit" disabled={!content.trim() || loading}>
            {loading ? "SENDING" : "SEND"}
          </button>
        </div>
      </form>
    )
  );
};
export default NewComment;
