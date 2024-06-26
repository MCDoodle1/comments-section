import NewComment from "../components/NewComment";
import CommentList from "../components/CommentList";

const Posts = ({ commentId }) => {
  return (
    <>
      <CommentList />
      <NewComment commentId={commentId} />
    </>
  );
};
export default Posts;
