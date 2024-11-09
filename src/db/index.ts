
import { Artist } from '@/db/Artist';
import { ArtistModel, GlobalSettingsModel, PlaylistModel, SongModel } from '@/db/models';
import { Song } from '@/db/Song';
import Realm from 'realm'

var realm = new Realm({
  path: 'OpenChord',
  schema: [
    SongModel.schema,
    ArtistModel.schema,
    PlaylistModel.schema,
    GlobalSettingsModel.schema,
  ],
  schemaVersion: 8,
  // migration: () => { }
})

export default realm;

export { Song }
export { Artist }