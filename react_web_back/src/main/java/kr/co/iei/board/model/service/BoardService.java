package kr.co.iei.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.Utils.PageInfo;
import kr.co.iei.Utils.PageInfoUtils;
import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;


@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	@Autowired
	private PageInfoUtils pageInfoUtil;

	public Map selectBoardList(int reqPage) {
		//게시물 조회, 페이징 작업에 필요한 데이터를 모두 취합해서 되돌려 줌
		int numPerPage = 12;		//한 페이지당 게시물 수
		int pageNaviSize = 5;		//페이지 네비 길이
		int totalCount = boardDao.totalCount();
		PageInfo pi = pageInfoUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount); 
		List boardList = boardDao.selectBoardList(pi);
		Map<String, Object> map=new HashMap<String, Object>();
		map.put("boardList", boardList);
		map.put("pi", pi);
		return map;
		
	}

	@Transactional
	public int insertBoard(BoardDTO board, List<BoardFileDTO> boardFileList) {
		int boardNo = boardDao.getBoardNo();
		board.setBoardNo(boardNo);
		int result = boardDao.insertBoard(board);
		for(BoardFileDTO boardFile : boardFileList) {
			boardFile.setBoardNo(boardNo);
			result += boardDao.insertBoardFile(boardFile);
		}
		return result;
	}

	public BoardDTO selectOneBoard(int boardNo) {
		BoardDTO board = boardDao.selectOneBoard(boardNo);
		List<BoardFileDTO> boardFileList = boardDao.selectBoardFileList(boardNo);
		board.setBoardFileList(boardFileList);
		return board;
	}

	@Transactional
	public BoardDTO deleteBoard(int boardNo) {
		BoardDTO board = boardDao.selectOneBoard(boardNo);
		List<BoardFileDTO> boardFileList = boardDao.selectBoardFileList(boardNo);
		board.setBoardFileList(boardFileList);
		int result = boardDao.deleteBoard(boardNo);
		if(result > 0) {
			return board;
		}else {
			return null;
		}
		
	}

	@Transactional
	public BoardDTO updateBoard(BoardDTO board, List<BoardFileDTO> boardFileList) {
		BoardDTO b = boardDao.selectOneBoard(board.getBoardNo());
		int result = boardDao.updateBoard(board);
		//새 첨부파일이 있다면 추가하는 작업
		for(BoardFileDTO boardFile : boardFileList) {
			result += boardDao.insertBoardFile(boardFile);
		}
		//삭제한 파일이 있으면 조회 후 삭제
		if(board.getDelFileNo() != null) {
			List<BoardFileDTO> delFileList = boardDao.selectDeleteBoardFileList(board.getDelFileNo());
			b.setBoardFileList(delFileList);//삭제하기 전에 조회한 파일 목록
			result += boardDao.deleteBoardFile(board.getDelFileNo());
		}
		//수정 전 board정보, 삭제전 boarㅇFile 정보를 board타입으로 리턴
		return b;
	}

	public Map adminBoardList(int reqPage) {
		//게시물 조회, 페이징 작업에 필요한 데이터를 모두 취합해서 되돌려 줌
		int numPerPage = 12;		//한 페이지당 게시물 수
		int pageNaviSize = 5;		//페이지 네비 길이
		int totalCount = boardDao.adminTotalCount();
		PageInfo pi = pageInfoUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount); 
		List boardList = boardDao.adminSelectBoardList(pi);
		Map<String, Object> map=new HashMap<String, Object>();
		map.put("boardList", boardList);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int adminBoardUpdate(BoardDTO board) {
		int result = boardDao.adminBoardUpdate(board);
		return result;
	}
}
