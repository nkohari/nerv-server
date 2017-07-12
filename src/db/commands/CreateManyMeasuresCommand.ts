import { Measure, Transaction } from 'src/db';
import { Command } from 'src/db/framework';

interface CreateManyMeasuresResult {
  measures: Measure[];
}

class CreateManyMeasuresCommand implements Command<CreateManyMeasuresResult> {

  measureDefs: Partial<Measure>[];

  constructor(measureDefs: Partial<Measure>[]) {
    this.measureDefs = measureDefs;
  }

  run(transaction: Transaction): Promise<CreateManyMeasuresResult> {
    return transaction.insertMany(Measure, this.measureDefs).then(measures => {
      if (!measures || measures.length === 0) {
        throw new Error('Error creating measures');
      }
      return { measures };
    });
  }

}

export default CreateManyMeasuresCommand;
