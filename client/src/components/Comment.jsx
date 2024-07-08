import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";
import IconReply from "../assets/images/icon-reply.svg?react";
import IconEdit from "../assets/images/icon-edit.svg?react";
import IconDelete from "../assets/images/icon-delete.svg?react";
import IconCancel from "../assets/images/icon-cancel.svg?react";
import IconSave from "../assets/images/icon-save.svg?react";
import {
  editComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "../../redux/comment/commentSlice";
import CustomButton from "./CustomButton";

const Comment = ({ comment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [likes, setLikes] = useState(comment.numberOfLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const dispatch = useDispatch();

  useEffect(() => {
    setHasLiked(comment.likes.includes(currentUser._id));
  }, [comment.likes, currentUser._id]);

  const updateLike = async (increment) => {
    try {
      if (increment === 1 && !hasLiked) {
        await dispatch(
          likeComment({
            commentId: comment._id,
            userId: currentUser._id,
            token: currentUser.token,
          })
        ).unwrap();
        setLikes(likes + 1);
        setHasLiked(true);
      } else if (increment === -1 && hasLiked && likes > 0) {
        await dispatch(
          unlikeComment({
            commentId: comment._id,
            userId: currentUser._id,
            token: currentUser.token,
          })
        ).unwrap();
        setLikes(likes - 1);
        setHasLiked(false);
      }
    } catch (error) {
      console.error("Error liking/unliking comment", error);
    }
  };

  const increaseLike = (e) => {
    e.preventDefault();
    if (!hasLiked && comment.userId._id !== currentUser._id) {
      updateLike(1);
    }
  };

  const decreaseLike = (e) => {
    e.preventDefault();
    if (hasLiked && comment.userId._id !== currentUser._id && likes > 0) {
      updateLike(-1);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = dispatch(
      editComment({
        commentId: comment._id,
        content: editedContent,
        userId: currentUser._id,
      })
    );
    if (!res.error) {
      setIsEditing(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const res = dispatch(
      deleteComment({ commentId: comment._id, userId: currentUser._id })
    );
    if (!res.error) {
      console.log("Comment deleted successfully");
    }
  };

  const handleReply = async () => {};

  return (
    <>
      <div className="comment__likescontainer">
        <button
          type="button"
          className="comment__likes-increase"
          onClick={increaseLike}
        >
          +
        </button>
        <div className="comment__likes-count">{likes}</div>
        <button
          type="button"
          className="comment__likes-decrease"
          onClick={decreaseLike}
        >
          -
        </button>
      </div>
      <div className="comment__messagecontainer">
        <div className="comment__headerwrapper">
          <div className="comment__headerdata">
            <img
              src={
                comment.userId.avatar
                  ? `/uploads/${comment.userId.avatar}`
                  : "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
              }
              alt="User avatar"
              className="comment__header-avatar"
            />
            <p className="comment__header-username">
              {comment.userId.username}
            </p>
            {comment.userId._id === currentUser._id && (
              <span className="comment__header-you">you</span>
            )}
            <p className="comment__header-timeago">
              <ReactTimeAgo date={new Date(comment.createdAt)} locale="en-US" />
            </p>
          </div>
          <div className="comment__headerbuttons">
            {comment.userId._id !== currentUser._id && (
              <CustomButton
                onClick={handleReply}
                className="comment__headerbutton-reply"
                icon={IconReply}
                name="Reply"
              />
            )}
            {comment.userId._id === currentUser._id && (
              <>
                {!isEditing ? (
                  <>
                    <CustomButton
                      onClick={handleDelete}
                      className="comment__headerbutton-delete"
                      icon={IconDelete}
                      name="Delete"
                    />
                    <CustomButton
                      onClick={() => setIsEditing(true)}
                      className="comment__headerbutton-edit"
                      icon={IconEdit}
                      name="Edit"
                    />
                  </>
                ) : (
                  <>
                    <form
                      onSubmit={handleEditSubmit}
                      className="comment__headerbuttons"
                    >
                      <CustomButton
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="comment__headerbutton-delete"
                        icon={IconCancel}
                        name="Cancel"
                      />
                      <CustomButton
                        type="submit"
                        className="comment__headerbutton-edit"
                        icon={IconSave}
                        name="Save"
                      />
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {!isEditing ? (
          <p className="comment__text">{comment.content}</p>
        ) : (
          <textarea
            className="comment__text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        )}
      </div>
    </>
  );
};
export default Comment;
