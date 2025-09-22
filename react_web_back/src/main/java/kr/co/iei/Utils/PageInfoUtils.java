package kr.co.iei.Utils;

import org.springframework.stereotype.Component;

@Component
public class PageInfoUtils {
	//페이징 작업에 필요한 데이터를 연산해서 하나의 객체로 리턴하는 메소드
		public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
			int end = reqPage * numPerPage;
			int start = end-numPerPage+1;
			int totalPage = (totalCount%numPerPage == 0? totalCount/numPerPage : totalCount/numPerPage+1);
			int pageNo = ((reqPage-1)/pageNaviSize)*pageNaviSize +1;
			PageInfo pi = new PageInfo(start, end, pageNo, totalPage, pageNaviSize);
			return pi;
		}
}
