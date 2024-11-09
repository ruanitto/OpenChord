import type SongModel from '@/db/models/SongModel';
import type { List } from 'realm';

import Realm from 'realm';

export default class PlaylistModel extends Realm.Object {
  id!: string;
  name!: string;
  songs!: List<SongModel> | SongModel[];
  updated_at!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Playlist',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', optional: false },
      songs: { type: 'list', objectType: 'Song' },
      updated_at: 'date',
    },
  };
}
