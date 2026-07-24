import { useState, useEffect } from 'react';
import './Banner.css';
import { useTranslation } from 'react-i18next';

const Banner = () => {
  const { t } = useTranslation();
  const images = [
    '/portadas/portada1.png',
    '/portadas/portada2.png',
    '/portadas/portada3.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="banner">
      <div className="banner-side banner-side-left" aria-hidden="true" />
      <div className="banner-side banner-side-right" aria-hidden="true" />
  {images.map((img, index) => (
    <div
      key={index}
      className={`banner-image ${index === currentImageIndex ? "active" : ""}`}
      style={{ backgroundImage: `url(${img})` }}
    />
  ))}

  <div className="banner-content">
    <div className="banner-logo-wrapper">
      <div className="banner-reel">
        <div className="banner-reel-ring" />
      </div>
      <h1>Clip<span>Now</span></h1>
    </div>
    <p>{t('site.slogan')}</p>
  </div>
</section>

  );
};

export default Banner;
