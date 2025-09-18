import Header from "./component/common/Header";
import Footer from "./component/common/Footer";
import Main from "./component/common/Main";
import { Route, Routes } from "react-router-dom";
import Memberjoin from "./component/member/Memberjoin";
import MemberLogin from "./component/member/MemberLogin";
import { useState } from "react";
//export default로 내보내면 {} 안써야함 씨댕 안 그러면 오류남
function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div>
      <h1>메인 페이지</h1>
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <main className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/member/join" element={<Memberjoin />} />
          <Route
            path="/member/login"
            element={<MemberLogin setIsLogin={setIsLogin} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
