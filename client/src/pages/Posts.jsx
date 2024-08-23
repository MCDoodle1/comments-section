import NewComment from "../components/NewComment";
import CommentList from "../components/CommentList";
import DeleteWarning from "../components/DeleteWarning";

const Posts = ({ commentId }) => {
  return (
    <div className="posts__container">
      <CommentList />
      <NewComment commentId={commentId} />
      <DeleteWarning commentIdToDelete={commentId} />
    </div>
  );
};
export default Posts;
