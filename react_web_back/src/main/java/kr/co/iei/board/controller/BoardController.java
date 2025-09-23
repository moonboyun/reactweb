package kr.co.iei.board.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

//import org.apache.ibatis.type.Alias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.Utils.FileUtil;
import kr.co.iei.board.model.dto.BoardDTO;
import kr.co.iei.board.model.dto.BoardFileDTO;
import kr.co.iei.board.model.service.BoardService;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/board")
public class BoardController {

    
	@Autowired
	private BoardService boardService;
	@Autowired
	private FileUtil fileUtil;
	@Value("${file.root}")
	private String root;
	
	@GetMapping
	private ResponseEntity<Map> boardList(@RequestParam int reqPage){
		Map map = boardService.selectBoardList(reqPage);
		return ResponseEntity.ok(map);
	}
	//첨부파일이 포함되서 넘어오는 데이터는 @ModelAttribute
	@PostMapping(value = "/image")
	public ResponseEntity<String> ecitorImageUpload(@ModelAttribute MultipartFile image){
		String savepath = root+"/editor/";
		String filepath = fileUtil.upload(savepath, image);
		return ResponseEntity.ok(filepath);
	}
	
	@PostMapping
	public ResponseEntity<Integer> insertBoard(@ModelAttribute BoardDTO board, 
			@ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile){
		//섬네일을 첨부한 경우에만 업로드
		if(thumbnail != null) {
			String savepath = root + "/thumb/";
			String filepath = fileUtil.upload(savepath, thumbnail);
			board.setBoardThumb(filepath);
		}
		
		List<BoardFileDTO> boardFileList = new ArrayList<BoardFileDTO>();
		//첨부파일이 있으면
		if(boardFile != null) {
			String savepath = root+"/board/";
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				BoardFileDTO fileDTO = new BoardFileDTO();
				fileDTO.setFilename(filename);
				fileDTO.setFilepath(filepath);
				boardFileList.add(fileDTO);
			}
		}
		int result = boardService.insertBoard(board, boardFileList);
		return ResponseEntity.ok(result);
	}
}
