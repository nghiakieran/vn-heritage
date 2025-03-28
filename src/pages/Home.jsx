import React from 'react'
import HeroCarousel from '~/components/Home/HeroCarousel/HeroCarousel'

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <div className='container max-w-7xl mx-auto px-4 sm:px-6 pt-navbar-mobile sm:pt-navbar'>
        <h2 className='text-3xl'>Các trang còn lại</h2>
      </div>
    </>
  );
};

export default Home
