import HeroSection from "./blocks/HeroSection";
import TextSection from "./blocks/TextSection";
import MediaFull from "./blocks/MediaFull";
import GallerySplit from "./blocks/GallerySplit";
import GalleryGrid from "./blocks/GalleryGrid";
import MetricsRow from "./blocks/MetricsRow";
import PullQuote from "./blocks/PullQuote";
import VideoEmbed from "./blocks/VideoEmbed";

const BLOCK_MAP = {
  pb_hero: HeroSection,
  pb_text: TextSection,
  pb_media: MediaFull,
  pb_split: GallerySplit,
  pb_grid: GalleryGrid,
  pb_metrics: MetricsRow,
  pb_quote: PullQuote,
  pb_video: VideoEmbed,
};

export default function PageBuilder({ blocks = [] }) {
  if (!blocks?.length) return null;

  return (
    <div className="page-builder">
      {blocks.map((block) => {
        const Component = BLOCK_MAP[block._type];
        if (!Component) return null;
        return <Component key={block._key} block={block} />;
      })}
    </div>
  );
}
