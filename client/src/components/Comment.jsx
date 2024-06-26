import { useState } from "react";
import { useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";

const Comment = ({ comment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [count, setCount] = useState(0);

  function increase() {
    setCount((prevCount) => prevCount + 1);
  }

  function decrease() {
    if (count !== 0) {
      setCount((prevCount) => prevCount - 1);
    }
  }

  return (
    <>
      <div className="commentlist__likes">
        <div className="commentlist__likes-plus" onClick={increase}>
          +
        </div>
        <div className="commentlist__likes-count">{count}</div>
        <div className="commentlist__likes-minus" onClick={decrease}>
          -
        </div>
      </div>
      <div className="commentlist__messagewrapper">
        <div className="commentlist__header">
          <img
            src={
              comment.userId.avatarUrl ||
              "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
            }
            alt="User avatar"
            className="commentlist__header-avatar"
          />
          <p className="commentlist__header-username">
            {comment.userId.username}
          </p>
          {comment.userId.id === currentUser._id && (
            <span className="commentlist__header-you">you</span>
          )}
          <p className="commentlist__header-timeago">
            <ReactTimeAgo date={new Date(comment.createdAt)} locale="en-US" />
          </p>
        </div>
        <p className="commentlist__text">{comment.content}</p>
      </div>
    </>
  );
};
export default Comment;
