import Realm from 'realm'

export default class ArtistModel extends Realm.Object {
    id!: string
    name!: string
    updated_at!: Date

    static schema: Realm.ObjectSchema = {
        name: 'Artist',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: { type: 'string', optional: false },
            updated_at: 'date'
        }
    }
}