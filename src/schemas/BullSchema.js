export default class BullSchema {
  static schema = {
    name: 'Bull',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      name: 'string',
      birthday: 'date',
      status: 'string',
      sync: 'bool',
    },
  };
}
