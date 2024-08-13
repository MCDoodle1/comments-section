import NewComment from "../components/NewComment";
import CommentList from "../components/CommentList";

const Posts = ({ commentId }) => {
  return (
    <div className="posts__container">
      <CommentList />
      <NewComment commentId={commentId} />
    </div>
  );
};
export default Posts;
