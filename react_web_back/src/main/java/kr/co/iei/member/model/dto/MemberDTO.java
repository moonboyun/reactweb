package kr.co.iei.member.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "member")
public class MemberDTO {
	private String memberId;
	private String memberPw;
	private String memberName;
	private String memberPhone;
	private int memberType;
}
