import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + "px";
      follower.style.top = followerY + "px";
      requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
      follower.style.transform = "translate(-50%, -50%) scale(1.8)";
      follower.style.opacity = "0.2";
    };

    const onMouseLeaveLink = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      follower.style.transform = "translate(-50%, -50%) scale(1)";
      follower.style.opacity = "0.5";
    };

    document.addEventListener("mousemove", onMouseMove);
    animate();

    const links = document.querySelectorAll("a, button, [data-hover]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor"
        style={{ transition: "transform 0.3s ease, width 0.3s, height 0.3s" }}
      />
      <div
        ref={followerRef}
        className="cursor-follower"
        style={{ transition: "transform 0.4s ease, opacity 0.3s" }}
      />
    </>
  );
}
