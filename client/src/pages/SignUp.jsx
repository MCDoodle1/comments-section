import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState();
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signUpStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signUpFailure(data.message));
        return;
      }
      dispatch(signUpSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signUpFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // SignUp component
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
        <div>
          <input
            type="file"
            name="avatar"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload}>Upload</button>
        </div>

        <input
          type="text"
          placeholder="username"
          className="signup__form-item"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="signup__form-item"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="signup__form-item"
          id="password"
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
