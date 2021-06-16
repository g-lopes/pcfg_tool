import {Command, flags} from '@oclif/command'

export default class Binarise extends Command {
  // static description = 'describe the command here'

  //   static examples = [
  //     `$ pcfg_tool hello
  // hello world from ./src/hello.ts!
  // `,
  //   ]

  static flags = {
    help: flags.help({char: 'h'}),
    paradigma: flags.string({char: 'p', description: '-p --paradigma=PARADIGMA\n Paradigma used to parse (cyk or deductive)'}),
    'initial-nonterminal': flags.string({char: 'i', description: '-i --initial-nonterminal=N\n Set N as start symbol. If not set, then the default value is ROOT'}),
    unlink: flags.string({char: 'u', description: '-u --unlink\n Replaces unknown words with UNK'}),
    smoothing: flags.string({char: 's', description: '-s --smoothing\n Replaces unknown words according to the smoothing implementation'}),
    'threshold-beam': flags.string({char: 't', description: '-t --threshold-beam=THRESHOLD\n Runs Beam-Search with THRESHOLD'}),
    'rank-beam': flags.string({char: 'r', description: '-r --rank-beam=RANK Runs Beam-Search with Beam of constant size'}),
    kbest: flags.string({char: 'k', description: '-k --kbest=K\n Outputs K best parsing trees instead of only the best'}),
    astar: flags.string({char: 'a', description: '-a --astar=PATH\n Runs A*-Search. Load outside weights from the file PATH'}),
  }

  static args = [
    {
      name: 'rulesFilePath',
      required: false,
      description: 'Path of rules file',
    },
    {
      name: 'lexiconFilePath',
      required: false,
      description: 'Path of lexicon file',
    },
    {
      name: 'sentence',
      required: false,
      description: 'Sentence to be parsed',
    },
  ];

  async run() {
    // const {args, flags} = this.parse(Hello)

    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from ./src/commands/hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}
