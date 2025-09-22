import { isRecoilValue, useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginIdState,
  authReadyState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LeftSideMenu from "../utils/LeftSideMenu";
import MemberInfo from "./MemberInfo";
import ChangePw from "./ChangePw";

const MemberMain = () => {
  const [authReady, setAuthready] = useRecoilState(authReadyState);
  const [member, setMember] = useState(null);
  const navigate = useNavigate();
  const isLogin = useRecoilState(isLoginState);
  useEffect(() => {
    if (authReady && !isLogin) {
      navigate("/");
    }
  }, []);
  const [menus, setMenus] = useState([
    { url: "/member/info", text: "내정보" },
    { url: "/member/changePw", text: "비밀번호 변경" },
  ]);
  /*
  const navigate = useNavigate();
  const isLogin = isRecoilValue(isLoginState);
  if (!isLogin) {
    Swal.fire({
      title: "로그인 후 이용가능",
      icon: "info",
    }).then(() => {
      navigate("/member/login");
    });
  }*/
  return (
    <div className="mypage-wrap">
      <div className="mypage-side">
        <section className="section account-box">
          <div>MyPAGE</div>
        </section>
        <section className="section">
          <LeftSideMenu menus={menus} />
        </section>
      </div>
      <div className="mypage-content">
        <section className="section">
          <Routes>
            <Route path="info" element={<MemberInfo />} />
            {/*하위 컴포넌트 안에서 라우츠 호출하면 앞에 생략*/}
            <Route path="changePw" element={<ChangePw />} />
          </Routes>
        </section>
      </div>
    </div>
  );
};

export default MemberMain;
