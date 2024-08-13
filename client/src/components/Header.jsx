import HeaderMenu from "./HeaderMenu";
import Hamburger from "./Hamburger";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="header__container">
      <div className="header__logo">
        <Link to="/">
          Post<span className="header__logo--light">ie</span>
        </Link>
      </div>
      <div className="header__wrapper">
        <Hamburger />
        <HeaderMenu />
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
      </div>
    </div>
  );
};
export default Header;
