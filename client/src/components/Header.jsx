import { Link, useLocation } from "react-router-dom";
import { CgEnter } from "react-icons/cg";
import { CgUserAdd } from "react-icons/cg";
import { CgTranscript } from "react-icons/cg";
import { useSelector } from "react-redux";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="header__container">
      <div className="header__logo">
        <Link to="/">
          Post<span className="header__logo--light">ie</span>
        </Link>
      </div>
      <ul className="header__menu">
        {location.pathname !== "/" && (
          <Link to="/" className="header__menu-item">
            <CgTranscript className="header__menu-item-icon" />
            <li className="header__menu-item">Posts</li>
          </Link>
        )}
        {currentUser && <SignOutButton />}
        {location.pathname !== "/sign-in" && (
          <Link to="/sign-in" className="header__menu-item">
            <CgEnter className="header__menu-item-icon" />
            <li className="header__menu-item-text">Sign In</li>
          </Link>
        )}
        {location.pathname !== "/sign-up" && (
          <Link to="/sign-up" className="header__menu-item">
            <CgUserAdd className="header__menu-item-icon" />
            <li className="header__menu-item-text">Sign Up</li>
          </Link>
        )}
        {currentUser && (
          <img
            src={
              currentUser.avatar
                ? `/uploads/${currentUser.avatar}`
                : "https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
            }
            alt="picture of user"
            className="header__avatar"
          />
        )}
      </ul>
    </div>
  );
};
export default Header;
