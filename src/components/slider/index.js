import React,{useEffect, useState} from "react";
import {SliderContainer} from './style';
import "swiper/css/swiper.css";
import Swiper from "swiper";

function Slider(props) {
    // react hook: state
    const [sliderSwiper, setSliderSwiper] = useState(null);
    const {bannerList} = props;

    useEffect(() => {
        if(bannerList.length && !sliderSwiper){
            // init sliderSwiper
            let newSliderSwiper = new Swiper(".slider-container", {
            //    init new Slider
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {el: '.swiper-pagination'},
            });
            setSliderSwiper(newSliderSwiper);
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
                                <div className="swiper-slider" key={slider.imageUrl}>
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