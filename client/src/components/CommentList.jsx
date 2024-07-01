import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../../redux/comment/commentSlice.js";
import { Link } from "react-router-dom";
import Comment from "./Comment.jsx";

const CommentList = () => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      dispatch(getComments());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  if (!currentUser) {
    return (
      <div className="commentlist__signin-warning">
        <p className="commentlist__signin-warning-text">
          You must be signed in to read your posts
        </p>
        <Link to={"/sign-in"} className="commentlist__signin-warning-link">
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>Error loading comments: {error}</p>;
  }

  if (!Array.isArray(comments) || comments.length === 0) {
    return <p>No comments available.</p>;
  }

  return (
    <div className="">
      {comments.map((comment) => (
        <div key={comment._id} className="commentlist__container">
          <Comment comment={comment} />
        </div>
      ))}
    </div>
  );
};
export default CommentList;
