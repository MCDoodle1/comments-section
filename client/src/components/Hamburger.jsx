import { CgClose, CgFormatJustify } from "react-icons/cg";
import { useState } from "react";
import HeaderMenu from "./HeaderMenu";

const Hamburger = () => {
  const [active, setActive] = useState(false);

  const handleMenu = () => setActive(!active);

  return (
    <div className="header__hamburger">
      <button onClick={handleMenu}>
        {active ? <CgClose size={35} /> : <CgFormatJustify size={35} />}
      </button>
      {active && <HeaderMenu vertical={true} />}
    </div>
  );
};
export default Hamburger;
