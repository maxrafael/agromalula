export default class MatingSchema {
  static schema = {
    name: 'Mating',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      matrix_id: { type: 'Matrix' },
      first_option_id: { type: 'Breeder' },
      second_option_id: { type: 'Breeder' },
      date: 'date',
      status: { type: 'string', default: 'ativo' },
      sync: { type: 'bool', default: false },
    },
  };
}
