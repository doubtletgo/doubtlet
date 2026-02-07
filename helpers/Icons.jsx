import React from 'react';

const WithText = (Icon) => {
  return ({ text, ...props }) => (
    <>
      <Icon {...props} />
      {text && <span className="mx-1">{text}</span>}
    </>
  );
};

export const Whatsapp = WithText(() => (
  <i className="fa-brands fa-whatsapp"></i>
));
export const Reddit = WithText(() => <i className="fa-brands fa-reddit"></i>);
export const Telegram = WithText(() => <i className="fab fa-telegram"></i>);
export const YouTube = WithText(() => <i className="fab fa-youtube"></i>);
export const Instagram = WithText(() => <i className="fab fa-linkedin"></i>);
export const Facebook = WithText(() => <i className="fab fa-facebook-f"></i>);
export const SocialMedia = WithText(() => (
  <i className="flaticon-social-media"></i>
));
export const email = WithText(() => <i className="flaticon-email"></i>);
export const Location = WithText(() => <i className="flaticon-marker"></i>);
export const Phone = WithText(() => (
  <i className="flaticon-phone-call call"></i>
));
