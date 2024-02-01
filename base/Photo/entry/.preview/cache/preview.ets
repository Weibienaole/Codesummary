struct preview{build(){List({ scroller: this.bigScrollControl, initialIndex: this.currentIndex, space: 20 }) {
          ForEach(this.photoList, (photo, index) => {
            if (
              (index >= Constants.CATCH_IMAGE_ARR.length) &&
              (index < (this.photoList.length - Constants.CATCH_IMAGE_ARR.length))
            ) {
              ListItem() {
                Image(photo).objectFit(ImageFit.Contain).width('100%').height('100%')
              }.width(this.deviceWidth)
              .margin({ bottom: 50 + this.smallPhotoWidth + 30 })
            }
          }, (_, index) => index.toString())
        }
        .width('100%')
        .height('100%')
        .listDirection(Axis.Horizontal)
        .onScroll((_, scrollState) => {
          // 惯性滑动时开始判定落点
          if (scrollState === ScrollState.Fling) {
            this.bigRefreshCurrentIndex('scroll')
          }
        })
        .onScrollStop(() => {
          this.bigRefreshCurrentIndex('stop')
        })}}