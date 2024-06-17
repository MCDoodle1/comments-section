import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

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
      dispatch(signUpStart());

      const formData = new FormData();
      formData.append("username", formValues.username);
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);
      if (file) {
        formData.append("avatar", file);
      }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
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
        <div className="signup__upload-wrapper">
          <input
            type="file"
            name="avatar"
            className="signup__form-item"
            onChange={handleFileChange}
          />
        </div>
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
