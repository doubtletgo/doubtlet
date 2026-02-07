
import ShapesBackground from '../ShapesBackground';


const Banner = () => (
  <>
    <div id="navbar" className="background-with-black-color subjects-navbar">
      <div className="main-nav subject-nav bg-white">
        <div className="container bg-light"></div>
      </div>
    </div>

    <div
      className="hero-banner"
      style={{
        position: 'relative',
        background: '#ffffff', // Plain white background
        overflow: 'hidden',
        paddingTop: '120px',
        paddingBottom: '100px'
      }}
    >


      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12">
            <div className="hero-content" style={{ paddingRight: '20px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span
                  className="sub-title"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    borderRadius: '30px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginRight: '10px',
                    marginBottom: '5px'
                  }}
                >
                  🔢 Smart & Simple
                </span>

                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#FEF3C7',
                    color: '#D97706',
                    borderRadius: '30px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '5px',
                    border: '1px solid #FDE68A'
                  }}
                >
                  <i className="fa-solid fa-gears" style={{ marginRight: '8px' }}></i>
                  Automate your task with us
                </span>
              </div>

              <h1
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Simplify Daily Life <br /> Calculative Tasks
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                We have designed more than <strong>200+ math calculators</strong> to help you with repeated calculations, data tables, and proper formulas.
                <br /><br />
                <span className="text-primary fw-bold">Coming Soon:</span> We are integrating Time Converters for different time zones, World Clocks, and global Sunrise/Sunset timings to further automate your daily planning.
              </p>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="row g-3">
              <div className="col-6">
                <div className="p-4 rounded-4 shadow-sm text-center" style={{ background: '#eff6ff', border: '1px solid #dbeafe', transition: 'transform 0.3s' }}>
                  <i className="fa-solid fa-calculator fa-3x mb-3" style={{ color: '#3b82f6' }}></i>
                  <h5 className="fw-bold text-dark mb-1">200+ Calculators</h5>
                  <p className="small text-muted mb-0">Math, Algebra & more</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-4 rounded-4 shadow-sm text-center" style={{ background: '#fff7ed', border: '1px solid #ffedd5', transition: 'transform 0.3s', marginTop: '2rem' }}>
                  <i className="fa-solid fa-clock fa-3x mb-3" style={{ color: '#f97316' }}></i>
                  <h5 className="fw-bold text-dark mb-1">World Clock</h5>
                  <p className="small text-muted mb-0">Accurate global times</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-4 rounded-4 shadow-sm text-center" style={{ background: '#f0fdf4', border: '1px solid #dcfce7', transition: 'transform 0.3s', marginTop: '-2rem' }}>
                  <i className="fa-solid fa-sun fa-3x mb-3" style={{ color: '#22c55e' }}></i>
                  <h5 className="fw-bold text-dark mb-1">Sun Rise/Set</h5>
                  <p className="small text-muted mb-0">Global timings</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-4 rounded-4 shadow-sm text-center" style={{ background: '#f5f3ff', border: '1px solid #ede9fe', transition: 'transform 0.3s' }}>
                  <i className="fa-solid fa-globe fa-3x mb-3" style={{ color: '#8b5cf6' }}></i>
                  <h5 className="fw-bold text-dark mb-1">Time Zones</h5>
                  <p className="small text-muted mb-0">Easy conversions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retaining original shapes for compatibility */}
      <ShapesBackground />
    </div>
  </>
);

export default Banner;
