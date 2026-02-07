import React from 'react';

const ContactInfo = () => {
  return (
    <section className="pt-100 pb-70">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="contact-info-box">
              <div className="icon">
                <i className="flaticon-email"></i>
              </div>
              <h3>Email Here</h3>
              <p>doubt@doubtlet.com</p>
              <p>&nbsp;</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="contact-info-box">
              <div className="icon">
                <i className="flaticon-marker"></i>
              </div>
              <h3>Location Here</h3>
              <p>E-67-B, Pushp Vihaar,</p>
              <p>Alwar, Rajasthan</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="contact-info-box">
              <div className="icon">
                <i className="flaticon-phone-call"></i>
              </div>
              <h3>Call Here</h3>
              <p>+91 8426870818</p>
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
