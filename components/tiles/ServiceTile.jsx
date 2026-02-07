import Image from 'next/image';

const ServiceTile = ({ imageSrc, heading, details, style = {} }) => (
  <div className="single-partner-item mx-3 card p-3 shadow my-3" style={style}>
    {imageSrc && (
      <div className="overview-image">
        <div className="image">
          <Image
            src={imageSrc}
            alt="service image"
            className="round-image"
            width={1280}
            height={1280}
          />
        </div>
      </div>
    )}
    <div className="single-featured-box mt-4">
      {heading && <h3>{heading}</h3>}
      {details && <span>{details}</span>}
    </div>
  </div>
);

export default ServiceTile;
