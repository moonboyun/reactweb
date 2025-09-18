import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MemberLogin = (props) => {
  const setIsLogin = props.setIsLogin;
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
          setIsLogin(true);
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
