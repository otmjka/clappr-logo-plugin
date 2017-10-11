const INIT = {
  media: {
    width: 0,
    height: 0
  },
  letterboxing: {
    horizontal: 0,
    vertical: 0
  }
};

export function calculateSize(original) {
  const transformed = Object.assign({}, INIT);

  // Freeze viewport height and scale video to fit vertically
  transformed.media.width = (original.media.width * original.dom.height / original.media.height);
  transformed.media.height = (original.media.height * transformed.media.width / original.media.width);

  // If it didnt't fit, freeze viewport width and scale video to fit horizontally
  if (transformed.media.width > original.dom.width) {
    transformed.media.height = (original.media.height * original.dom.width / original.media.width);
    transformed.media.width = (original.media.width * transformed.media.height / original.media.height);
  }

  // Calculate paddings for vertical or horizontal letterboxing
  if (transformed.media.width < original.dom.width) {
    transformed.letterboxing.horizontal = Math.floor((original.dom.width - transformed.media.width ) / 2);
  } else {
    if (transformed.media.height < original.dom.height) {
      transformed.letterboxing.vertical = Math.floor((original.dom.height - transformed.media.height) / 2);
    }
  }

  transformed.media.width = Math.floor(transformed.media.width);
  transformed.media.height = Math.floor(transformed.media.height);
  return transformed;
}