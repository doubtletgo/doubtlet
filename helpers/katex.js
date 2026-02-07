import katex from 'katex';

export const types = {};

const defaultOptions = {
  displayMode: true,
  tag: 'span',
};

export const processValue = (val) => {
  if (isNaN(val) || val >= 0) return val;
  return `(${val})`;
};

export const preProcessBeforeRender = (string, args) => {
  if (!Array.isArray(args) || !string) return string;

  args.forEach((val, i) => {
    string = string.replaceAll(`{{${i}}}`, processValue(val));
  });

  return string;
};

export const renderSteps = (steps, options = {}) => {
  options = {
    ...defaultOptions,
    options,
  };

  const html = steps
    .map((step) => {
      let { type, value, args, src, alt, className } =
        typeof step === 'object' ? step : {};
      type = typeof step === 'string' ? step : type;

      if (!type || type === 'string') type = 'p';
      className = className ? `class="${className}"` : '';

      value = preProcessBeforeRender(value, args);

      switch (type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'p':
        case 'span':
        case 'td': {
          return `<${type} ${className}>${value}</${type}>`;
        }
        case 'equation': {
          return katex.renderToString(`\\sf{${value}}`, options);
        }
        case 'br':
        case 'hr':
        case 'i': {
          return `<${type} ${className} />`;
        }
        case 'img': {
          return `<br><img  src=${src} alt=${alt} ${className}/><br>`;
        }
        case 'table':
        case 'tbody':
        case 'thead':
        case 'tr': {
          return `<${type} ${className}>`;
        }
        case '/table':
        case '/tbody':
        case '/thead':
        case '/tr': {
          return `<${type}>`;
        }
        case 'raw':
          return value;
      }
    })
    .join('');

  return html;
};
