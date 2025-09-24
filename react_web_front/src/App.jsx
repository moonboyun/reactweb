import Header from "./component/common/Header";
import Footer from "./component/common/Footer";
import Main from "./component/common/Main";
import { Route, Routes } from "react-router-dom";
import Memberjoin from "./component/member/Memberjoin";
import MemberLogin from "./component/member/MemberLogin";
import MemberMain from "./component/member/MemberMain";
import {
  authReadyState,
  loginIdState,
  memberTypeState,
} from "./component/utils/RecoilData";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import BoardList from "./component/board/BoardList";
import BoardWrite from "./component/board/BoardWrite";
import BoardView from "./component/board/BoardView";
import BoardUpdate from "./component/board/BoardUpdate";
//import { useState } from "react";
//export default로 내보내면 {} 안써야함 씨댕 안 그러면 오류남
function App() {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const [authReady, setAuthready] = useRecoilState(authReadyState);
  console.log("bb" + memberId + "aa");
  useEffect(() => {
    refreshLogin();
    window.setInterval(1000 * 60 * 50);
  }, []);
  const refreshLogin = () => {
    //최초 화면을 접속하면 localStorage에 저장되어있는 refreshToken을 가져와서 자동으로 로그인 처리
    const refreshToken = window.localStorage.getItem("refreshToken");
    //한번도 로그인하지 않았거나,로그아웃을 했으면 refreshToken이 존재하지 않음 -> 갱신할 정보 없음
    if (refreshToken !== null) {
      //refreshToken이 존재하면 -> 해당 토큰으로 인증받아서 자동으로 로그인처리(accessToken, refreshToken을 갱신)
      axios.defaults.headers.common["Authorization"] = refreshToken;
      axios
        .get(`${import.meta.env.VITE_BACK_SERVER}/member/refresh`)
        .then((res) => {
          console.log("refresh");
          console.log(res);
          setMemberId(res.data.memberId);
          setMemberType(res.data.memberType);
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
          setAuthready(true);
        })
        .catch((err) => {
          console.log(err);
          setMemberId("");
          setMemberType(0);
          delete axios.defaults.headers.common["Authorization"];
          window.localStorage.removeItem("refreshToken");
          setAuthready(true);
        });
    } else {
      //재로그인 안하는 경우
      setAuthready(true);
    }
    setAuthready(true);
  };
  return (
    <div>
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/member/join" element={<Memberjoin />} />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/*" element={<MemberMain />} />
          <Route path="/board/list" element={<BoardList />} />
          <Route path="/board/write" element={<BoardWrite />} />
          <Route path="/board/view/:boardNo" element={<BoardView />} />
          <Route path="/board/update/:boardNo" element={<BoardUpdate />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
