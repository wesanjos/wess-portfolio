import Image from 'next/image';

export default function PresentationPhoto() {
  return (
    <div className="presentationPhoto">
      <h4 className="presentationPhoto__title">
        Wesley dos Anjos A. de Oliveira ✌🏼
      </h4>

      <div className="presentationPhoto__container">
        <Image
          className="presentationPhoto__photo"
          src="/assets/images/wess-photo.jpg"
          alt="Foto de Wesley dos Anjos A. de Oliveira"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
}
