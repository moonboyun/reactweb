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

	BoardDTO selectOneBoard(int boardNo);

	List<BoardFileDTO> selectBoardFileList(int boardNo);

	int deleteBoard(int boardNo);

	int updateBoard(BoardDTO board);

	List<BoardFileDTO> selectDeleteBoardFileList(int[] delFileNo);

	int deleteBoardFile(int[] delFileNo);

	int adminTotalCount();

	List adminSelectBoardList(PageInfo pi);

	int adminBoardUpdate(BoardDTO board);

}
