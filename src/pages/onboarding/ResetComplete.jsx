import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ResetComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // redirect to login
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center p-10 bg-white shadow-2xl rounded-3xl max-w-lg w-full"
      >
        {/* Icon animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="mx-auto text-primary w-20 h-20 mb-6" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold text-gray-900"
        >
          Password Reset Successful
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-600 mt-3 text-lg"
        >
          Redirecting you to login...
        </motion.p>

        {/* Animated loading dots */}
        <motion.div
          className="flex justify-center mt-6 space-x-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
                repeat: Infinity,
              },
            },
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              variants={{
                hidden: { opacity: 0.3, y: 0 },
                visible: { opacity: 1, y: -6 },
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetComplete;
