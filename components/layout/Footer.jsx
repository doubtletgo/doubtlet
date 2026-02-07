'use client';
import Link from 'next/link';

const Footer = () => {
  let currentYear = new Date().getFullYear();

  return (
    <>
      <section className="footer-area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <p>Contact Info</p>

                <ul className="footer-contact-info">
                  {/* <li className="callIcon">
                    <i className="fi fi-rr-phone-call"></i>
                    <a href="tel: +91 8426870818">+91 8426870818</a>
                    <br />
                  </li>
                  <li>
                    <i className="fi fi-rr-map-marker"></i>
                    <span>E-67-B, Pushp Vihaar,</span>
                    <span>Alwar, Rajasthan</span>
                    <span>India</span>
                  </li> */}
                  <li>
                    <i className="fa-solid fa-envelope-circle-check"></i>
                    <span>Do You Have a Question?</span>
                    <a href="mailto:doubt@doubtlet.com">doubt@doubtlet.com</a>
                  </li>

                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-footer-widget pl-5">
                <p>Quick Links</p>

                <ul className="footer-quick-links">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/formula-sheet">Formula Sheet</Link>
                  </li>
                  <li>
                    <Link href="/blog-post">Blogs</Link>
                  </li>
                  <li>
                    <Link href="/markdown">MarkDown Editor</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions">Terms & Condition</Link>
                  </li>
                </ul>
              </div>
            </div>


          </div>

          <div className="copyright-area">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-6 col-md-6">
                <p>
                  Copyright &copy;{currentYear} Doubtlet. All rights reserved by{' '}
                  <a href="https://doubtlet.com/" target="_blank">
                    Doubtlet
                  </a>
                </p>
              </div>

              <div className="col-lg-6 col-sm-6 col-md-6">
                <ul>
                  <li>
                    <Link href="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
