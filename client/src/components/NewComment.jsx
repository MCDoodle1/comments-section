import { useDispatch, useSelector } from "react-redux";
import { useId, useState } from "react";
import {
  addComment,
  replyToComment,
} from "../../redux/comment/commentSlice.js";

const NewComment = ({
  parentCommentId,
  parentCommentUsername,
  setShowReplyForm,
  isReply,
}) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.comments);
  const commentTextAreaId = useId();
  const [content, setContent] = useState("");

  console.log(parentCommentUsername);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser && currentUser._id) {
      if (isReply && parentCommentId) {
        dispatch(
          replyToComment({
            content,
            parentCommentId,
            parentCommentUsername,
            userId: currentUser._id,
          })
        ).unwrap();
        setShowReplyForm(false);
      } else {
        dispatch(
          addComment({
            content,
            userId: currentUser._id,
          })
        ).unwrap();
      }
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
              placeholder={!isReply ? "Add a comment..." : "Add a reply..."}
              disabled={loading}
              aria-disabled={loading}
            />
          </label>
        </div>
        <div className="newcomment__button">
          <button type="submit" disabled={!content.trim() || loading}>
            {loading && (!isReply ? "SENDING" : "REPLYING")}
            {!loading && (!isReply ? "SEND" : "REPLY")}
          </button>
        </div>
      </form>
    )
  );
};
export default NewComment;
