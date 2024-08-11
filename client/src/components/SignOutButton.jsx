import { useDispatch } from "react-redux";
import { signOut } from "../../redux/user/userSlice";
import { CgRemoveR } from "react-icons/cg";

const SignOutButton = () => {
  const dispatch = useDispatch();

  const handleSignout = async () => {
    dispatch(signOut());
  };
  return (
    <button onClick={handleSignout} className="header__menu-item">
      <CgRemoveR className="header__menu-item-icon" />
      <li className="header__menu-item">Sign Out</li>
    </button>
  );
};
export default SignOutButton;
