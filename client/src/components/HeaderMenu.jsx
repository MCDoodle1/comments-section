import { Link, useLocation } from "react-router-dom";
import { CgEnter, CgUserAdd, CgTranscript } from "react-icons/cg";
import { useSelector } from "react-redux";
import SignOutButton from "./SignOutButton";

const HeaderMenu = ({ vertical }) => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className={`header__menu ${vertical ? "header__menu--vertical" : ""}`}>
      {location.pathname !== "/" && (
        <Link to="/" className="header__menu-item">
          <CgTranscript className="header__menu-item-icon" />
          <li className="header__menu-item-text">Posts</li>
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
    </div>
  );
};
export default HeaderMenu;
