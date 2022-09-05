import Image from 'next/image';

export default function FloatingSocial() {
  return (
    <div className="floatingSocial">
      <a href="/" className="floatingSocial__link" target="_blank">
        <Image
          className="floatingSocial__icon"
          alt=""
          src="/assets/icons/github-icon.svg"
          width="40"
          height="40"
        />
      </a>
    </div>
  );
}
