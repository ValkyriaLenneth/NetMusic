import React,{useEffect, useState} from "react";
import {SliderContainer} from './style';
import Swiper from "swiper";
import 'swiper/css/swiper.css';


function Slider(props) {
    // react hook: state
    const [sliderSwiper, setSliderSwiper] = useState(null);
    const {bannerList} = props;

    useEffect(() => {
        if(bannerList.length && !sliderSwiper){
            // init sliderSwiper
            let sliderSwiper = new Swiper(".slider-container", {
            //    init new Slider
                loop: true,
                autoplay: true,
                autoplayDisableOnInteraction: false,
                pagination: {el: '.swiper-pagination'},
            });
            setSliderSwiper(sliderSwiper);
        }
    }, [bannerList.length, sliderSwiper]); // deps: which outer values are used in hook

    return (
        <SliderContainer>
            <div className="before"></div>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {
                        bannerList.map ((slider) => {
                            return (
                                <div className="swiper-slide" key={slider.imageUrl}>
                                    <div className="slider-nav">
                                        <img src={slider.imageUrl} alt="Recommend" width="100%" height='100%'/>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="swiper-pagination"></div>
            </div>
        </SliderContainer>
    )
}

export default React.memo(Slider);