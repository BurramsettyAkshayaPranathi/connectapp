import React from 'react';

function ImagePreview({ src, alt }) {
  if (!src) {
    return null;
  }

  return (
    <div className="image-preview-card">
      <img className="image-preview" src={src} alt={alt} />
    </div>
  );
}

export default ImagePreview;
