import { useState } from "react";
import BoardFrm from "./BoardFrm";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import TextEditor from "../utils/TextEditor";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BoardWrite = () => {
  //글 작성을 위한 데이터 저장을 위한 state를 선언
  const [boardTitle, setBoardTitle] = useState(""); //게시글 제목
  const [thumbnail, setThumbnail] = useState(""); //게시글 섬네일 첨부파일
  const [boardFile, setBoardFile] = useState([]); //게시글 첨부파일
  const [boardContent, setBoardContent] = useState(""); //본문
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  //글 작성자는 리코일에서 로그인회원 아이디 가져옴
  const navigate = useNavigate();
  const write = () => {
    if (boardTitle !== "" && boardContent !== "") {
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardContent", boardContent);
      form.append("boardWriter", memberId);
      //섬네일은 첨부파일을 추가한 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      //첨부파일도 추가한 겨웅에만 추가
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }
      axios
        .post(`${import.meta.env.VITE_BACK_SERVER}/board`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data > 0) {
            navigate("/board/list");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <section className="section board-content-wrap">
      <div className="page-title">게시글 작성</div>
      <div className="board-frm">
        <BoardFrm
          boardTitle={boardTitle}
          setBoardTitle={setBoardTitle}
          thumbmail={thumbnail}
          setThumbnail={setThumbnail}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
        />
        <div className="board-content-wrap">
          <TextEditor data={boardContent} setData={setBoardContent} />
        </div>
        <div className="button-zone">
          <button type="button" className="btn-primary lg" onClick={write}>
            등록하기
          </button>
        </div>
      </div>
    </section>
  );
};
export default BoardWrite;
