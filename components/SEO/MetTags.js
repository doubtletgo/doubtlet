import Head from "next/head";

const MetaTags = ({ children, title, description }) => (
  <Head>
    <title>{`${title}`}</title>
    <meta name="description" content={description} />
    {children}
  </Head>
);

export default MetaTags;
