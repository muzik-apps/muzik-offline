import { motion } from 'framer-motion';
import { FunctionComponent, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from "@icons/index";
import { SquareTitleBox, GeneralContextMenu } from '@components/index';
import { Swiper, SwiperSlide } from 'swiper/react';
import { contextMenuEnum, mouse_coOrds } from 'types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { Pagination,Navigation } from 'swiper/modules';

import "@styles/components/swipers/SwiperVanillaCards.scss";

type SwiperVanillaCardsProps = {
    cardsArr: {cover: string, title: string}[];
    prevBtnName: string;
    nextBtnName: string;
}

const SwiperVanillaCards: FunctionComponent<SwiperVanillaCardsProps> = (props: SwiperVanillaCardsProps) => {
    const swiperREF: any = useRef();//don't use type annotations
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [cardMenuToOpen, setCardMenuToOpen] = useState<{cover: string, title: string} | null>(null);

    function swipePrev(){swiperREF.current.slidePrev();}

    function swipeNext(){swiperREF.current?.slideNext();}

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_card = props.cardsArr.find((_card, index) => { return index === key; })
        setCardMenuToOpen(matching_card ? matching_card : null);
    }

    return (
        <>
            <div className='SwiperVanillaCards'>
                <motion.div className={props.prevBtnName + " slider-arrow"}  whileTap={{scale: 0.98}} onClick={swipePrev}>
                    <ChevronLeft />
                </motion.div>
                <Swiper
                    spaceBetween={30}
                    slidesPerView={4}
                    pagination={{ el: '.swiper-pagination', clickable: true }}
                    navigation={{
                        nextEl: "." + props.nextBtnName,
                        prevEl: "." + props.prevBtnName,
                    }}
                    modules={[ Pagination, Navigation]}
                    onSwiper={(swiper) => {swiperREF.current = swiper;}}
                    className="swiper-frame"
                >
                    {props.cardsArr.map((card, index) => 
                        <SwiperSlide className="swiper-slide" key={index} >
                            <SquareTitleBox 
                                title={card.title} 
                                cover={card.cover} 
                                keyV={index} 
                                setMenuOpenData={setMenuOpenData}/>
                        </SwiperSlide>
                    )}
                </Swiper>
                <motion.div className={props.nextBtnName + " slider-arrow"} whileTap={{scale: 0.98}} onClick={swipeNext}>
                    <ChevronRight />
                </motion.div>
            </div>
            {
                cardMenuToOpen && (
                    <div className="SwiperVanillaCards-ContextMenu-container" 
                    onClick={() => {
                        setCardMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setCardMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={cardMenuToOpen.title}
                            CMtype={contextMenuEnum.ChartsCM}/>
                    </div>
                )
            }
        </>
    )
}

export default SwiperVanillaCards