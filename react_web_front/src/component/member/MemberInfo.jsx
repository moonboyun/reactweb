import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  authReadyState,
  loginIdState,
  memberTypeState,
} from "../utils/RecoilData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";

const MemberInfo = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const [member, setMember] = useState(null);
  const [authReady, setAuthready] = useRecoilState(authReadyState);
  const navigate = useNavigate();
  const inputMemberData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMember = { ...member, [name]: value };
    setMember(newMember);
  };
  useEffect(() => {
    if (!authReady) {
      return;
    }
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/member/${memberId}`)
      .then((res) => {
        console.log(res);
        setMember(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [authReady]);
  const memberUpdate = () => {
    axios
      .patch(`${import.meta.env.VITE_BACK_SERVER}/member/`, member)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          Swal.fire({
            title: "수정완료",
            icon: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteMember = () => {
    Swal.fire({
      title: "회원탈퇴",
      text: "진짜 정말 탈퇴합니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    }).then((res1) => {
      console.log(res1);
      if (res1.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACK_SERVER}/member/${member.memberId}`
          )
          .then((res2) => {
            console.log(res2);
            if (res2 === 1) {
              Swal.fire({
                title: "완료",
                text: "탈퇴완료",
                icon: "info",
              }).then(() => {
                setMemberId("");
                setMemberType(0);
                delete axios.defaults.headers.common["Authorization"];
                window.localStorage.removeItem("refreshToken");
                navigate("/");
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  return (
    <div>
      <h1 className="page-title">회원정보 페이지</h1>
      {member !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            memberUpdate();
          }}
        >
          <table className="tbl my-info">
            <tbody>
              <tr>
                <th style={{ width: "20%" }}>아이디</th>
                <td className="left">{member.memberId}</td>
              </tr>
              <tr>
                <th>이름</th>
                <td>
                  <div className="input-item">
                    <input
                      type="text"
                      name="memberName"
                      value={member.memberName}
                      onChange={inputMemberData}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>
                  <div className="input-item">
                    <input
                      type="text"
                      name="memberPhone"
                      value={member.memberPhone}
                      onChange={inputMemberData}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th>회원등급</th>
                <td className="left">
                  {member.memberType === 1 ? "관리자" : "일반회원"}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="button-zone">
            <button type="submit" className="btn-primary lg">
              정보수정
            </button>
            <button
              type="button"
              className="btn-secondary lg"
              onClick={deleteMember}
            >
              회원탈퇴
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MemberInfo;
