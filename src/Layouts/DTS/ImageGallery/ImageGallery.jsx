// Scanned Copies Viewer
import React from "react";
import Gallery from "react-grid-gallery";

const ImageGallery = ({images=[], title}) => {
  if(images.length > 0)
  return (
    <>
    <div style={{overflow: 'auto', height: '400px'}}>
      <span className="lead">{title}</span>
      <Gallery images={images} enableImageSelection = {false}/>
    </div>
    </>
  );
  else{
    return <></>
  }
};

export default ImageGallery;
