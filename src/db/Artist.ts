import { ArtistModel } from "@/db/models"
import { v4 as uuid } from 'uuid'
import realm from "."
import { Song } from "./Song"

export class Artist extends ArtistModel {
  songs() {
    console.warn(this.id)

    return Song.getByArtist(this.id!)
  }

  static getAll() { return realm.objects<Artist>('Artist').sorted('name') }

  static getByName(name: string) {
    return realm.objects<Artist>('Artist').filtered('name = $0', name).find<Artist>(() => true)
  }

  static getById(id: string) {
    return realm.objectForPrimaryKey<Artist>('Artist', id)
  }

  static delete(id: string) {
    realm.write(() => {
      realm.delete(Song.getByArtist(id))
      realm.delete(this.getById(id))
    })
  }

  static create(name: string) {
    if (name == null || name == "") {
      throw new Error(`Empty name not allowed`)
    }

    const sameNameArtist = Artist.getByName(name)

    if (sameNameArtist) {
      throw new Error(`Artist with name "${name}" already exists`)
    }

    let artist: Artist | null = null

    realm.write(() => {
      artist = realm.create<Artist>('Artist', {
        id: uuid(),
        name,
        updated_at: new Date() //.toJSON()
      })
    })

    return artist!
  }

  static update(id: string, name: string) {
    const artist = Artist.getById(id)

    if (artist) {
      if (name == artist.name) {return artist}

      const artistWithSameName = Artist.getByName(name)

      if (artistWithSameName) {
        // TODO: Merge songs to this artist
      } else {
        realm.write(() => {
          artist!.name = name
        })
      }
    }

    return artist
  }
}