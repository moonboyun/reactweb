package kr.co.iei.board.controller;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

//import org.apache.ibatis.type.Alias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
	
	
	@GetMapping(value = "/{boardNo}")
	public ResponseEntity<BoardDTO> selectOneBoard(@PathVariable int boardNo){
		BoardDTO board = boardService.selectOneBoard(boardNo);
		return ResponseEntity.ok(board);
	}
	
	@GetMapping(value = "/file/{filepath}")
	public ResponseEntity<Resource> fileDown(@PathVariable String filepath) throws FileNotFoundException{
		String savepath = root+"/board/";
		File file = new File(savepath+filepath);
							//주스트림 보조스트림 생성
		Resource resource = new InputStreamResource(new FileInputStream(file));
		HttpHeaders header = new HttpHeaders();   
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");//캐시 사용 안 할거니까 데이터를 받으러 바로 오라는설정
		
		return ResponseEntity
					.status(HttpStatus.OK)
					.headers(header)
					.contentLength(file.length())
					.contentType(MediaType.APPLICATION_OCTET_STREAM)
					.body(resource);
		
	}//fileDown
	
	@DeleteMapping(value = "/{boardNo}")//삭제하면 파일들도 지워야함
	public ResponseEntity<Integer> deleteBoard(@PathVariable int boardNo){
		BoardDTO board = boardService.deleteBoard(boardNo);
		if(board == null) {
			return ResponseEntity.ok(0);
		}else {
			//섬네일이 있는 경우 섬네일 삭제
			if(board.getBoardThumb() != null) {
				String savepath = root+"/thumb/";
				File delThumbnail = new File(savepath+board.getBoardThumb());
				delThumbnail.delete();
			}
			//첨부파일이 존재하면 첨부파일 삭제
			if(!board.getBoardFileList().isEmpty()) {
				String savepath = root+"/board/";
				for(BoardFileDTO boardFile : board.getBoardFileList()) {
					File delFile = new File(savepath+boardFile.getFilepath());
					delFile.delete();
				}
			}
			return ResponseEntity.ok(1);
		}
	}//deleteBoard
	
	@PatchMapping								//delFileNo는 
	public ResponseEntity<Integer> updateBoard(@ModelAttribute BoardDTO board,
												@ModelAttribute MultipartFile thumbnail,
												@ModelAttribute MultipartFile[] boardFile){
		if(thumbnail != null) {
			String savepath = root+"/thumb/";
			String filepath = fileUtil.upload(savepath, thumbnail);
			board.setBoardThumb(filepath);
		}
		List<BoardFileDTO> boardFileList = new ArrayList<BoardFileDTO>();
		if(boardFile != null) {
			String savepath = root+"/board/";
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtil.upload(savepath, file);
				BoardFileDTO fileDto = new BoardFileDTO();
				fileDto.setFilename(filename);
				fileDto.setFilepath(filepath);
				fileDto.setBoardNo(board.getBoardNo());
				boardFileList.add(fileDto);
			}
		}
		BoardDTO b = boardService.updateBoard(board, boardFileList);
		//섬네일 파일을 지우는 경우(기존 섬네일이 존재하는 상태에서, 새로운 섬네일이 들어온 경우)
		if(b.getBoardThumb() != null && thumbnail != null) {
			String savepath = root+"/thumb/";
			File delThumb = new File(savepath+b.getBoardThumb());
			delThumb.delete();
		}
		//삭제한 첨부파일이 있는경우 첨부파일 삭제
		if(b.getBoardFileList() != null) {
			String savepath = root+"/board/";
			for(BoardFileDTO delFile : b.getBoardFileList()) {
				File delBoardFile = new File(savepath+delFile.getFilepath());
				delBoardFile.delete();
			}
		}
		return ResponseEntity.ok(1);
	}//updateBoard
}
