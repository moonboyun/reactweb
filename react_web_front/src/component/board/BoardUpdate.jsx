import axios from "axios";
import { createElement, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import BoardFrm from "./BoardFrm";
import TextEditor from "../utils/TextEditor";

const BoardUpdate = () => {
  const params = useParams();
  const boardNo = params.boardNo;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/board/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoardTitle(res.data.boardTitle);
        setBoardContent(res.data.boardContent);
        setBoardImg(res.data.boardThumb);
        setFileList(res.data.boardFileList);
        set;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //전에 만들어둔 컴포넌트를 재사용하려고 따로 받음
  const [boardTitle, setBoardTitle] = useState(""); //게시글 제목
  const [thumbnail, setThumbnail] = useState(""); //게시글 섬네일 변경시 전송할 첨부파일
  const [boardFile, setBoardFile] = useState([]); //게시글 첨부파일 추가 시 전송할 첩부파일
  const [boardContent, setBoardContent] = useState(""); //본문
  //화면 출력용 state -> 화면 처리용 state 글 작성 시 필요 없음
  const [boardImg, setBoardImg] = useState(null); //기존에 작성한 섬네일
  const [fileList, setFileList] = useState(null); //기존에 업로드 해둔 첨부파일목록
  const [delFileNo, setDelFileNo] = useState([]); //기존 파일중 첨부파일을 지우면 파일번호 저장하기 워한 배열

  const update = () => {
    if (boardTitle !== "" && boardContent !== "") {
      const form = new FormData();
      form.append("boardNo", boardNo); //수정은 조건절 사용을 위해 게시글 번호 추가
      form.append("boardTitle", boardTitle);
      form.append("boardContent", boardContent);
      if (thumbnail) {
        //섬네일 변경했으면 파일 추가
        form.append("thumbnail", thumbnail);
      }
      if (boardImg) {
        //기존 섬네일이 존재하면 기존 섬네일 추가(수정 전)
        form.append("boardThumb", boardImg);
      }
      for (let i = 0; i < boardFile.length; i++) {
        //추가 첨부파일
        form.append("boardFile", boardFile[i]);
      }
      for (let i = 0; i < delFileNo.length; i++) {
        form.append("delFileNo", delFileNo[i]);
      }
      axios
        .patch(`${import.meta.env.VITE_BACK_SERVER}/board`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          navigate(`/board/view/${boardNo}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <section className="section board-content-wrap">
      <div className="page-title">게시글 수정</div>
      <div className="board-frm">
        <BoardFrm
          boardTitle={boardTitle}
          setBoardTitle={setBoardTitle}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          boardFile={boardFile}
          setBoardFile={setBoardFile}
          boardContent={boardContent}
          setBoardContent={setBoardContent}
          boardImg={boardImg}
          setBoardImg={setBoardImg}
          fileList={fileList}
          setFileList={setFileList}
          delFileNo={delFileNo}
          setDelFileNo={setDelFileNo}
        />
        <div className="board-content-wrap">
          <TextEditor data={boardContent} setData={setBoardContent} />
        </div>
        <div className="button-zone">
          <button type="button" className="btn-primary lg" onClick={update}>
            수정하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default BoardUpdate;
