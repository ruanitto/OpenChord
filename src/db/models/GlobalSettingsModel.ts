import { SupportedLanguages } from "@/hooks/language/schema"
import Realm from 'realm'

const DEFAULTS = {
    language: SupportedLanguages.EN_EN,
    fontSize: 14,
    showTablature: true,
    enablePageTurner: false,
}

export default class GlobalSettingsModel extends Realm.Object {
    language!: SupportedLanguages
    fontSize!: number
    showTablature!: boolean
    enablePageTurner!: boolean

    static schema: Realm.ObjectSchema = {
        name: 'GlobalSettings',
        properties: {
            language: { type: 'string', default: DEFAULTS.language },
            fontSize: { type: 'int', default: DEFAULTS.fontSize },
            showTablature: { type: 'bool', default: DEFAULTS.showTablature },
            enablePageTurner: { type: 'bool', default: DEFAULTS.enablePageTurner },
        }
    }
}