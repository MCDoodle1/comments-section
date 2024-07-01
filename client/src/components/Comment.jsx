import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";

const Comment = ({ comment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [likes, setLikes] = useState(comment.numberOfLikes);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(
    () => {
      if (comment.likes.includes(currentUser._id)) {
        setHasLiked(true);
      } else {
        setHasLiked(false);
      }
    },
    comment.likes,
    currentUser._id
  );

  const updateLike = async (increment) => {
    try {
      const res = await fetch(`api/comment/likeComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ increment }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.numberOfLikes);
        if (increment === 1) {
          setHasLiked(true);
        } else {
          setHasLiked(false);
        }
      } else {
        console.error("Error liking/unliking comment", await res.text());
      }
    } catch (error) {
      console.error("Error liking/unliking comment", error);
    }
  };

  const increaseLike = () => {
    if (!hasLiked && comment.userId._id !== currentUser._id) {
      updateLike(1);
    }
  };

  const decreaseLike = () => {
    if (hasLiked && comment.userId._id !== currentUser._id) {
      updateLike(-1);
    }
  };

  return (
    <>
      <div className="comment__likes">
        <div className="comment__likes-increase" onClick={increaseLike}>
          +
        </div>
        <div className="comment__likes-count">{likes}</div>
        <div className="comment__likes-decrease" onClick={decreaseLike}>
          -
        </div>
      </div>
      <div className="comment__messagewrapper">
        <div className="comment__header">
          <img
            src={
              comment.userId.avatar
                ? `/uploads/${comment.userId.avatar}`
                : "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
            }
            alt="User avatar"
            className="comment__header-avatar"
          />
          <p className="comment__header-username">{comment.userId.username}</p>
          {comment.userId._id === currentUser._id && (
            <span className="comment__header-you">you</span>
          )}
          <p className="comment__header-timeago">
            <ReactTimeAgo date={new Date(comment.createdAt)} locale="en-US" />
          </p>
        </div>
        <p className="comment__text">{comment.content}</p>
      </div>
    </>
  );
};
export default Comment;
