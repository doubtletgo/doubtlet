'use client';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';

type TestimonialItem = {
  Id: string;
  alt_tag: string;
  country: string;
  file_path: string;
  from_data: string;
  log_details: string;
  subject: string;
};

const TestimonialCodeContent = () => {
  const [popup, setPopup] = useState(false);
  const [imgId, setImgId] = useState(0);
  const [apiImgs, setApiImgs] = useState<TestimonialItem[]>([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [visibleImages, setVisibleImages] = useState(12);
  const loadData = () => {
    fetch('https://doubt.doubtlet.com/api/testimonial.php')
      .then((res) => res.json())
      .then((data) => {
        setApiImgs(data.data);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const imgBig = (imgId: string) => {
    setPopup(true);
    setImgId(Number(imgId));
  };

  const filteredImages = apiImgs
    .filter((img: TestimonialItem) =>
      img.subject.toLowerCase().includes(filterTitle.toLowerCase())
    )
    .slice(0, visibleImages);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterTitle(e.target.value);
  };

  const handleButtonAction = () => {
    if (filteredImages.length < apiImgs.length) {
      setVisibleImages((prevVisibleImages) => prevVisibleImages + 6);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const prevImg = () => {
    setImgId((prev) => Number(prev) + 1);
  };
  const nextImg = () => {
    setImgId((prev) => Number(prev) - 1);
  };

  const imageToShow =
    filteredImages.find((apiImg) => +apiImg.Id == imgId) || filteredImages[0];
  return (
    <>
      {popup && (
        <div
          className="popusBox d-flex justify-content-between align-items-center px-5"
          key={imageToShow.Id}
        >
          <span className="deleteImg" onClick={() => setPopup(false)}>
            <i className="fa-solid fa-xmark "></i>
          </span>
          <span
            onClick={prevImg}
            style={{
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </span>
          <div className="popusImgDiv">
            <Image
              width={1280}
              height={720}
              src={imageToShow.file_path}
              alt={imageToShow.alt_tag}
            />
          </div>
          <span
            onClick={nextImg}
            style={{
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </span>
        </div>
      )}

      <div className="main-content">
        <div className="container">
          <div className="row mb-3">
            <div className="col-md-6 offset-md-3 d-flex">
              <input
                type="text"
                className="form-control mr-2"
                placeholder="Search by subject..."
                value={filterTitle}
                onChange={handleSearch}
              />
              <div className="input-group-append ">
                <button className="btn btn-primary w-100 h-100" type="button">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="imageCards">
            {filteredImages.map((apiImg) => {
              return (
                <div
                  key={apiImg.Id}
                  className="imageCard p-4"
                  onClick={() => imgBig(apiImg.Id)}
                >
                  <div className="imageCard-body ">
                    <h5 className="imageCard-title">{apiImg.subject}</h5>
                    <p>Country : {apiImg.country}</p>
                  </div>
                  <div className="imgDiv">
                    <Image
                      width={320}
                      height={180}
                      src={apiImg.file_path}
                      className="card-img-top img"
                      alt="Testimonial"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleButtonAction}
              style={{ minWidth: '150px', marginBottom: '3px' }}
            >
              {filteredImages.length < apiImgs.length
                ? 'Load More'
                : 'Go to Top'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialCodeContent;
