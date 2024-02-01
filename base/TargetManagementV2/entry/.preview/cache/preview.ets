struct preview{build(){List({ space: 10 }) {
        ForEach(this.targetList, (targetItem: TargetItem) => {
          ListItem() {
            this.ListItemBuilder(targetItem)
          }
        }, (item: TargetItem) => JSON.stringify(item))
      }.width('100%').margin({ top: 10 })}}