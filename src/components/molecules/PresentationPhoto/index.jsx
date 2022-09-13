import Image from 'next/image';
import { useParallax } from 'react-scroll-parallax';


export default function PresentationPhoto() {
  const { ref } = useParallax({ speed: 8, easing: 'easeOut' });

  return (
    <div className="presentationPhoto">
      <h4 className="presentationPhoto__title" ref={ref}>
        Wesley dos Anjos A. de Oliveira ✌🏼
      </h4>

      <div className="presentationPhoto__container">
        <Image
          className="presentationPhoto__photo"
          src="/assets/images/wess-photo.jpg"
          alt="Foto de Wesley dos Anjos A. de Oliveira"
          layout="fill"
          // objectFit="contain"
        />
      </div>
    </div>
  );
}
