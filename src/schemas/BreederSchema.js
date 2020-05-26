export default class BreederSchema {
  static schema = {
    name: 'Breeder',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      name: 'string',
      dose: 'int',
      status: { type: 'string', default: 'ativo' },
      sync: { type: 'bool', default: false },
    },
  };
}
