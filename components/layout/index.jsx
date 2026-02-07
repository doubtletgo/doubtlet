import Navbar from './Navbar';
import ShapesBackground from '../ShapesBackground';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <ShapesBackground />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
