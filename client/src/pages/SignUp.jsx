import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiUploadCloud } from "react-icons/fi";

const SignUp = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.username || !formValues.email || !formValues.password) {
      dispatch(signUpFailure("All fields are required"));
      return;
    }
    try {
      const userData = {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
        avatar: file,
      };
      dispatch(signUp(userData));
      navigate("/");
    } catch (error) {
      console.error("Error signing up: ", error.message);
    }
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="signup__container">
      <h1 className="signup__header">
        Sign<span className="signup__header-light">Up</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="signup__form"
      >
        <div className="signup__upload-wrapper">
          <div className="signup__upload-wrapper2">
            <label htmlFor="fileId" className="signup__upload-label">
              <h2 className="signup__upload-header">Upload Picture</h2>
              <FiUploadCloud className="signup__upload-icon" />
              <p className="signup__upload-text">Upload your profile picture</p>
            </label>
            <input
              type="file"
              name="avatar"
              id="fileId"
              className="signup__form-item-input"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="username"
          className="signup__form-item"
          id="username"
          value={formValues.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="signup__form-item"
          id="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="signup__form-item"
          id="password"
          value={formValues.password}
          onChange={handleChange}
        />
        <button disabled={loading} className="signup__button">
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="signup__link">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="signup__link-text">Sign in</span>
        </Link>
      </div>
      {error && <p className="signup__error">{error}</p>}
    </div>
  );
};
export default SignUp;
