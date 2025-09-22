import axios from "axios";
import { useEffect, useState } from "react";
import "./board.css";
import PageNavigation from "../utils/PageNavigation";
const BoardList = () => {
  const [boardList, setBoardList] = useState([]);
  const [reqPage, setReqpage] = useState(1);
  const [pi, setPi] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/board?reqPage=${reqPage}`)
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
    <section className="section board-list">
      <div className="page-title">자유게시판</div>
      <div className="board-list-wrap">
        <ul className="posting-wrap">
          {boardList.map((board, index) => {
            return <BoardItem key={"board-" + index} board={board} />;
          })}
        </ul>
      </div>
      <div className="board-paging-wrap">
        {pi !== null && (
          <PageNavigation pi={pi} reqPage={reqPage} setReqpage={setReqpage} />
        )}
      </div>
    </section>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  return (
    <li className="posting-item">
      <div className="posting-img">
        <img src="/image/default_img.png"></img>
      </div>
      <div className="posting-info">
        <div className="posting-title">{board.boardTitle}</div>
        <div className="posting-sub-info">
          <span>{board.boardWriter}</span>
          <span>{board.boardDate}</span>
        </div>
      </div>
    </li>
  );
};
export default BoardList;
