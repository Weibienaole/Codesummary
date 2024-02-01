interface ISetting {
  name: string
  icon: Resource
  id: number
}

@Entry
@Component
struct Index {
  @State message: string = 'First Page'
  @State settings: ISetting[] = new Array(30).fill(null)
    .map((_, index) => ({ name: 'list_' + index, icon: $r('app.media.icon'), id: index }))
  @State activeIndexs: number[] = [2, 3, 5]

  @Builder ListItemBuilder(setItem: ISetting) {
    Row() {
      Row() {
        // this.activeIndexs.includes(setItem.id)
        Stack() {

          Button()
            .type(ButtonType.Circle)
            .backgroundColor('#317ff6')
            .width(30)
            .height(30)
            .margin({ right: 10 })

          Button()
            .type(ButtonType.Circle)
            .backgroundColor('#fff')
            .width(15)
            .height(15)
            .zIndex(1)
            .margin({right: 10})
        }.alignContent(Alignment.Center)

        TextPicker()

        Image(setItem.icon)
          .width(30)
          .backgroundColor('#9ece65')
          .borderRadius(15)
          .padding(5)
          .margin({ right: 15 })
        Text(setItem.name)
      }

      Blank()
      Image($r('app.media.arrow')).width(25)
    }.width('100%').padding(10).margin({ top: 10 })
  }

  build() {
    Column() {
      Row() {
        Text('设置')
          .margin({ top: 20 })
          .fontSize(20)
        Blank()
        Image($r('app.media.wlan')).width(30)
      }.width('100%').padding(10)

      List() {
        ForEach(this.settings, (setItem: ISetting) => {
          ListItem() {
            this.ListItemBuilder(setItem)
          }
        }, (setItem) => setItem.name)
      }
      .divider({
        strokeWidth: 1,
        startMargin: 30 + 15 + 5,
        endMargin: 10,
      }).height('auto').width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .height('100%')
  }
}