// Import statement updated to use new SSRK promotional banner image.
import React from 'react';
import srgkBanner from './ssrk-banner.png';

const HeroSection = () => {
    return (
        <div>
            <img src={srgkBanner} alt='SSRK Banner' />
        </div>
    );
};

export default HeroSection;