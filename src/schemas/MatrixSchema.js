export default class MatrixSchema {
  static schema = {
    name: 'Matrix',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      name: 'string',
      status: 'string',
      sync: 'bool',
    },
  };
}
