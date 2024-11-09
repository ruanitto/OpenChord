import { SupportedLanguages } from "@/hooks/language/schema"
import realm from "."
import { GlobalSettingsModel } from "@/db/models"


export class GlobalSettings extends GlobalSettingsModel {
  static get() {
    let globalSettings = realm.objects('GlobalSettings').find<GlobalSettings>(() => true)

    if (globalSettings == null) {
      realm.write(() => {
        realm.create<GlobalSettings>('GlobalSettings', {
          language: SupportedLanguages.EN_EN,
          fontSize: 14,
          showTablature: true,
          enablePageTurner: false,
        })
      })

      return realm.objects<GlobalSettings>('GlobalSettings').find<GlobalSettings>(() => true)!
    } else {
      return globalSettings
    }
  }

  static setLanguage(language: SupportedLanguages) {
    let globalSettings = this.get()

    realm.write(() => {
      globalSettings.language = language
    })
  }

  static setFontSize(fontSize: number) {
    let globalSettings = this.get()

    realm.write(() => {
      globalSettings.fontSize = fontSize
    })
  }

  static setShowTablature(showTablature: boolean) {
    let globalSettings = this.get()

    realm.write(() => {
      globalSettings.showTablature = showTablature
    })
  }

  static setEnablePageTurner(enablePageTurner: boolean) {
    let globalSettings = this.get()

    realm.write(() => {
      globalSettings.enablePageTurner = enablePageTurner
    })
  }
}