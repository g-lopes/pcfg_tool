import {Command} from '@oclif/command'
import {Grammar} from '../grammar'
export class InduceCommand extends Command {
  static args = [
    {
      name: 'GRAMMAR',
      required: false,
      description: 'Name of the grammar to be created',
    },
  ];

  async run() {
    console.log('🤖 Inducing grammar...')
    const g: Grammar = Grammar.getInstance()
    await g.readFileLineByLine('./corpus/TEST.corpus').then(() => {
      // g.createWordsFile('MYGRAMMAR')
      // g.createRulesFile('MYGRAMMAR')
    })
  }
}
