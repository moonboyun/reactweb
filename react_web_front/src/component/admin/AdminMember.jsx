import axios from "axios";
import { useEffect, useState } from "react";
import PageNavigation from "../utils/PageNavigation";
import { MenuItem, Select } from "@mui/material";

const AdminMember = () => {
  const [memberList, setMemberList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState(null);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACK_SERVER}/admin/member?reqPage=${reqPage}`
      )
      .then((res) => {
        console.log(res);
        setMemberList(res.data.memberList);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <div>
      <div className="page-title">회원 관리</div>
      <div className="admin-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>아이디</th>
              <th style={{ width: "20%" }}>이름</th>
              <th style={{ width: "30%" }}>전화번호</th>
              <th style={{ width: "30%" }}>등급</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => {
              const changeMemberType = (e) => {
                const memberType = e.target.value;
                //DB에 먼저 반영하고 화면처리
                const obj = {
                  memberId: member.memberId,
                  memberType: memberType,
                };
                axios
                  .patch(
                    `${import.meta.env.VITE_BACK_SERVER}/admin/member`,
                    obj
                  )
                  .then((res) => {
                    if (res.data === 1) {
                      memberList[index].memberType = memberType;
                      setMemberList([...memberList]);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              };
              return (
                <tr key={"member-" + index}>
                  <td>{member.memberId}</td>
                  <td>{member.memberName}</td>
                  <td>{member.memberPhone}</td>
                  <td>
                    <Select
                      value={member.memberType}
                      onChange={changeMemberType}
                      sx={{ width: "120px", height: "50px" }}
                    >
                      <MenuItem value="1">관리자</MenuItem>
                      <MenuItem value="2">일반회원</MenuItem>
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="admin-page-wrap" style={{ marginTop: "50px" }}>
          {pi && (
            <PageNavigation pi={pi} reqPage={reqPage} setReqpage={setReqPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMember;
