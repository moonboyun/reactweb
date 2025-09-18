import { Link, useNavigate } from "react-router-dom";
import "./default.css";
import { useState } from "react";
const Header = (props) => {
  const isLogin = props.isLogin;
  const setIsLogin = props.setIsLogin;
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Jollidang</Link>
        <MainNavi />
        <HeaderLink isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </header>
  );
};

const MainNavi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="#">메뉴1</Link>
        </li>
        <li>
          <Link to="#">메뉴2</Link>
        </li>
        <li>
          <Link to="#">메뉴3</Link>
        </li>
        <li>
          <Link to="#">메뉴4</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = (props) => {
  const isLogin = props.isLogin;
  const setIsLogin = props.setIsLogin;
  const navigate = useNavigate();
  const logout = () => {
    setIsLogin(false);
    navigate("/");
  };
  return (
    <ul>
      {isLogin ? (
        <>
          <li>
            <Link to="#">MyPage</Link>
          </li>
          <li>
            <Link to="#" onClick={logout}>
              로그아웃
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/member/login">로그인</Link>
          </li>
          <li>
            <Link to="/member/join">회원가입</Link>
          </li>
        </>
      )}
    </ul>
  );
};
export default Header;
