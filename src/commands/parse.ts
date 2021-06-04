// ./pcfg_tool parse grammar.rules grammar.lexicon < sentences
import {Command, flags} from '@oclif/command'
import {Grammar} from '../grammar'
import * as fs from 'fs'
import {getWordProductionsFromLexiconFile} from '../utils'

async function cky(grammar: any, sentence: string, lexiconFilePath: string): Promise<Set<string>[][]> {
  const matrix: Set<string>[][] = []
  const words = sentence.split(' ')
  const lexiconFileStream: fs.ReadStream = fs.createReadStream(lexiconFilePath)
  let i = 1
  // Loop to get word production rules
  for await (const w of words) {
    matrix[i - 1] = []
    matrix[i - 1][i] = new Set<string>()
    const rules = await getWordProductionsFromLexiconFile(lexiconFileStream, w)
    console.log(`rules = ${JSON.stringify(rules)}`)
    if (rules) {
      rules.forEach(r => matrix[i - 1][i].add(r))
    }
    i += 1
  }
  // for (let r = 2; r < numberOfWordsInSentence; r++) {
  //   for (let i = 0; i < numberOfWordsInSentence - r; i++) {
  //     const j = i + r
  //     matrix[i][j] = new Set<string>()
  //     for (let m = i; m < j; m++) {
  //       const iterator1 = matrix[i][m].entries()
  //       const iterator2 = matrix[m][j].entries()
  //       for (const B of iterator1) {
  //         for (const C of iterator2) {
  //           const ruleString = `${B} ${C}`
  //           Object.keys(grammar.getRules()).forEach(l => {
  //             Object.values(grammar.getRules()[l].rhs).forEach((prod: string) => {
  //               if (grammar.getRulles()[l].rhs[prod] === ruleString) {
  //                 matrix[i][j].add(l)
  //               }
  //             })
  //           })
  //         }
  //       }
  //     }
  //   }
  // }
  console.log(`cky concluded, matrix = ${matrix}`)
  return matrix
}

export default class Parse extends Command {
  // static description = 'describe the command here'

  //   static examples = [
  //     `$ pcfg_tool hello
  // hello world from ./src/hello.ts!
  // `,
  //   ]

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // }

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
    console.log('📝 Parsing...')
    const {args, flags} = this.parse(Parse)
    const {rulesFilePath, lexiconFilePath, sentence} = args
    // console.log(`args = ${JSON.stringify(args)}`)
    // console.log(`flags = ${JSON.stringify(flags)}`)
    const g = Grammar.getInstance()

    console.log(JSON.stringify(await cky(g, 'Partners', lexiconFilePath)))
  }
}
