import { Language } from "@/hooks/language/schema"
import Realm from 'realm'

export default class GlobalSettingsModel extends Realm.Object {
    language!: Language
    fontSize!: number
    showTablature!: boolean
    enablePageTurner!: boolean

    static schema: Realm.ObjectSchema = {
        name: 'GlobalSettings',
        properties: {
            language: { type: 'string', default: 'pt-BR' },
            fontSize: { type: 'int', default: 14 },
            showTablature: { type: 'bool', default: true },
            enablePageTurner: { type: 'bool', default: false },
        }
    }
}