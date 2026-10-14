import { motion, useReducedMotion } from "framer-motion";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: reduceMotion ? 0 : 2.5, duration: 1.0 }}
      onAnimationComplete={onComplete}
      aria-label="Loading Little Wonders"
    >
      <motion.div
        className="loader-orb"
        animate={reduceMotion ? {} : { rotate: 360, scale: [1, 1.12, 1] }}
        transition={{
          rotate: { duration: 3.0, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.2, repeat: Infinity },
        }}
      >
        {/* ✳ */}
        <img src="/preLoader.gif" alt="Loading..." width="120" height="120" />
      </motion.div>

      {/* <p>LOADING...</p> */}
      <div className="loader-track">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: reduceMotion ? 0 : 2.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
