import router from '@ohos.router';
import common from '@ohos.app.ability.common';

@Entry
@Component
struct NextPage{
  @State msg: string = 'Arthas page'

  async handleBack(){
    // router.back()
    // router.pushUrl({
    //   url: '@bundle:com.example.myapplication/About/ets/pages/AboutPage'
    // })
    const want = {
      deviceId: "",
      bundleName: 'com.example.myapplication',
      abilityName: 'EntryAbilityV2'
    }
    const context = getContext(this) as common.UIAbilityContext
    console.log('starting...')
    await context.startAbility(want)
  }
  build(){
    Column(){
      Row(){
        Text('Arthas Page')
        .fontSize(50)
        .fontWeight(FontWeight.Bold)
        Button(){
          Text('Go to first Page')
            .fontSize(30)
        }.type(ButtonType.Capsule)
        .margin(20)
        .padding({left:20, right: 20, top: 10, bottom: 10})
        .onClick(this.handleBack)
      }
      Column(){
        // CheckboxGroup({group: 'checkGroup'}){
        //   Checkbox({group: 'checkGroup'}){
        //     Text('Arthas')
        //   }
        //   Checkbox({group: 'checkGroup'}){
        //     Text('Monica')
        //   }
        //   Checkbox({group: 'checkGroup'}){
        //     Text('Or')
        //   }
        // }
        DatePicker().lunar(true)
      }
    }.height('100%').width('100%')
  }
}