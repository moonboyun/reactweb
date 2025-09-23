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
}
