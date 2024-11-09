import type ArtistModel from '@/db/models/ArtistModel';

import Realm from 'realm';

export default class SongModel extends Realm.Object {
  id!: string;
  title!: string;
  content!: string;
  artist!: ArtistModel;
  transposeAmount?: number | null;
  fontSize?: number | null;
  showTablature?: boolean;
  updated_at!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      id: 'string',
      title: 'string',
      content: 'string',
      transposeAmount: 'int?',
      fontSize: 'int?',
      showTablature: 'bool?',
      artist: { type: 'object', objectType: 'Artist' },
      updated_at: 'date',
    },
  };
}
