package kr.co.iei.board.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="board")
public class BoardDTO {
	private int boardNo;
	private String boardTitle;
	private String boardThumb;
	private String boardWriter;
	private String boardContent;
	private String boardDate;
	private List<BoardFileDTO> boardFileList;
	private int[] delFileNo;
	
}
