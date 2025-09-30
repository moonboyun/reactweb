package kr.co.iei.chat.model.service;

import java.util.HashMap;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.iei.chat.model.dto.ChatDTO;

@Component
public class AllMemberChatHandler extends TextWebSocketHandler{
	
	HashMap<WebSocketSession, String> members;
	
	public AllMemberChatHandler() {
		super();
		members = new HashMap<WebSocketSession, String>();
	}


	@Override//클라이언트가 소켓에 최초로 접속하면 자동으로 실행되는 메소드
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("session : "+session);
		System.out.println("클라이언트 접속");
	}

	
	@Override//클라이언트가 소켓으로 데이터를 전송하면 실행되는 메소드
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		//클라이언트가 보낸 메세지를 수신
		//자료형은 문자열
		String payload = message.getPayload();
		System.out.println("message : "+payload);
		//문자열 형태로 가지고 있으면 데이터를 구분해서 사용하기 어려움 => 자바 객체 형태로 변환
		ObjectMapper om = new ObjectMapper();
		ChatDTO chat = om.readValue(payload, ChatDTO.class);//문자열을 줄테니 이 클래스 타입으로 변환해줘
		System.out.println(chat);
		//최초 페이지에 접속 시 members에 추가
		if(chat.getType().equals("enter")) {
			members.put(session, chat.getMemberId());
		}
		
		//받은 메세지를 채팅에 접속한 모든 회원에게 다시 전송
		//채팅에 접속한 모든 회원은 => members에 저장
		TextMessage sendData = new TextMessage(payload);
		Set<WebSocketSession> keys = members.keySet();//키값 다 가져옴
		for(WebSocketSession s : keys) {
			s.sendMessage(sendData);
		}
	}

	@Override//클라이언트가 소켓에서 접속이 끊어지면 자동으로 실행되는 메소드
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("session : "+session);
		System.out.println("클라이언트 접속 끝");
		//members에서 지우기 전에 연결이 끊긴 아이디 꺼내옴
		String memberId = members.get(session);
		//접속이 끊어진 세션은 members에서 제거
		members.remove(session);
		ChatDTO outMessage = new ChatDTO();
		outMessage.setType("out");
		outMessage.setMemberId(memberId);
		ObjectMapper om = new ObjectMapper();
		String data = om.writeValueAsString(outMessage);//객체를 JSON형태의 문자열로 만들어줌
		TextMessage sendData = new TextMessage(data);
		Set<WebSocketSession> keys = members.keySet();//키값 다 가져옴
		for(WebSocketSession s : keys) {
			s.sendMessage(sendData);
		}
	}
	
}
