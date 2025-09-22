package kr.co.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.Utils.JwtUtils;
import kr.co.iei.member.model.dto.LoginMemberDTO;
import kr.co.iei.member.model.dto.MemberDTO;
import kr.co.iei.member.model.service.MemberService;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/member")
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	@Autowired
	private JwtUtils jwtUtils;
	
	@PostMapping
	public ResponseEntity<Integer> joinMember(@RequestBody MemberDTO member){
		int result = memberService.insertMember(member);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value = "/exists")
	public ResponseEntity<Integer> exists(@RequestParam String memberId){
		int result = memberService.exists(memberId);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value = "/login")
	public ResponseEntity<LoginMemberDTO> login(@RequestBody MemberDTO member){
		LoginMemberDTO loginMember = memberService.login(member);
		if(loginMember!=null) {
			return ResponseEntity.ok(loginMember);
		}else {
			return ResponseEntity.status(404).build();
		}
		
	}
	
	@GetMapping(value = "/{memberId}")
	public ResponseEntity<MemberDTO> selectOneMember(@PathVariable String memberId, @RequestHeader("Authorization") String token ){
		LoginMemberDTO loginMember = jwtUtils.checkToken(token);
		System.out.println(loginMember);
		MemberDTO member = memberService.selectOneMember(memberId);
		return ResponseEntity.ok(member);
	}
}
