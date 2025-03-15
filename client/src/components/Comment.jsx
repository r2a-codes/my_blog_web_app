import { FaUserCircle } from "react-icons/fa";

const Comment = ({ comment, lorem }) => {
  const img = "";

  return (
    <div className="comment">
      {img ? (
        <span className="user_comment_img">
          <img src={imgUrl + comment.photo} alt="User_img" />
        </span>
      ) : (
        <FaUserCircle className="user_comment_img" />
      )}
      {comment ? (
        <p className="user_comment">{comment.comment}</p>
      ) : (
        <p className="user_comment">{lorem}</p>
      )}
    </div>
  );
};

export default Comment;
