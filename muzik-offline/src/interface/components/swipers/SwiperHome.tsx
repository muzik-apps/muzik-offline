import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination,Navigation } from 'swiper/modules';

import {artist1 ,artist2 ,artist3 ,artist4 ,artist5} from "@assets/index";
import { ChevronRight, ChevronLeft } from "@icons/index";
import { useRef } from 'react';
import { motion } from 'framer-motion';

import "@styles/components/swipers/SwiperHome.scss";

const SwiperHome = () => {
    const swiperREF: any = useRef();//don't use type annotations

    function swipePrev(){swiperREF.current.slidePrev();}

    function swipeNext(){swiperREF.current?.slideNext();}

    return (
        <div className="SwiperHome">
            <motion.div className="swiper-button-prev slider-arrow"  whileTap={{scale: 0.98}} onClick={swipePrev}>
                <ChevronLeft />
            </motion.div>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={3}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                onSwiper={(swiper) => {swiperREF.current = swiper;}}
                className="swiper-frame"
            >
                <SwiperSlide className="swiper-slide" >
                    <img src={artist1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist2} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist3} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist4} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist5} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist1} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist2} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist3} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist4} alt="slide_image" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide" >
                    <img src={artist5} alt="slide_image" />
                </SwiperSlide>
            </Swiper>
            <motion.div className="swiper-button-next slider-arrow" whileTap={{scale: 0.98}} onClick={swipeNext}>
                <ChevronRight />
            </motion.div>
        </div>
    )
}

export default SwiperHome