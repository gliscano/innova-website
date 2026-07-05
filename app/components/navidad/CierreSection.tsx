'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import WhatsAppDropdown from '@/app/components/WhatsAppDropdown'
import { LottiePlayer } from './LottiePlayer'

const CIERRE_WA_MESSAGE = 'Hola, quiero un fondo personalizado para Navidad'

export function CierreSection() {
  const [lottieActive, setLottieActive] = useState(false)

  return (
    <motion.section
      className="nv-cierre"
      aria-label="Fondos personalizados"
      onViewportEnter={() => setLottieActive(true)}
      viewport={{ once: true, amount: 0.2 }}
    >
      <LottiePlayer src="/animations/Cierre-Christmas-animation.json" className="nv-cierre__lottie" active={lottieActive} />
      <motion.div
        className="nv-cierre__content"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <p className="nv-cierre__label">¿Algo más personal?</p>
        <h2 className="nv-cierre__title">
          Diseñamos tu fondo
          <br />a medida
        </h2>
        <p className="nv-cierre__sub">
          Si no encontrás lo que buscás, creamos el fondo ideal para tu sesión. Contanos tu idea.
        </p>
        <WhatsAppDropdown
          message={CIERRE_WA_MESSAGE}
          buttonText="Hablar con Innova"
          className="nv-cierre__cta"
          iconClassName="w-4 h-4"
        />
      </motion.div>
    </motion.section>
  )
}
