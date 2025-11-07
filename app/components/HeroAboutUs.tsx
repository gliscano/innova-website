"use client";

import { motion } from "framer-motion";

export default function HeroAboutUs() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-3 py-3 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 opacity-50 blur-3xl" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="flex justify-center">
          <img 
            src="/svg/magic.svg" 
            alt="Magic emoji"
            className="size-6 mr-2"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              Donde la imagen cobra vida
          </h1>
        </div>
        <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
          Combinamos <strong>creatividad, tecnología e inteligencia artificial</strong>
          {" "} pero lo que realmente sabemos es que{" "}
          <span className="font-semibold text-gray-900">la verdadera magia la hacés vos.</span>
        </p>
      </motion.div>
    </section>
  )
}
