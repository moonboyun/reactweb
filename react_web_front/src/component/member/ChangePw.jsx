import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ChangePw = () => {
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const [member, setMember] = useState({ memberId: memberId, memberPw: "" });
  const [isAuth, setIsAuth] = useState(false); //현재 비밀번호를 입력해서 확인했는지 체크하는 state
  const [memberPwRe, setMemberPwRe] = useState("");
  const inputPw = (e) => {
    const newMember = { ...member, memberPw: e.target.value };
    setMember(newMember);
  };
  const inputPwRe = (e) => {
    setMemberPwRe(e.target.value);
  };
  const pwCheck = () => {
    axios
      .post(`${import.meta.env.VITE_BACK_SERVER}/member/pw-check`, member)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          setIsAuth(true);
          setMember({ ...member, memberPw: "" }); //비밀번호 변경 시 재사용하기 위한 memberPw초기화
        } else {
          Swal.fire({
            title: "비밀번호를 확인하세요",
            icon: "question",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updatePw = () => {
    if (member.memberPw !== "" && member.memberPw === memberPwRe) {
      axios
        .patch(`${import.meta.env.VITE_BACK_SERVER}/member/password`, member)
        .then((res) => {
          console.log(res);
          if (res.data === 1) {
            Swal.fire({
              title: "비밀번호 변경완료",
              icon: "success",
            }).then(() => {
              setIsAuth(false);
              setMember({ ...member, memberPw: "" });
              setMemberPwRe("");
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        title: "비밀번호를 정상적으로 입력해주세요",
        icon: "info",
      });
    }
  };
  return (
    <div>
      <div className="page-title">비밀번호 변경</div>
      <div style={{ width: "60%", margin: "0 auto" }}>
        {isAuth ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePw();
            }}
          >
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="newPw">새 비밀번호</label>
              </div>
              <div className="input-item">
                <input
                  type="passWord"
                  id="newPw"
                  name="newPw"
                  value={member.memberPw}
                  onChange={inputPw}
                />
              </div>
            </div>
            <div className="input-wrap" style={{ marginTop: "50px" }}>
              <div className="input-title">
                <label htmlFor="newPwRe">새 비밀번호 확인</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  id="newPwRe"
                  name="newPwRe"
                  onChange={inputPwRe}
                />
              </div>
            </div>
            <div className="button-zone">
              <button type="submit" className="btn-primary lg">
                변경하기
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              pwCheck();
            }}
          >
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="oldPw">기존 비밀번호 입력</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  name="oldPw"
                  id="oldPw"
                  value={member.memberPw}
                  onChange={inputPw}
                />
                <button type="submit" className="btn-primary lg">
                  확인
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ChangePw;
