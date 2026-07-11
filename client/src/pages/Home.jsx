import Hero from "../components/Hero";
import FeaturedCollections from "../components/FeaturedCollections";
import BestSellers from "../components/BestSellers";
import Craftsmanship from "../components/Craftsmanship";
import FeaturedVideo from "../components/FeaturedVideo";
import Testimonials from "../components/Testimonials";
import InstagramGallery from "../components/InstagramGallery";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <Craftsmanship />
      <FeaturedVideo />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
};

export default Home;
