const PageNavigation = (props) => {
  const pi = props.pi;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqpage;
  //paging을 하는 JSX가 저장된 배열
  const arr = new Array();
  //제일 앞으로(1페이지로 이동)
  arr.push(
    <li key="first-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          setReqPage(1);
        }}
      >
        first_page
      </span>
    </li>
  );
  // 이전 페이지(현재 요청페이지보다 -1인 페이지)
  arr.push(
    <li key="prev-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          if (reqPage !== 1) {
            setReqPage(reqPage - 1);
          }
        }}
      >
        navigate_before
      </span>
    </li>
  );
  // 페이지 숫자
  let pageNo = pi.pageNo;
  for (let i = 0; i < pi.pageNaviSize; i++) {
    arr.push(
      <li key={"page-" + i}>
        <span
          className={pageNo === reqPage ? "page-item active-page" : "page-item"}
          onClick={(e) => {
            const pageNumber = e.target.innerText;
            setReqPage(Number(pageNumber));
          }}
        >
          {pageNo}
        </span>
      </li>
    );
    pageNo++;
    if (pageNo > pi.totalPage) {
      break;
    }
  }
  // 다음 페이지(reqPage +1)
  arr.push(
    <li key="next-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          if (reqPage !== pi.totalPage) {
            setReqPage(reqPage + 1);
          }
        }}
      >
        navigate_next
      </span>
    </li>
  );
  // 제일뒤로(마지막페이지로 -> totalPage)
  arr.push(
    <li key="last-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          setReqPage(pi.totalPage);
        }}
      >
        last_page
      </span>
    </li>
  );
  return <ul className="pagination">{arr} </ul>;
};
export default PageNavigation;
