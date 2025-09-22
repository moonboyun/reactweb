package kr.co.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.Utils.JwtUtils;
import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.dto.LoginMemberDTO;
import kr.co.iei.member.model.dto.MemberDTO;

@Service
public class MemberService {

	@Autowired
	private MemberDao memberDao;
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;

	@Transactional
	public int insertMember(MemberDTO member) { 
		String memberPw = member.getMemberPw();
		String encPw = encoder.encode(memberPw);
		member.setMemberPw(encPw);
		int result = memberDao.insertMember(member);
		return result;
	}

	public int exists(String memberId) {
		int result = memberDao.exists(memberId);
		return result;
	}

	public LoginMemberDTO login(MemberDTO member) {
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
			//이런 문법을 사용하려면 순서가 바뀌면 안 됨 null이 들어있으면 나중에 null만나면서 에러남
		if(m != null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {//일치하는 아이디가 없으면 null이 들어옴
			String accessToken = jwtUtils.createAccessToken(m.getMemberId(), m.getMemberType());
			System.out.println("한시간 토큰"+accessToken);
			String refreshToken = jwtUtils.createRefreshToken(m.getMemberId(), m.getMemberType());
			//실제 클라이언트에게 돌려주려는 정보 -> 회원아이디, 회원등급, 토큰 2개
			//member에는 암호화가 안 된 비번 m에는 암호화 비번이 들어있음
			LoginMemberDTO loginMember = new LoginMemberDTO(accessToken, refreshToken, m.getMemberId(), m.getMemberType());
				return loginMember;
		}//m != null && encoder.matches(member.getMemberPw(), m.getMemberPw())
		return null;
	}

	public MemberDTO selectOneMember(String memberId) {
		MemberDTO member = memberDao.selectOneMember(memberId);
		member.setMemberPw(null);
		return member;
	}

	@Transactional
	public int updateMember(MemberDTO member) {
		int result = memberDao.updateMember(member);
		return result;
	}

	@Transactional
	public int deleteMember(String memberId) {
		int result = memberDao.deleteMember(memberId);
		return result;
	}

	public int checkPw(MemberDTO member) {
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
		if(encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			//암호화된 패스워드 비교는 matches로 함. 앞이 평문, 뒤가 암호화
			return 1;
		}else {
			return 0;
		}
	}

	@Transactional
	public int changePw(MemberDTO member) {
		String encPw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
		int result = memberDao.changePw(member);
		return result;
	}
	
	
}
