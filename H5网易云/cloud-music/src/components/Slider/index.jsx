import * as React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper'

import 'swiper/css'
import 'swiper/css/pagination'

import { SliderContainer } from './style'

const Slider = ({ bannerList }) => {
  return (
    <div id="Slider_components">
      <SliderContainer>
        <div className="before"></div>
        <div className="slider-container">
          <Swiper
            loop
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 30000,
              disableOnInteraction: false
            }}
          >
            {bannerList.map((item) => (
              <SwiperSlide key={item.bannerId}>
                <div className="slider-nav">
                  <img
                    src={item.pic || item.imageUrl}
                    alt={item.typeTitle}
                    width="100%"
                    height="100%"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </SliderContainer>
    </div>
  )
}

export default React.memo(Slider)
