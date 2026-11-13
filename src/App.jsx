import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Board from "./pages/Board";
import Support from "./pages/Support";
import Qna from "./pages/Qna";
import Policy from "./pages/Policy";
import Admin from "./pages/Admin";

export default function App() {
  const [route, setRoute] = useState({ page: "home", tab: null });
  const [fontSize, setFontSize] = useState(16);
  const [selectedPost, setSelectedPost] = useState(null);

  const openPostDetail = (post) => {
    setSelectedPost(post);
    setRoute({ page: "board", tab: "board-" + post.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closePostDetail = () => {
    setSelectedPost(null);
  };

  return (
    <div style={{ fontSize: `${fontSize}px` }} className="app-root min-h-screen flex flex-col">
      <Header
        currentRoute={route}
        setRoute={(next) => {
          setSelectedPost(null);
          setRoute(next);
        }}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <main className="flex-1">
        {route.page === "home" && (
          <Home setRoute={setRoute} openPostDetail={openPostDetail} />
        )}

        {route.page === "about" && (
          <About defaultTab={route.tab || "about-greeting"} setRoute={setRoute} />
        )}

        {route.page === "services" && (
          <Services defaultTab={route.tab || "srv-admission"} setRoute={setRoute} />
        )}

        {route.page === "board" && (
          <Board
            defaultTab={route.tab || "board-notice"}
            selectedPost={selectedPost}
            openPostDetail={openPostDetail}
            closePostDetail={closePostDetail}
          />
        )}

        {route.page === "support" && (
          <Support defaultTab={route.tab || "sup-donation"} openPostDetail={openPostDetail} />
        )}

        {route.page === "qna" && (
          <Qna defaultTab={route.tab || "qna-contact"} />
        )}

        {route.page === "policy" && (
          <Policy defaultTab={route.tab || "policy-privacy"} />
        )}

        {route.page === "admin" && <Admin />}
      </main>

      <Footer setRoute={setRoute} />
    </div>
  );
}

