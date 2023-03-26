import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Link } from 'react-router-dom';

const HomehotelGallery = () => {
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = [
    {
      original: require('../img/hotels/hotel-single.jpg'),
      thumbnail: require('../img/hotels/hotel-single.jpg')
    },
    {
      original: require('../img/hotels/quadruple room.jpg'),
      thumbnail: require('../img/hotels/quadruple room.jpg')
    },
    {
      original: require('../img/hotels/standard-double-room.jpg'),
      thumbnail: require('../img/hotels/standard-double-room.jpg')
    },
    {
      original: require('../img/hotels/tripple-room.jpg'),
      thumbnail: require('../img/hotels/tripple-room.jpg')
    },
    {
      original: require('../img/hotels/twin-double-room.jpg'),
      thumbnail: require('../img/hotels/twin-double-room.jpg')
    }
  ];

  const handleImageClick = (event) => {
    setSelectedImageIndex(parseInt(event.target.getAttribute('data-index')));
    setLightboxIsOpen(true);
  };
  
  const handlePrevRequest = () => {
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };

  const handleNextRequest = () => {
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  return (
    <section>
      <div className="homehotel-moreroom">
        <Link to="/hotel/3">
          <div className="homehotel-word">查看更多房型</div>
        </Link>
      </div>
      <div className="homehotel">
        <div className="homehotel">
          {images.map((image, index) => (
            <div className="homehotel-box" key={index}>
              <div className="homehotel-zoomin" onClick={handleImageClick}>
                <img src={image.thumbnail} alt="" className="homehotel-img" data-index={index} />
              </div>
            </div>
          ))}
          {lightboxIsOpen &&
            <Lightbox
              mainSrc={images[selectedImageIndex].original}
              prevSrc={images[(selectedImageIndex - 1 + images.length) % images.length].original}
              nextSrc={images[(selectedImageIndex + 1) % images.length].original}
              onCloseRequest={() => setLightboxIsOpen(false)}
              onMovePrevRequest={handlePrevRequest}
              onMoveNextRequest={handleNextRequest}
            />
          }
        </div>
      </div>
    </section>
  );
};

export default HomehotelGallery;
