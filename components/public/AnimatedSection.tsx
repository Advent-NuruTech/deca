"use client";

// components/AnimatedSection.jsx
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";

type AnimatedSectionProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "jump";
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
};

const AnimatedSection = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  className = "",
  threshold = 0.1,
  once = true,
}: AnimatedSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: threshold,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 50, x: 0 };
      case "down":
        return { y: -50, x: 0 };
      case "left":
        return { x: 50, y: 0 };
      case "right":
        return { x: -50, y: 0 };
      case "fade":
        return { opacity: 0 };
      case "jump":
        return { y: 36, scale: 0.96 };
      default:
        return { y: 50, x: 0 };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      ...(prefersReducedMotion ? {} : getInitialPosition()),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: delay,
        ...(direction === "jump" && !prefersReducedMotion
          ? { type: "spring", stiffness: 235, damping: 19, mass: 0.72 }
          : { ease: [0.22, 1, 0.36, 1] }),
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
