import React from 'react'
import FeatureHighlight from '~/components/Home/FeatureHighlight/FeatureHighlight'
import HeroCarousel from '~/components/Home/HeroCarousel/HeroCarousel'

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 pt-navbar-mobile sm:pt-navbar'>
        <FeatureHighlight />
      </div>
    </>
  );
};

export default Home
