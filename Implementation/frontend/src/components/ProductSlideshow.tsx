import { useState, useEffect } from 'react'
import './ProductSlideshow.css'

export type Product = {
  name: string
  origin: string
  image: string
  description: string
  keywords: string[]
  imageLeft: boolean
}

interface ProductSlideshowProps {
  products: Product[]
}

export function ProductSlideshow({ products }: ProductSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay || products.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, products.length])

  if (products.length === 0) {
    return null
  }

  const current = products[currentIndex]
  const nextIndex = (currentIndex + 1) % products.length
  const prevIndex = (currentIndex - 1 + products.length) % products.length

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  const handlePrev = () => {
    setCurrentIndex(prevIndex)
    setIsAutoPlay(false)
  }

  const handleNext = () => {
    setCurrentIndex(nextIndex)
    setIsAutoPlay(false)
  }

  return (
    <div className="product-slideshow" onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)}>
      <div className="product-slideshow__main">
        {/* Main slide */}
        <div className="product-slideshow__slide" key={currentIndex}>
          <div className={`product-slideshow__content ${current.imageLeft ? '' : 'product-slideshow__content--reversed'}`}>
            <div className="product-slideshow__image-wrap">
              <img
                src={current.image}
                alt={current.name}
                className="product-slideshow__image"
              />
              {products.length > 1 && (
                <div className="product-slideshow__nav">
                  <button
                    className="product-slideshow__btn product-slideshow__btn--prev"
                    onClick={handlePrev}
                    aria-label="Previous product"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    className="product-slideshow__btn product-slideshow__btn--next"
                    onClick={handleNext}
                    aria-label="Next product"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="product-slideshow__text">
              <span className="product-slideshow__origin">{current.origin}</span>
              <h3 className="product-slideshow__name">{current.name}</h3>
              <p className="product-slideshow__desc">{current.description}</p>
              <ul className="product-slideshow__tags">
                {current.keywords.map((k) => <li key={k}>{k}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      {products.length > 1 && (
        <div className="product-slideshow__dots">
          {products.map((_, index) => (
            <button
              key={index}
              className={`product-slideshow__dot ${index === currentIndex ? 'product-slideshow__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to product ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
