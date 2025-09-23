package kr.co.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.Utils.PageInfo;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;


@Mapper
public interface BoardDao {

	int totalCount();

	List selectBoardList(PageInfo pi);

	int getBoardNo();

	int insertBoard(BoardDTO board);

	int insertBoardFile(BoardFileDTO boardFile);

}
