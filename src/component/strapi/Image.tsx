import { StrapiMedia } from 'InterfaceFarm/strapi';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: StrapiMedia;
}

const StrapiImage = ({ image, alt, ...props }: Props) => {
  const formats = [
    image.formats.thumbnail,
    image.formats.small,
    image.formats.medium,
    image.formats.large,
  ].filter(format => format);

  return (
    <picture {...props}>
      <img
        srcSet={formats
          .map(
            format =>
              `${
                import.meta.env.VITE_GUIDE_API_URL
              }${format?.url} ${format?.width}w`
          )
          .join(',\n')}
        sizes="(min-width: 1000px) 1000px, 750vw"
        src={`${import.meta.env.VITE_GUIDE_API_URL}${image?.url}`}
        alt={alt}
        className="w-full h-full object-contain"
      />
    </picture>
  );
};

export default StrapiImage;
