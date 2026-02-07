const SkeletonLoader = () => {
  return (
    <div className="container mt-5">
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="position-relative col mb-4">
            <div className="card h-100 position-relative shadow">
              <div className="card-body">
                <div className="skeleton-loader-title">
                  <div className="skeleton-loader-title-item"></div>
                  <div className="skeleton-loader-title-item"></div>
                </div>
                <div className="skeleton-loader-subtitle">
                  <div className="skeleton-loader-subtitle-item"></div>
                </div>
                <div className="mb-5">
                  <div className="skeleton-loader-text"></div>
                  <div className="skeleton-loader-text"></div>
                </div>
                <div className="skeleton-loader-button-container">
                  <div className="skeleton-loader-button"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
