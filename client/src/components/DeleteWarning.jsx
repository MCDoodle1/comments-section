import { useDispatch, useSelector } from "react-redux";
import { hideWarning } from "../../redux/warning/warningSlice";
import { deleteComment } from "../../redux/comment/commentSlice";

const DeleteWarning = () => {
  const dispatch = useDispatch();
  const { isWarningVisible } = useSelector((state) => state.warning);
  const userId = useSelector((state) => state.user.currentUser?._id);
  const commentIdToDelete = useSelector(
    (state) => state.warning.commentIdtoDelete
  );

  if (!isWarningVisible) return null;

  const handleDelete = async () => {
    if (!commentIdToDelete) {
      console.error("Comment ID is undefined, cannot delete");
    }
    if (userId && commentIdToDelete) {
      dispatch(deleteComment({ commentId: commentIdToDelete, userId }));
      dispatch(hideWarning());
    } else {
      console.error("User ID or comment ID is not available");
    }
  };

  const handleCancel = () => {
    dispatch(hideWarning());
  };

  return (
    <div className="warning__background">
      <div className="warning__container">
        <h2 className="warning__header">Delete comment</h2>
        <p className="warning__text">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="warning__buttonwrapper">
          <button className="warning__button-cancel" onClick={handleCancel}>
            no, cancel
          </button>
          <button className="warning__button-delete" onClick={handleDelete}>
            yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteWarning;
