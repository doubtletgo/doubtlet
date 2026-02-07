'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from '../../utils/ActiveLink';
import SelectCalculator from '../SelectCalculator';

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);

  // Navbar
  const toggleNavbar = useCallback(() => {
    setCollapsed(!collapsed);
  }, [setCollapsed, collapsed]);

  useEffect(() => {
    let elementId = document.getElementById('navbar');
    const listener = () => {
      if (window.scrollY > 170) {
        elementId?.classList.add('is-sticky');
      } else {
        elementId?.classList.remove('is-sticky');
      }
    };

    document.addEventListener('scroll', listener);
    return () => {
      document.removeEventListener('scroll', listener);
    };
  }, []);

  const classOne = collapsed
    ? 'collapse navbar-collapse'
    : 'collapse navbar-collapse show';
  const classTwo = collapsed
    ? 'navbar-toggler navbar-toggler-right collapsed'
    : 'navbar-toggler navbar-toggler-right';

  // Initialize Google Translate Element
  const googleTranslateElementInit = useCallback(() => {
    if (typeof window.google !== 'undefined') {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    }
  }, []);

  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = googleTranslateElementInit;
      const addScript = document.createElement('script');
      addScript.setAttribute(
        'src',
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      );
      document.body.appendChild(addScript);
    }
  }, [googleTranslateElementInit]);

  return (
    <>
      <div id="navbar" className="navbar-area">
        <div id="watermark">Doubtlet</div>
        <div className="main-nav">
          <div className="container">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link className="navbar-brand print-logo" href="/">
                <img src="/images/DoubtLogo.png" alt="logo" />
              </Link>

              <button
                onClick={toggleNavbar}
                className={classTwo}
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="icon-bar top-bar"></span>
                <span className="icon-bar middle-bar"></span>
                <span className="icon-bar bottom-bar"></span>
              </button>

              <div className={classOne} id="navbarSupportedContent">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/"
                      activeClassName="active"
                    >
                      Home
                    </Link>
                  </li>

                  <li className="nav-item">
                    <span
                      className="nav-link dropdown-toggle"
                      style={{ cursor: 'pointer' }}
                    >
                      Calculators
                    </span>
                    <ul
                      className="dropdown-menu"
                      style={{ minWidth: '300px', padding: '10px' }}
                    >
                      <li>
                        <SelectCalculator />
                      </li>
                    </ul>
                  </li>


                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/formula-sheet"
                      activeClassName="active"
                    >
                      Formula Sheet
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/blog-post"
                      activeClassName="active"
                    >
                      blogs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      href="/subjects"
                      activeClassName="active"
                    >
                      Subjects
                    </Link>
                  </li>



                  <li className="nav-item translator">
                    <div id="google_translate_element" className="d-flex fa-2x">
                      <i className="fa-solid fa-language"></i>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
