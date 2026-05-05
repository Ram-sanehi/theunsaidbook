import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { chapters } from "../data/chapters";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Girl Who Forgot Her Earrings — Raj Vishwakarma" },
      { name: "description", content: "She forgot her earrings. He kept them forever." },
    ],
  }),
  component: CoverPage,
});

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: 8 + Math.floor(Math.random() * 84),
  top: 8 + Math.floor(Math.random() * 84),
  dur: 3.5 + (i % 4) * 0.7,
  delay: (i % 6) * 0.5,
  op: 0.2 + (i % 3) * 0.1,
  size: 2 + (i % 3),
}));

function CoverPage() {
  const navigate = useNavigate();
  const [lastChapter, setLastChapter] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof sessionStorage !== "undefined") {
      return !sessionStorage.getItem("tgwfhe_intro_seen");
    }
    return true;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (showIntro) {
      const hideIntro = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("tgwfhe_intro_seen", "true");
      }, 6000);

      return () => clearTimeout(hideIntro);
    }
  }, [showIntro]);

  useEffect(() => {
    const s = localStorage.getItem("tgwfhe_currentChapter");
    if (s) setLastChapter(s);
  }, []);

  const goToChapters = () => navigate({ to: "/chapters" });
  const resume = () =>
    lastChapter && navigate({ to: "/read/$chapterId", params: { chapterId: lastChapter } });

  const lastCh = lastChapter ? chapters.find((c) => c.id === lastChapter) : null;

  return (
    <div
      className="cover-page"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "0.5rem 0.5rem 1rem",
        boxSizing: "border-box",
      }}
    >
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "#0b0f1a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              gap: "1.5rem",
            }}
          >
            {/* Decorative gold line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.4 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{
                width: "60px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
              }}
            />

            {/* Main greeting */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                lineHeight: 2,
                color: "#e6e1d9",
                textAlign: "center",
                maxWidth: "480px",
                fontStyle: "italic",
              }}
            >
              Some stories ask you to sit with them a while.
              <br />
              This is one of those.
            </motion.p>

            {/* Subtle secondary line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
              style={{
                fontFamily: "'Palatino Linotype', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c9a96e",
              }}
            >
              breathe.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold particles */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="gold-particle"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animation: `particle-float ${p.dur}s ${p.delay}s ease-in-out infinite`,
              "--op": p.op,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Cover Image */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          flex: "1 1 0",
          minHeight: 0,
          maxHeight: "calc(100vh - 7rem)",
          width: "100%",
          maxWidth: "640px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 0,
        }}
      >
        <img
          src="/images/coverpage.png"
          alt="The Girl Who Forgot Her Earrings"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
            borderRadius: "12px",
          }}
        />
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{
          flexShrink: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {lastCh ? (
          <>
            <button className="cover-begin-btn" onClick={resume}>
              Continue Reading
            </button>
          </>
        ) : (
          <button
            className="cover-begin-btn"
            onClick={() =>
              navigate({ to: "/read/$chapterId", params: { chapterId: chapters[0].id } })
            }
          >
            Begin Reading
          </button>
        )}
      </motion.div>
    </div>
  );
}
