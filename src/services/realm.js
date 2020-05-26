import Realm from 'realm';

import BreederSchema from '~/schemas/BreederSchema';
import BullSchema from '~/schemas/BullSchema';
import MatingSchema from '~/schemas/MatingSchema';
import MatrixSchema from '~/schemas/MatrixSchema';

export default function getRealm() {
  return Realm.open({
    deleteRealmIfMigrationNeeded: true,
    schema: [MatrixSchema, BreederSchema, MatingSchema, BullSchema],
  });
}
