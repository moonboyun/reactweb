import axios from "axios";
import { createElement, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const BoardView = () => {
  const params = useParams();
  const boardNo = params.boardNo;
  const [board, setBoard] = useState(null);
  const [memberId, setMemberId] = useRecoilState(loginIdState);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/board/${boardNo}`)
      .then((res) => {
        console.log(res);
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const deleteBoard = () => {
    Swal.fire({
      title: "게시글 삭제",
      text: "정말 삭제할거?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
    }).then((select) => {
      if (select.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACK_SERVER}/board/${boardNo}`)
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              navigate("/board/list");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  return (
    <section className="section board-view-wrap">
      <div className="page-title">게시글</div>
      {/*자바스크립트는 && 연산자를 쓸 때 안에 객체가 언디파인드나 null이면 false로 처리*/}
      {board && (
        <div className="board-view-content">
          <div className="board-view-info">
            <div className="board-thumbnail">
              <img
                src={
                  board.boardThumb
                    ? `${import.meta.env.VITE_BACK_SERVER}/board/thumb/${
                        board.boardThumb
                      }`
                    : "/image/default_img.png"
                }
              ></img>
            </div>
            <div className="board-view-preview">
              <table className="tbl">
                <tbody>
                  <tr>
                    <td className="left" colSpan={4}>
                      {board.boardTitle}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ width: "20%" }}>작성자</th>
                    <td style={{ width: "20%" }}>{board.boardWriter}</td>
                    <th style={{ width: "20%" }}>작성일</th>
                    <td style={{ width: "40%" }}>{board.boardDate}</td>
                  </tr>
                </tbody>
              </table>
              <p className="file-title">첨부파일</p>
              <div className="file-zone">
                {board.boardFileList.map((file, i) => {
                  return <FileItem key={"file" + i} file={file} />;
                })}
              </div>
            </div>
          </div>
          {/*html 태그로 저장된 데이터를 화면에 출력하려면 머스태치 문법이 아니라 속성을 이용해서 처리*/}
          <div
            className="board-content-wrap"
            dangerouslySetInnerHTML={{ __html: board.boardContent }} //content는 태그로 저장되어있음
          ></div>
          {memberId === board.boardWriter && (
            <div className="view-btn-zone">
              <Link to={`/board/update/${boardNo}`} className="btn-primary lg">
                수정
              </Link>
              <button
                type="button"
                className="btn-secondary lg"
                onClick={deleteBoard}
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
const FileItem = (props) => {
  const file = props.file;
  const fileDown = () => {
    axios
      .get(`${import.meta.env.VITE_BACK_SERVER}/board/file/${file.filepath}`, {
        //axios는 기본적으로 모든 응답을 json으로 처리
        // 이번 요청은 일반적인 요청이 아니라 파일을 받아야하므로 응답형식을 파일형태로 지정
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);
        //서버에서 받은 데이터를 자바스트립트의 Blob객체로 변환
        const blob = new Blob([res.data]);
        //blob을 이용해서 데이터를 다운로드 할 수 있는 url을 생성
        const fileUrl = window.URL.createObjectURL(blob);

        //데이터를 다운로드 할 링크(a태그)
        const link = document.createElement("a");
        link.href = fileUrl;
        link.style.display = "none";
        //다운로드 할 파일 이름 지정
        link.download = file.filename;

        //다운로드 할 파일 이름 지정
        link.download = file.filename;
        //파일과 연결 된 a태그를 문서에 포함
        document.body.appendChild(link);
        link.click(); //추가한 a태그를 클릭해서 다운로드
        link.remove(); //사용한 a태그 삭제
        window.URL.revokeObjectURL(fileUrl); //파일다운로드 url 파기
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="board-file">
      <DownloadIcon onClick={fileDown} />
      <span className="file-name">{file.filename}</span>
    </div>
  );
};
export default BoardView;
