import { Link, NavLink } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./LeftSideMenu.css";

const LeftSideMenu = (props) => {
  const menus = props.menus;
  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, i) => {
          return (
            <li key={"side-menu" + i}>
              <NavLink
                to={menu.url}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span>{menu.text}</span>
                <KeyboardArrowRightIcon />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default LeftSideMenu;
