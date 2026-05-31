"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface SolDeMayoProps {
  className?: string
}

// Sol de Mayo (bandera argentina) como marca de agua tenue del fondo del hero.
export function SolDeMayo({ className = "" }: SolDeMayoProps) {
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      initial={{ rotate: -6 }}
      animate={{ rotate: 6 }}
      transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <Image
        src="/images/innova/Sol_de_Mayo_Bandera_Argentina.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 400px, 560px"
        className="object-contain"
      />
    </motion.div>
  )
}
