//Recoil을 이용해서 애플리케이션 모든 범위에서 사용할 state를 선언
//로그인 정보는 특정 컴포넌트만 사용하는 것이 아니라 전체에 영향을 줌
//-> 로그인 관련 state눈 app.jsx에서 생성하고 필요한 부분에 하위컴포넌트로 전달하는 구조
//-> 기존 SSR에서 session의 역할을 recoil이 대신 수행

import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
//회원 아이디를 저장하는 저장소(atom)
const loginIdState = atom({
  key: "loginIdState",
  default: "",
  effects_UNSTABLE: [persistAtom], //새로고침을 대비하여 브라우저에 저장하는 옵션
});
//회원 타입을 저장하는 저장소(atom)
const memberTypeState = atom({
  key: "memberTypeState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

//selector : atom으로 생성한 데이터를 이용해서 함수를 실행하고 결과를 리턴
const isLoginState = selector({
  key: "isLoginState",
  get: (state) => {
    //매개변수 state는 recoil에 저장된 데이터를 불러오기 위한 객체
    const loginId = state.get(loginIdState);
    const memberType = state.get(memberTypeState);
    return loginId !== "" && memberType !== 0;
  },
});
export { loginIdState, memberTypeState, isLoginState };
