import axios from "axios";
import { useEffect, useState } from "react";
import PageNavigation from "../utils/PageNavigation";
import { Switch } from "@mui/material";

const AdminBoard = () => {
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [pi, setPi] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/admin/board?reqPage=${reqPage}`)
      .then((res) => {
        console.log(res);
        setBoardList(res.data.boardList);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  return (
    <div>
      <div className="page-title">게시글 관리</div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>글번호</th>
            <th style={{ width: "40%" }}>제목</th>
            <th style={{ width: "20%" }}>작성자</th>
            <th style={{ width: "15%" }}>작성일</th>
            <th style={{ width: "15%" }}>공개여부</th>
          </tr>
        </thead>
        <tbody>
          {boardList.map((board, index) => {
            const changeStatus = () => {
              const boardStatus = board.boardStatus === 1 ? 2 : 1;
              const obj = { boardNo: board.boardNo, boardStatus: boardStatus };
              axios
                .patch(`${import.meta.env.VITE_BACK_SERVER}/admin/board`, obj)
                .then((res) => {
                  boardList[index].boardStatus = boardStatus;
                  setBoardList([...boardList]);
                })
                .catch((err) => {
                  console.log(err);
                });
            };
            return (
              <tr key={"board-" + index}>
                <td>{board.boardNo}</td>
                <td>{board.boardTitle}</td>
                <td>{board.boardWriter}</td>
                <td>{board.boardDate}</td>
                <td>
                  <Switch
                    sx={{
                      "& .MuiSwitch-thumb": {
                        backgroundColor: "var(--main3)",
                      },
                    }}
                    checked={board.boardStatus === 1}
                    onChange={changeStatus}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: "50px" }}>
        {pi && (
          <PageNavigation pi={pi} reqPage={reqPage} setReqpage={setReqPage} />
        )}
      </div>
    </div>
  );
};
export default AdminBoard;
