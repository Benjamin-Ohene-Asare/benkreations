import Hero from "../../components/hero/Hero";
import Catolog from "../../components/catalog/Catalog";
import Services from "../../components/services/Services";
import Banner from "../../components/banner/Banner";
import WebApp from "../../components/webApp/WebApp";
import  WorkWithUs from "../../components/workWithUs/WorkWithUs";
import Footer from "../../components/footer/Footer";
const Home = () => {
  return (
    <div>
      <Hero />
         <Catolog/>
          
      <Services />
   
      {/* <Banner /> */}
   <WorkWithUs />
   <WebApp />
      <Footer />
    </div>
  );
};

export default Home;