package kr.co.iei.admin.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.member.model.dto.MemberDTO;
import kr.co.iei.member.model.service.MemberService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/admin")
public class AdminController {
	@Autowired
	private MemberService memberService;
	@Autowired
	private BoardService boardService;
	
	
	@GetMapping(value = "/member")
	public ResponseEntity<Map> adminMemberList(@RequestParam int reqPage){
		Map map = memberService.adminMemberList(reqPage);
		
		return ResponseEntity.ok(map);
	}
	
	@PatchMapping(value = "/member")
	public ResponseEntity<Integer> adminMemberUpdate(@RequestBody MemberDTO member){
		int result = memberService.updateMemberType(member);
		
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/board")
	public ResponseEntity<Map> adminBoardList(@RequestParam int reqPage){
		Map map = boardService.adminBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	
	@PatchMapping(value = "/board")
	public ResponseEntity<Integer> adminBoardUpdate(@RequestBody BoardDTO board){
		int result = boardService.adminBoardUpdate(board);
		return ResponseEntity.ok(result);
	}
}
