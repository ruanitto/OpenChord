import { GlobalSettingsModel } from "@/db/models"
import { SupportedLanguages } from "@/hooks/language/schema"
import realm from "."

const DEFAULTS: Partial<GlobalSettingsModel> = {
  language: SupportedLanguages.PT_BR,
  fontSize: 14,
  showTablature: true,
  enablePageTurner: false,
}

export class GlobalSettings extends GlobalSettingsModel {
  static get() {
    const globalSettings = realm.objects('GlobalSettings').find<GlobalSettings>(() => true)

    if (globalSettings == null) {
      realm.write(() => {
        realm.create<GlobalSettings>('GlobalSettings', DEFAULTS)
      })

      return realm.objects('GlobalSettings').find<GlobalSettings>(() => true)!
    } else {
      return globalSettings
    }
  }

  static setLanguage(language: SupportedLanguages) {
    const globalSettings = this.get()

    realm.write(() => {
      globalSettings.language = language
    })
  }

  static setFontSize(fontSize: number) {
    const globalSettings = this.get()

    realm.write(() => {
      globalSettings.fontSize = fontSize
    })
  }

  static setShowTablature(showTablature: boolean) {
    const globalSettings = this.get()

    realm.write(() => {
      globalSettings.showTablature = showTablature
    })
  }

  static setEnablePageTurner(enablePageTurner: boolean) {
    const globalSettings = this.get()

    realm.write(() => {
      globalSettings.enablePageTurner = enablePageTurner
    })
  }
}