export default class ExpenseSchema {
  static schema = {
    name: 'Expense',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
      description: 'string',
      buyday: 'date',
      price: 'float',
      status: 'string',
      sync: 'bool',
    },
  };
}
