import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { loginIdState, memberTypeState } from "../utils/RecoilData";

const MemberLogin = () => {
  //recoil에 선언한 데이터(state)를 가져오는 방법
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
  });
  const naviagte = useNavigate();
  const login = () => {
    if (member.memberId !== "" && member.memberPw) {
      const backServer = import.meta.env.VITE_BACK_SERVER;
      axios
        .post(`${backServer}/member/login`, member)
        .then((res) => {
          console.log(res);
          //로그인 성공 시점에 데이터를 저장
          setMemberId(res.data.memberId);
          setMemberType(res.data.memberType);
          //로그인 이후에 axios를 통한 요청을 수행한 경우 자동으로 axios에 추가하는 로직
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          //로그인을 성공하면 갱신을 위한 refreshToken을 브라우저에 저장
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
          naviagte("/");
        })
        .catch((err) => {
          Swal.fire({
            title: "로그인 실패",
            text: "아이디랑 비번 확인",
            icon: "warning",
          });
        });
    } else {
      Swal.fire({
        text: "아이디 비번 확인요",
        icon: "info",
      });
    }
  };
  const inputMemberData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };
  return (
    <section className="section login-wrap">
      <div className="page-title">로그인</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <div className="input-wrap">
          <div>
            <label htmlFor="memberId">아이디</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={member.memberId}
              onChange={inputMemberData}
            ></input>
          </div>
        </div>
        <div className="input-wrap">
          <div>
            <label htmlFor="memberPw">비밀번호</label>
          </div>
          <div className="input-item">
            <input
              type="password"
              id="memberPw"
              name="memberPw"
              value={member.memberPw}
              onChange={inputMemberData}
            ></input>
          </div>
        </div>
        <div className="login-button-box">
          <button type="submit" className="btn-primary lg">
            로그인
          </button>
        </div>
        <div className="member-link-box">
          <Link to={"/member/join"}>회원가입</Link>
          <Link to="#">아이디/비밀번호 찾기</Link>
        </div>
      </form>
    </section>
  );
};
export default MemberLogin;
