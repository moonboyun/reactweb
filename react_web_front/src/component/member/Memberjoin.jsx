import { useRef, useState } from "react";
import "./member.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Memberjoin = () => {
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberPhone: "",
  }); //아이디의 경우 유효성 검사를 위한 스테이트 생성
  //0: 검사전 1 : 정규, 중복 다 만족
  //2: 정규 만족x 3: 아이디 중복
  const [idCheck, setIdCheck] = useState(0);
  const checkId = () => {
    //아이디 유효검사
    //1. 정규표현식
    //2. 정규를 만족해야 중복체크
    const idReg = /^[a-zA-Z0-9]{6,12}$/;
    if (idReg.test(member.memberId)) {
      //이제 중복체크->DB에 물어봐야함
      axios
        .get(`${backServer}/member/exists?memberId=${member.memberId}`)
        .then((res) => {
          console.log(res);
          if (res.data) {
            setIdCheck(3);
          } else {
            setIdCheck(1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIdCheck(2);
    }
  };
  const [memberPwRe, setMemberPwRe] = useState("");
  const pwMsgRef = useRef(null);
  const checkPw = () => {
    //클래스를 조작하고, 화면에 표현하는 글씨를 변경 할 태그를 가져옴
    //const p =document.querySelecter("선택자")
    // -> 리액트는 안씀
    //특정요소를 선택하고 싶을 때 useGef()라는 훅을 사용
    //console.log(pwMsgRef.current.innerText);
    pwMsgRef.current.classList.remove("valid");
    pwMsgRef.current.classList.remove("invalid");
    if (member.memberPw === memberPwRe) {
      pwMsgRef.current.classList.add("valid");
      pwMsgRef.current.innerText = "비밀번호가 같습니다.";
    } else {
      pwMsgRef.current.classList.add("invalid");
      pwMsgRef.current.innerText = "비밀번호가 다릅니다.";
    }
  };
  const backServer = import.meta.env.VITE_BACK_SERVER;
  const navigate = useNavigate();
  const joinMember = () => {
    //아이디는 종복체크까지 완료, 암호는 일치, 이름 전번이 입력된 경우에만
    if (
      member.memberName !== "" &&
      member.memberPhone !== "" &&
      idCheck === 1 &&
      pwMsgRef.current.classList.contains("valid")
    ) {
      axios
        .post(`${backServer}/member`, member)
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        title: "입력값",
        text: "입력값이 이상해요",
        icon: "warning",
      });
    }
    // member -> post
  };
  const inputMemberData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };
  return (
    <section className="section join-wrap">
      <div className="page-title">회원가입</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinMember();
        }}
      >
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberId">아이디</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={member.memberId}
              onChange={inputMemberData}
              onBlur={checkId}
            />
          </div>
          <p
            className={
              idCheck === 0
                ? "input-msg"
                : idCheck === 1
                ? "input-msg valid"
                : "input-msg invalid"
            }
          >
            {idCheck === 0
              ? ""
              : idCheck === 1
              ? "사용 가능한 아이디입니다."
              : idCheck === 2
              ? "아이디는 영어 대/소분자+숫자로 6-12글자입니다."
              : "이미 사용중인 아이디입니다"}
          </p>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPw">비밀번호</label>
          </div>
          <div className="input-item">
            <input
              type="password"
              id="memberPw"
              name="memberPw"
              value={member.memberPw}
              onChange={inputMemberData}
              onBlur={checkPw}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPwRe">비밀번호 확인</label>
          </div>
          <div className="input-item">
            <input
              type="password"
              id="memberPwRe"
              name="memberPwRe"
              value={memberPwRe}
              onChange={(e) => {
                setMemberPwRe(e.target.value);
              }}
              onBlur={checkPw}
            />
          </div>
          <p className="input-msg" ref={pwMsgRef}></p>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberName">이름</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              id="memberName"
              name="memberName"
              value={member.memberName}
              onChange={inputMemberData}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="input-title">
            <label htmlFor="memberPhone">전화번호</label>
          </div>
          <div className="input-item">
            <input
              type="text"
              id="memberPhone"
              name="memberPhone"
              value={member.memberPhone}
              onChange={inputMemberData}
            />
          </div>
        </div>
        <div className="join-button-box">
          <button type="submit">회원가입</button>
        </div>
      </form>
    </section>
  );
};

export default Memberjoin;
