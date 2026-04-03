// components/AnimatedSection.jsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedSection = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  className = "",
  threshold = 0.1,
  once = true,
}) => {
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
      default:
        return { y: 50, x: 0 };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth easing
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
