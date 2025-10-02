"use client";;
import React from "react";
import { motion, AnimatePresence } from "motion/react";

export const RippleEffect = ({
  children,
  color = "rgba(255, 255, 255, 0.7)",
  duration = 0.8,
  className
}) => {
  const [ripples, setRipples] = React.useState([]);
  const containerRef = React.useRef(null);

  const handleClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const size = Math.max(rect.width, rect.height);

    const newRipple = {
      x,
      y,
      size: size * 2,
      id: Date.now(),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    setTimeout(() => {
      setRipples((prevRipples) =>
        prevRipples.filter((ripple) => ripple.id !== newRipple.id));
    }, duration * 1000);
  };

  return (
    <div
      ref={containerRef}
      className={`inline-flex relative overflow-hidden rounded-lg ${className}`}
      onMouseDown={handleClick}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              width: 0,
              height: 0,
              x: ripple.x,
              y: ripple.y,
              opacity: 0.5,
              borderRadius: "100%",
            }}
            animate={{
              width: ripple.size,
              height: ripple.size,
              x: ripple.x - ripple.size / 2,
              y: ripple.y - ripple.size / 2,
              opacity: 0,
              borderRadius: "100%",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: "easeOut" }}
            style={{
              position: "absolute",
              backgroundColor: color,
              pointerEvents: "none",
            }} />
        ))}
      </AnimatePresence>
    </div>
  );
};
