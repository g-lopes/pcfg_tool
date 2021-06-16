import {Command, flags} from '@oclif/command'

export default class Binarise extends Command {
  static description = `Reads a sequence of constituent trees from stdin and 
  returns the respective binarized version of these trees in ths stdout.`

  static examples = [
    '$ pcfg_tool binarise -h grammar.rules grammar.lexicon',
  ]

  static flags = {
    horizontal: flags.string({char: 'h', description: '-h --horizontal=H\n Horizontal markovising with H. Default: infinite (999)'}),
    vertical: flags.string({char: 'v', description: '-v --vertical=V\n Vertical markovising with V. Default: 1'}),
  }

  static args = [
    {
      name: 'trees',
      required: false,
      description: 'Sequence of constituent trees',
    },
  ];

  async run() {

  }
}
