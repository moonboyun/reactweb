package kr.co.iei.Utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

//import org.springframework.boot.autoconfigure.ssl.SslProperties.Bundles.Watch.File;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FileUtil {

	public String upload(String savepath, MultipartFile file) {
		// 원본 파일명 추출	-> test.txt(가정)
		String filename = file.getOriginalFilename();
		//test						.txt로 분리
		//원본 파일명에서 시작부터 가장 뒤에 있는 . 앞 까지를 문자열로 가져옴 -> test
		String onlyFileName = filename.substring(0, filename.lastIndexOf("."));
		//원본 파일 명에서 가장 뒤에 있는 . 부터 끝까지를 문자열로 가져옴 -> .txt
		String extention = filename.substring(filename.lastIndexOf("."));
		//실제로 업로드 할 파일명 변수를 선언
		String filepath = null;
		//파일명이 중복되면 증가시키면서 뒤에 붙일 변수
		int count = 0;
		//파일명이 겹치치 않을 때까지 반복해서 수행
		while(true) {
			if(count == 0) {
				filepath = onlyFileName+extention; //test.txt
			}else {
				filepath = onlyFileName+"_"+count+extention;//test_1.txt
			}
			//위에서 만든 파일명이 사용중인지 체크
			File checkFile = new File(savepath+filepath);
			//해당 파일명으로 파일이 존재하지 않으면 반복문 종료
			if(!checkFile.exists()) {
				break;
			}else {
				count++;
			}
		}
		//파일명 중복체크 끝 -> 내가 없로드 할 파일 명 결정 -> 업로드 수행
		
		File uploadFile = new File(savepath+filepath);
		try {
			file.transferTo(uploadFile);
		} catch (IllegalStateException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return filepath;
	}

	public void downloadFile(String savepath, String filepath, String filename, HttpServletResponse response) {
		//실제로 다운로드 할 파일
		String downFile = savepath+filepath;
		
		try {
			//첨부파일은 현재 서버프로그램으로 읽어오기 위한 주 스트림 생성
			FileInputStream fis = new FileInputStream(downFile);
			//속도 개선을 위한 보조 스트림 생성
			BufferedInputStream bis = new BufferedInputStream(fis);
			
			//읽어온 파일을 사용자에게 내보낼 주 스트림 생성 => response 객체 내부에 존재
			ServletOutputStream sos = response.getOutputStream();
			//속도 개선을 위한 보조 스트림 생성
			BufferedOutputStream bos = new BufferedOutputStream(sos);
			
			//다운로드 할 파일 이름 처리(사용자가 받을 파일 이름)
			String resFileName = new String(filename.getBytes("UTF-8"), "ISO-8859-1");
			
			//다운로드를 위한 Http Header 설정(응답형식/파일이름)
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment;filename="+resFileName);
			
			//파일 읽어서 클라이언트에게 전송
			while(true) {
				int read = bis.read();
				if(read == -1) {
					break;
				}
				bos.write(read);
			}
			bos.close();
			bis.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
