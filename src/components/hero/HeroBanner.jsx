import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import heroSlides from '../../data/heroSlides'
import './HeroBanner.css'

export default function HeroBanner() {
  const { lang } = useLang()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }, [animating])

  const prev = () => goTo(current === 0 ? heroSlides.length - 1 : current - 1)
  const next = useCallback(() => goTo(current === heroSlides.length - 1 ? 0 : current + 1), [current, goTo])

  // Auto-play every 5.5s
  useEffect(() => {
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [next])

  const slide = heroSlides[current]

  return (
    <div className="hero">

      {/* Slide image */}
      <div
        className={`hero__bg ${animating ? 'hero__bg--fade' : ''}`}
        style={{ backgroundImage: `url(${slide.image})` }}
      />

      {/* Dark overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__content">
        <h1
          className="hero__title"
          data-en={slide.titleEn}
          data-fr={slide.titleFr}
        >
          {txt(slide.titleEn, slide.titleFr, lang)}
        </h1>
        <p
          className="hero__subtitle"
          data-en={slide.subtitleEn}
          data-fr={slide.subtitleFr}
        >
          {txt(slide.subtitleEn, slide.subtitleFr, lang)}
        </p>
        <a
          href={slide.btnLink}
          className="hero__btn"
          data-en={slide.btnEn}
          data-fr={slide.btnFr}
        >
          {txt(slide.btnEn, slide.btnFr, lang)}
        </a>
      </div>

      {/* Arrows */}
      <button className="hero__arrow hero__arrow--left" onClick={prev}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button className="hero__arrow hero__arrow--right" onClick={next}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      {/* Dots */}
      <div className="hero__dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

    </div>
  )
}