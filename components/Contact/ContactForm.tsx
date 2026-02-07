'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReCAPTCHA from 'react-google-recaptcha';
import Image from 'next/image';
const MySwal = withReactContent(Swal);

const alertContent = () => {
  MySwal.fire({
    title: 'Congratulations!',
    text: 'Your message was successfully send and will back to you soon',
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

// Form initial state
const INITIAL_STATE = {
  name: '',
  email: '',
  number: '',
  subject: '',
  text: '',
};

const ContactForm = () => {
  const [contact, setContact] = useState(INITIAL_STATE);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setContact((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        name: `${contact.name}`,
        email: `${contact.email}`,
        phone: `${contact.number}`,
        message: `${contact.text}`,
        subject: `${contact.subject}`,
      };
      await fetch('/api/queries.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-sender': 'e8ffc7759146cacbd219a2b1efda218b',
          accept: '*/*',
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      alertContent();
      setContact({
        name: '',
        email: '',
        number: '',
        subject: '',
        text: '',
      });
    } catch (error) {
      console.log(error);
    }
  };

  function onChange(value: string | null) {
    console.log('Captcha value:', value);
  }
  return (
    <div className="contact-area d-flex justify-content-center ptb-100">
      <div className="container row">
        <div className="section-title col-lg-6 col-md-12 mx-0">
          <span className="sub-title">Drop a Query</span>

          <p className="text-left">
            This form is not for asking for any subject doubts but it is just
            for website feedback. You can write to us at our email address or
            any other social media platform. We will entertain your query as
            soon as possible. Thanks for using doubtlet. While filling out this
            form, choose the most appropriate subject mentioned below and be as
            specific as possible.
            <br />
            While filling out this form, choose the most appropriate subject
            mentioned below and be as specific as possible.
          </p>
          <p className="text-left">
            <b>Technical glitches with the website or any webpage:</b> Select
            this, if you have found that some part of the website/webpage is not
            working as expected. Be specific and describe all bugs you
            encountered.
          </p>
          <p className="text-left">
            <b>{`Any Typo/Logical Mistake in calculators/notes:</b> Select this,
            if you have noticed any typo/logical error in any calculator. Don't
            forget to mention the particular calculator's name.`}</b>
          </p>
          <p className="text-left">
            <b>Any Feedback/Comment:</b> Select this, if you want to comment on
            any page of the website.
          </p>
          <p className="text-left">
            <b>Any Suggestions:</b> Select this, if you have any idea regarding
            improvement of the website or you just want to suggest a specific
            change in design/theme. Your ideas are most welcome.
          </p>
          <p className="text-left">
            <b>Request a Calculator:</b>
            {` Select this, if you didn't find the
            calculator you are looking for. Be specific and describe what
            exactly you want us to write about.`}
          </p>
          <p className="text-left">
            <b> Other:</b>{' '}
            {`Select this, if your subject didn't meet any of the
            mentioned above.`}
          </p>
        </div>
        <div className="col-lg-6 col-md-12 mt-5">
          <div className="contact-form">
            <form>
              <div className="row">
                <div className="col-lg-6 col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      value={contact.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      value={contact.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="number"
                      className="form-control"
                      placeholder="Phone"
                      value={contact.number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      value={contact.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="form-group">
                    <textarea
                      name="text"
                      cols={30}
                      rows={6}
                      className="form-control"
                      placeholder="Your Message"
                      value={contact.text}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="d-flex justify-content-center  mb-3">
            <ReCAPTCHA
              sitekey="6LcU0MwpAAAAANr8t_fFNN4IWPk-TdWXq5OMWOQk"
              onChange={onChange}
            />
          </div>
          <div className=" text-center">
            <button
              type="submit"
              className="default-btn btn-blue"
              onClick={handleSubmit}
            >
              Send Message <span></span>
            </button>
          </div>
          <div className="row align-items-center mt-4 px-3 mx-auto">
            <div className="col-lg-12 col-md-12">
              <div className="contact-image text-center">
                <Image
                  width={240}
                  height={240}
                  src="/images/contact.png"
                  alt="image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
