import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, loginIdState } from "./RecoilData";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./chat.css";
import { AccountCircle, Chat } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AllMemberChat = () => {
  const isLogin = useRecoilValue(isLoginState); //로그인 후 채팅을 수행하기 위해서 로그인 체크
  const [memberId, setMemberId] = useRecoilState(loginIdState); //채팅 유저 식별자로 아이디 사용
  const [chatList, setChatList] = useState([]); //채팅 메세지가 저장될 배열
  const backServer = import.meta.env.VITE_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://"); //서버의 http를 ws로 바꿈
  const [ws, setWs] = useState({}); //웹소켓 객체를 저장할 State
  const [chatMsg, setChatMsg] = useState({
    type: "enter",
    memberId: memberId,
    message: "",
  });
  const inputChatMessage = (e) => {
    setChatMsg({ ...chatMsg, message: e.target.value });
  };
  useEffect(() => {
    if (isLogin) {
      const socket = new WebSocket(`${socketServer}/allChat`);
      setWs(socket);
      //useEffect() 함수 내부의 return함수는 해당 컴포넌트가 언마운트(사라짐) 될 때 동작 할 코드를 작성
      return () => {
        socket.close();
      };
    }
  }, []);
  const startChat = () => {
    console.log("웹소켓 연결 시 실행되는 함수");
    //웹소켓으로 데이터를 전송 시 문자열로 전송
    //우리가 보내고 싶은 데이터는 객체 => 문자열로 변환해서 전송
    const data = JSON.stringify(chatMsg); //객체를 문자열로 변환
    ws.send(data);
    //최초 접속 메세지를 보낸 후에는 계속 채팅메세지만 전송 할 예정으로 type변경
    setChatMsg({ ...chatMsg, type: "chat" });
  };
  const receiveMessage = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    console.log(receiveData);
    const data = JSON.parse(receiveData.data); //문자열을 자바스크립트 객체 타입으로 변환
    console.log(data);
    setChatList([...chatList, data]);
  };
  console.log(chatList);
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };
  ws.onopen = startChat;
  ws.onmessage = receiveMessage;
  ws.onclose = endChat;
  const sendMessage = () => {
    if (chatMsg.message !== "") {
      const data = JSON.stringify(chatMsg);
      ws.send(data);
      setChatMsg({ ...chatMsg, message: "" });
    }
  };
  const chatDiv = useRef(null);
  useEffect(() => {
    if (chatDiv.current) {
      chatDiv.current.scrllTop = chatDiv.current.scrllHeight;
    }
  }, [chatList]);
  return (
    <section className="section chat-wrap">
      <div className="page-title">전체회원 채팅</div>
      {isLogin ? (
        <div className="chst-content-wrap">
          <div className="chat-message-area" ref={chatDiv}>
            {chatList.map((chat, index) => {
              return (
                <div key={"chat-" + index}>
                  {chat.type === "enter" ? (
                    <p className="info">
                      <span>{chat.memberId}</span>님이 입장하셨습니다.
                    </p>
                  ) : chat.type === "out" ? (
                    <p className="info">
                      <span>{chat.memberId}</span>님이 퇴장하셨습니다.
                    </p>
                  ) : (
                    <div
                      className={
                        chat.memberId === memberId ? "chat right" : "chat left"
                      }
                    >
                      <div className="user">
                        <AccountCircleIcon />
                        <span className="chat-id">{chat.memberId}</span>
                      </div>
                      <div className="chat-message">{chat.message}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="message-input-box">
            <div className="input-item">
              <input
                type="text"
                id="chat-message"
                value={chatMsg.message}
                onChange={inputChatMessage}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <button className="btn-primary" onClick={sendMessage}>
                전송
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-info-wrap">
          <h3>로그인 후 이용 가능합니다</h3>
          <Link to="/member/login">로그인 하러가기</Link>
        </div>
      )}
    </section>
  );
};

export default AllMemberChat;
