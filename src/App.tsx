import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ContactPage } from "./pages/ContactPage";
import { useScrollToHash } from "./hooks/useScrollToHash";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Kaybee — Visual Growth Partner",
    description: "Kaybee — photography, videography and brand content. Johannesburg based, shooting worldwide."
  },
  "/contact": {
    title: "Contact — Kaybee",
    description: "Get in touch with Kaybee — photography, videography and brand content. Johannesburg based, shooting worldwide."
  }
};

function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = PAGE_META[pathname] ?? PAGE_META["/"];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [pathname]);
}

function AppRoutes() {
  usePageMeta();
  useScrollToHash();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const forceScrollTop = () => window.scrollTo(0, 0);
    forceScrollTop();
    window.addEventListener("pageshow", forceScrollTop);
    const id = setTimeout(forceScrollTop, 0);
    return () => {
      window.removeEventListener("pageshow", forceScrollTop);
      clearTimeout(id);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
