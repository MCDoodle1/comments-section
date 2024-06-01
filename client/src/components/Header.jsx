import { Link, useLocation } from "react-router-dom";
import { CgEnter } from "react-icons/cg";
import { CgUserAdd } from "react-icons/cg";
import { CgTranscript } from "react-icons/cg";

const Header = () => {
  const location = useLocation();
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
        <Link to="/sign-in" className="header__menu-item">
          <CgEnter className="header__menu-item-icon" />
          <li className="header__menu-item-text">Sign In</li>
        </Link>
        <Link to="/sign-up" className="header__menu-item">
          <CgUserAdd className="header__menu-item-icon" />
          <li className="header__menu-item-text">Sign Up</li>
        </Link>
      </ul>
    </div>
  );
};
export default Header;
