import { useRecoilState } from "recoil";
import { authReadyState, memberTypeState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Route, Routes, useNavigate } from "react-router-dom";
import LeftSideMenu from "../utils/LeftSideMenu";
import AdminMember from "./AdminMember";
import AdminBoard from "./AdminBoard";

const AdminMain = () => {
  const [authReady, setAuthready] = useRecoilState(authReadyState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const navigate = useNavigate();
  useEffect(() => {
    if (authReady && memberType !== 1) {
      Swal.fire({
        title: "알림",
        text: "관리자 페이지입니다.",
        icon: "info",
      }).then(() => {
        navigate("/");
      });
    }
  }, [authReady]);

  const [menus, setMenus] = useState([
    { url: "/admin/member", text: "회원 관리" },
    { url: "/admin/board", text: "게시글 관리" },
  ]);
  return (
    <div className="mypage-wrap">
      <div className="mypage-side">
        <section className="section account-box">
          <div>관리자 페이지</div>
        </section>
        <section className="section">
          <LeftSideMenu menus={menus} />
        </section>
      </div>
      <div className="mypage-content">
        <section className="section">
          <Routes>
            <Route path="member" element={<AdminMember />} />
            <Route path="board" element={<AdminBoard />} />
          </Routes>
        </section>
      </div>
    </div>
  );
};

export default AdminMain;
