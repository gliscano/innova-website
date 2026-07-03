'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { useGalleryImages } from '@/app/hooks/useGalleryImages'
import { useGalleryModal } from '@/app/hooks/useGalleryModal'
import { useMasonryColumns } from '@/app/hooks/useMasonryColumns'
import { distributeIntoColumns, type Cell } from '@/app/utils/masonry'
import GalleryModal from '@/app/components/gallery/GalleryModal'
import { SnowCanvas } from './SnowCanvas'
import { LottiePlayer } from './LottiePlayer'
import { getNavidadFolderPath, type NavidadCategory, type NavidadRevealAnimation } from '@/app/data/navidadCategoriesData'

const VIEWPORT = { once: true, amount: 0.15 } as const
const ITEMS_PER_PAGE = 9

const titleVariants: Record<NavidadRevealAnimation, Variants> = {
  reveal: { hidden: { clipPath: 'inset(100% 0 0 0)' }, visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } } },
  'fade-up': { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } },
  'slide-left': { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } },
  bounce: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } } },
  'blur-focus': { hidden: { opacity: 0, filter: 'blur(8px)' }, visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8 } } },
  'warm-fade': { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } },
}

const tileVariants: Record<NavidadRevealAnimation, Variants> = {
  reveal: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } },
  'fade-up': { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } },
  'slide-left': { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } },
  bounce: { hidden: { opacity: 0, scale: 0.85, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } } },
  'blur-focus': { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } },
  'warm-fade': { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } },
}

interface CategoryTileProps {
  cell: Cell
  animation: NavidadRevealAnimation
  priority?: boolean
  onOpen: (index: number) => void
}

function CategoryTile({ cell, animation, priority, onOpen }: CategoryTileProps) {
  const { image, index, ratio } = cell

  return (
    <motion.button
      type="button"
      className="nv-cat__tile"
      style={{ aspectRatio: ratio }}
      onClick={() => onOpen(index)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={tileVariants[animation]}
      aria-label={`Ver diseño ${image.display_name}`}
    >
      <Image
        src={image.url}
        alt={image.display_name}
        fill
        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
        className="nv-cat__tile-img"
        priority={priority}
      />
    </motion.button>
  )
}

interface CategorySectionProps {
  category: NavidadCategory
}

export function CategorySection({ category }: CategorySectionProps) {
  const [lottieActive, setLottieActive] = useState(false)
  const folder = getNavidadFolderPath(category)
  const columns = useMasonryColumns()

  const { images, isLoading, isLoadingMore, hasMore, loadMore } = useGalleryImages({
    folder,
    itemsPerPage: ITEMS_PER_PAGE,
  })

  const {
    isOpen: isModalOpen,
    currentIndex: modalIndex,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
  } = useGalleryModal(images)

  const columnCells = distributeIntoColumns(images, columns)

  return (
    <section
      id={category.id}
      aria-labelledby={`cat-title-${category.id}`}
      className={`nv-cat ${category.theme === 'claro' ? 'nv-cat--claro' : 'nv-cat--oscuro'}`}
    >
      <div className="nv-cat__header">
        <p className="nv-cat__eyebrow">{category.eyebrow}</p>
        <motion.h2
          id={`cat-title-${category.id}`}
          className="nv-cat__name"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={titleVariants[category.animation]}
        >
          {category.title}
        </motion.h2>
        <p className="nv-cat__desc">{category.description}</p>
      </div>

      {category.lottieSrc && (
        <motion.div onViewportEnter={() => setLottieActive(true)} viewport={{ once: true, amount: 0.2 }}>
          <LottiePlayer src={category.lottieSrc} className="nv-cat__lottie" active={lottieActive} />
        </motion.div>
      )}

      <div className="nv-cat__masonry-wrap relative">
        {category.hasSnow && <SnowCanvas className="nv-cat__snow" />}

        {isLoading && images.length === 0 && (
          <div className="nv-cat__masonry">
            {Array.from({ length: columns }, (_, col) => (
              <div key={col} className="nv-cat__col">
                {[0.8, 1.25, 1].map((ratio, i) => (
                  <div
                    key={i}
                    className="nv-cat__tile bg-black/10 animate-pulse"
                    style={{ aspectRatio: ratio }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="nv-cat__masonry">
            {columnCells.map((cells, col) => (
              <div key={col} className="nv-cat__col">
                {cells.map((cell) => (
                  <CategoryTile
                    key={cell.image.id}
                    cell={cell}
                    animation={category.animation}
                    priority={cell.index < 2 && category.order === 1}
                    onOpen={openModal}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !isLoading && (
          <div className="nv-cat__tile bg-black/10 flex items-center justify-center" style={{ height: 160 }}>
            <p className="text-xs opacity-50 px-4 text-center">Próximamente nuevos diseños en esta categoría</p>
          </div>
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          className="nv-ver-mas-btn"
          onClick={loadMore}
          disabled={isLoadingMore}
        >
          <span>{isLoadingMore ? 'Cargando…' : '+ Ver más diseños'}</span>
        </button>
      )}

      <div className="nv-cat__spacer" aria-hidden="true" />

      <GalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        initialIndex={modalIndex}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        category={category.title}
      />
    </section>
  )
}
