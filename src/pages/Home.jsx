import React from 'react'
import FeatureHighlight from '~/components/Home/FeatureHighlight/FeatureHighlight'
import HeroCarousel from '~/components/Home/HeroCarousel/HeroCarousel'
import HowItWork from '~/components/Home/HowItWork/HowItWork';
import PopularHeritage from '~/components/Home/PopularHeritage/PopularHeritage'

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <div className='lcn-container'>
        <FeatureHighlight />
        <PopularHeritage />
        <HowItWork />
      </div>
    </>
  );
};

export default Home
