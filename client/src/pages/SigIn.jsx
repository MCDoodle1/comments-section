import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="signin__container">
      <h1 className="signin__header">
        Sign<span className="signin__header-light">In</span>
      </h1>
      <form onSubmit={handleSubmit} className="signin__form">
        <input
          type="email"
          placeholder="email"
          className="signin__form-item"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="signin__form-item"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} className="signin__button">
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="signin__link">
        <p>No account?</p>
        <Link to={"/sign-up"}>
          <span className="signin__link-text">Sign up</span>
        </Link>
      </div>
      {error && <p className="signin__error">{error}</p>}
    </div>
  );
};
export default Signin;
