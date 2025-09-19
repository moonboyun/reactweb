import { isRecoilValue, useRecoilState } from "recoil";
import { isLoginState, loginIdState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MemberMain = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [member, setMember] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/member/${memberId}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
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
      <h3>마이페이지</h3>
    </div>
  );
};

export default MemberMain;
