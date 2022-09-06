import Image from 'next/image';

export default function FloatingSocial({
  linkToAction,
  callToAction,
  imageSrc,
}) {
  return (
    <div className="floatingSocial">
      <a href={linkToAction} className="floatingSocial__link" target="_blank" rel="noreferrer">
        <svg className="svg absolute" viewBox="0 0 100 100">
          <defs>
            <path
              id="circle"
              d="
              M 50, 50
              m -37, 0
              a 37,37 0 1,1 74,0
              a 37,37 0 1,1 -74,0"
            />
          </defs>
          <text dy="-7">
            <textPath xlinkHref="#circle" className="text-black versailles">
              {callToAction}
            </textPath>
          </text>
          <text dy="-7">
            <textPath
              xlinkHref="#circle"
              className="text-black versailles"
              startOffset="35%"
            >
              •
            </textPath>
          </text>
          <text dy="-7">
            <textPath
              xlinkHref="#circle"
              className="text-black versailles"
              startOffset="50%"
            >
              {callToAction}
            </textPath>
          </text>
          <text dy="-7">
            <textPath
              xlinkHref="#circle"
              className="text-black versailles"
              startOffset="85%"
            >
              •
            </textPath>
          </text>
        </svg>
        <span className="floatingSocial__overlay">
          <Image
            className="floatingSocial__icon"
            alt=""
            src={imageSrc}
            width="40"
            height="40"
          />
        </span>
      </a>
    </div>
  );
}
