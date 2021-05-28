// pcfg_tool induce [GRAMMAR]
// Liest eine Sequenz Konstituentenbäume von der Standardeingabe und
// gibt eine aus diesen Bäumen induzierte PCFG auf der Standardausgabe aus.
// Wird das optionale Argument GRAMMAR angegeben, dann wird die PCFG
// stattdessen in den Dateien GRAMMAR.rules, GRAMMAR.lexicon und GRAMMAR.words
// gespeichert (s. (1)).
import {Command} from '@oclif/command'
import * as fs from 'fs'
import * as readLine from 'readline'
import * as path from 'path'
import * as P from 'parsimmon'
import {createRulesFile, extractRules, rules} from '../grammar-inducer'

export const tokenizer = P.createLanguage({
  // .alt takes a array of parsers as argument and outputs
  // the value of the first one that succeeds.
  SExp: rule => P.alt(rule.NonTerminal, rule.Terminal, rule.SExpList),
  // .desc returns a new parser, whose failure msg is the string passed to it.
  NonTerminal: () => P.regexp(/[^() ]+/),
  Terminal: () => P.regexp(/[^() ]+/),
  Atom: rule => P.alt(rule.NonTerminal, rule.Terminal),
  SExpList: rule =>
    rule.SExp.trim(P.optWhitespace).many().wrap(P.string('('), P.string(')')),
  File: rule => rule.SExp.trim(P.optWhitespace).many(),
})

export async function readFileLineByLine(filePath: string) {
  let numberOfLines = 0
  let input: fs.ReadStream | NodeJS.ReadStream = process.stdin
  const absolutePath = path.resolve(filePath)
  const stream: fs.ReadStream = fs.createReadStream(absolutePath)
  input = stream

  const rl: readLine.Interface = readLine.createInterface({
    input: input,
    output: process.stdout,
    terminal: false,
  })

  for await (const line of rl) {
    // processLine
    const expression = tokenizer.File.tryParse(line)
    console.log(`${expression}/n`)
    extractRules(expression)
    numberOfLines += 1
  }
  console.log(`numerOflines = ${numberOfLines}`)
}

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
    await readFileLineByLine('./corpus/TEST.corpus').then(() => {
      console.log(rules)
      //   createRulesFile('GRAMMAR')
      //   const g: { initial: string; rules: object } = createGrammar(rules)
      //   computeWordProbability()
      //   computeRuleProbability()
      //   const {args} = this.parse(InduceCommand)
      //   createGrammarFiles(g as { initial: string; rules: object }, args.GRAMMAR)
      //   console.log(`Grammar induced using ${numberOfSentences} sentences 🤓`)
      this.exit(0)
    })
  }
}
