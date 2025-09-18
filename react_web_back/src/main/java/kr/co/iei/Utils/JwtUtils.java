package kr.co.iei.Utils;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
	@Value("${jwt.secret-key}")
	private String secretKey;
	@Value("${jwt.expire-hour}")
	private int expireHour;
	@Value("${jwt.expire-hour-refresh}")
	private int expireHourRefresh;
	
	//1시간짜리 토근 생성
	//토큰에는 최소한의 정보만
	public String createAccessToken(String memberId, int memberType) {
		//1. 작성해둔 키값을 이용해서 암호화 코드 생성
		SecretKey  key = Keys.hmacShaKeyFor(secretKey.getBytes());
		//2. 토큰 생성시간, 만료시간 설정(Date 타입)
		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();//토큰 생성시간 -> 현재시간
		c.add(Calendar.HOUR, expireHour); //캘린더 객체의 시간을 현재시간부터 만료시간만큼 연장
		Date expireTime = c.getTime(); //토큰 만료시간 -> 현재 시간부터+ 1시간뒤
		
		//3. 토큰 생성
		String token = Jwts.builder()
						.issuedAt(startTime)			//토큰발행시간
						.expiration(expireTime)			//토큰만료시간
						.signWith(key)					//암호화 서명
						.claim("memberId", memberId)	//토큰에 포함될 회원정보
						.claim("memberType", memberType)//토큰에 포함될 회원정보
						.compact();						//생성
		return token;
	}
	
	//1년짜리 토큰 생성
	public String createRefreshToken(String memberId, int memberType) {
		//1. 작성해둔 키값을 이용해서 암호화 코드 생성
				SecretKey  key = Keys.hmacShaKeyFor(secretKey.getBytes());
				//2. 토큰 생성시간, 만료시간 설정(Date 타입)
				Calendar c = Calendar.getInstance();
				Date startTime = c.getTime();//토큰 생성시간 -> 현재시간
				c.add(Calendar.HOUR, expireHourRefresh); //캘린더 객체의 시간을 현재시간부터 만료시간만큼 연장
				Date expireTime = c.getTime(); //토큰 만료시간 -> 현재 시간부터+ 1시간뒤
				
				//3. 토큰 생성
				String token = Jwts.builder()
								.issuedAt(startTime)			//토큰발행시간
								.expiration(expireTime)			//토큰만료시간
								.signWith(key)					//암호화 서명
								.claim("memberId", memberId)	//토큰에 포함될 회원정보
								.claim("memberType", memberType)//토큰에 포함될 회원정보
								.compact();						//생성
				return token;
	}
	
	
	
	
	
	
	
}
