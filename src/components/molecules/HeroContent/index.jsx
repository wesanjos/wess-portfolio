import Image from 'next/image';
import { StructuredText } from 'react-datocms/structured-text';

export default function HeroContent({ anchor, heroInfo, photoInfo }) {
  return (
    <div className="hero-content">
      <div className="hero-content__container">
        <h1 className="name">{heroInfo.name}</h1>

        <div className="hero-content__description">
          <StructuredText data={heroInfo.text} />
        </div>

        <div className="current-work">
          <StructuredText data={heroInfo.work.content} />
        </div>

        <a href={`${anchor.linkId}`} className="view-works">
          {anchor.label}
        </a>
      </div>

      <div className="hero-content__image">
        <Image
          src={photoInfo.photo.url}
          width={photoInfo.photo.width}
          height={photoInfo.photo.height}
          alt={photoInfo.photo.alt}
          priority
        />
      </div>
    </div>
  );
}
