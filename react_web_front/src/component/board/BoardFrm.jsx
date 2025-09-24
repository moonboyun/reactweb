import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import DeleteIcon from "@mui/icons-material/Delete";

const BoardFrm = (props) => {
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const thumbmail = props.thumbmail; //전송용
  const setThumbnail = props.setThumbnail;
  const boardFile = props.boardFile; //전송용
  const setBoardFile = props.setBoardFile;
  //writer에서는 전송 안 하고 update만 전송한 값 추출
  //writer에서는 해당키로 전송 한 했으니까 아래 값이 다 언디파인드
  const boardImg = props.boardImg;
  const setBoardImg = props.setBoardImg;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;

  const [memberId, setMemberId] = useRecoilValue(loginIdState);
  //섬네일 화면 출력용 state
  const [showThumb, setShowThumb] = useState(null);
  //첨부파일 화면 출력용 state
  const [showFileList, setShowFileList] = useState([]);

  const thumbRef = useRef(null);
  //섬네일 변경 시 동작하는 함수
  const changeThumbnail = (e) => {
    const files = e.target.files;
    if (files.length !== 0) {
      //1. 글 작성 시 파일을 전송하기 위한 파일 객체 저장
      setThumbnail(files[0]);
      //2. 화면에 미리보기 설정
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setShowThumb(reader.result);
        if (boardImg) {
          //보드이미지를 바꾸면 보드이미지를 null로 바꾸면서 아래 3항을 동작하게 함
          setBoardImg(null);
        }
      };
    } else {
      setThumbnail(null);
      setShowThumb(null);
    }
  };
  //첨부파일 추가 시 동작하는 함수
  const addBoardFile = (e) => {
    const files = e.target.files;
    console.log(files);
    const fileArr = new Array(); //글 작성 시 전송할 파일 객체들을 저장하기 위한 배열
    const fileNameArr = new Array(); //화면에 파일 이름을 출력하기 위한 배열
    for (let i = 0; i < files.length; i++) {
      fileArr.push(files[i]);
      fileNameArr.push(files[i].name); //출력할 이름만 저장
    } //for
    setBoardFile([...boardFile, ...fileArr]);
    //배열에 저장할 때 ...을 입력하지 않고 저장하면 배열객체 자체로 합쳐짐
    //누적해서 저장하려면 ...해서 합쳐야함 ex)[1,2,3,[4,5,6]] [1,2,3,4,5,6]
    setShowFileList([...showFileList, ...fileNameArr]);
  };
  return (
    <div>
      <div className="board-thumb-wrap">
        {/*boardImg는 update에서 생성한 것임 글쓰기 할때는 언디파인드
        null일 수도 있고 언디파인드일 수도 있어서 그냥 자체로 돌려서 true false로 검사하게 함*/}
        {boardImg ? (
          <img
            src={`${import.meta.env.VITE_BACK_SERVER}/board/thumb/${boardImg}`}
            onClick={() => {
              thumbRef.current.click();
            }}
          />
        ) : showThumb === null ? (
          <img
            src="/image/default_img.png"
            onClick={() => {
              thumbRef.current.click();
            }}
          ></img>
        ) : (
          <img
            src={showThumb}
            onClick={() => {
              thumbRef.current.click();
            }}
          ></img>
        )}

        <input
          ref={thumbRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={changeThumbnail}
        ></input>
      </div>
      <div className="board-info-wrap">
        <table className="tbl">
          <tbody>
            <tr>
              <th style={{ width: "30%" }}>
                <label htmlFor="boardTitle">제목</label>
              </th>
              <td>
                <div className="input-item">
                  <input
                    type="text"
                    id="boardTitle"
                    name="boardTitle"
                    value={boardTitle}
                    onChange={(e) => {
                      setBoardTitle(e.target.value);
                    }}
                  ></input>
                </div>
              </td>
            </tr>
            <tr>
              <th>작성자</th>
              <td className="left">{memberId}</td>
            </tr>
            <tr>
              <th>첨부파일</th>
              <td className="left">
                <input
                  type="file"
                  id="boardFile"
                  style={{ display: "none" }}
                  onChange={addBoardFile}
                  multiple
                ></input>
                <label htmlFor="boardFile" className="btn-primary sm">
                  파일첨부
                </label>
              </td>
            </tr>
            <tr>
              <th>첨부파일 목록</th>
              <td>
                <div className="board-file-wrap">
                  {fileList &&
                    fileList.map((boardFile, i) => {
                      const deleteFile = () => {
                        const newFileList = fileList.filter((item, index) => {
                          return index !== i;
                        });
                        setFileList(newFileList);
                        //기존파일중 삭제하는 파일번호를 배열로 저장
                        setDelFileNo([...delFileNo, boardFile.boardFileNo]);
                      };
                      return (
                        <p key={"boardFile" + i}>
                          <span className="filename">{boardFile.filename}</span>
                          <DeleteIcon onClick={deleteFile} />
                        </p>
                      );
                    })}
                  {showFileList.map((filename, i) => {
                    //파일을 지우는 함수
                    //i라는 값을 이용해서 boardFile도 같이 지우려고
                    const deleteFile = () => {
                      const newFileList = showFileList.filter((item, index) => {
                        return index !== i;
                      });
                      setShowFileList(newFileList);
                      const newBoardFile = boardFile.filter((item, index) => {
                        return index !== 1;
                      });
                      setBoardFile(newBoardFile);
                    };
                    return (
                      <p key={"file-" + i}>
                        <span className="filename">{filename}</span>
                        <DeleteIcon onClick={deleteFile} />
                      </p>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardFrm;
