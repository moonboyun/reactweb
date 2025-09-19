import { Link, useNavigate } from "react-router-dom";
import "./default.css";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { loginIdState, memberTypeState } from "../utils/RecoilData";
const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Jollidang</Link>
        <MainNavi />
        <HeaderLink />
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

const HeaderLink = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const isLogin = false;
  const navigate = useNavigate();
  const logout = () => {
    setMemberId("");
    setMemberType(0);
    navigate("/");
  };
  return (
    <ul>
      {memberId !== "" && memberType !== 0 ? (
        <>
          <li>
            <Link to="/member/mypage">MyPage</Link>
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
