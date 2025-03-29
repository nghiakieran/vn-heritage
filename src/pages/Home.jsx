import React from 'react'
import FeatureHighlight from '~/components/Home/FeatureHighlight/FeatureHighlight'
import HeroCarousel from '~/components/Home/HeroCarousel/HeroCarousel'
import PopularHeritage from '~/components/Home/PopularHeritage/PopularHeritage'

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16 sm:space-y-24 sm:py-24'>
        <FeatureHighlight />
        <PopularHeritage />
      </div>
    </>
  );
};

export default Home
