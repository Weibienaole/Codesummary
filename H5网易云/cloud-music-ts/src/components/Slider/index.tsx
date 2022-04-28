import React, { memo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper'

import 'swiper/css'
import 'swiper/css/pagination'

import { SliderContainer } from './style'

const Slider = (props: Props.Root) => {
  const { list } = props
  return (
    <div>
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
            {list.map((item: Props.bannerItem, index) => (
              <SwiperSlide key={item.bannerId || index}>
                <div className="slider-nav">
                  <img
                    src={item.pic || item.imageUrl}
                    // alt={item.typeTitle}
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

declare module Props {
  export interface Root {
    list: bannerItem[]
  }
  export interface bannerItem {
    imageUrl: string,
    [key: string]: any
  }
}

Slider.defaltProps = {
  list: []
}


export default memo(Slider)