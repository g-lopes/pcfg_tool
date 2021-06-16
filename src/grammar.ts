import * as fs from 'fs'
import * as P from 'parsimmon'
import LineByLine = require('n-readlines')
import * as path from 'path'

export interface RuleStats {
    rhsCount: number;
    weight?: number;
    isTerminal?: boolean;
 }

export interface RHS {
   [rhs: string]: RuleStats;
 }

export interface Rule {
   [lhs: string]: {rhs: RHS; lhsCount: number};
 }

export type SExpression = string | Array<SExpression>

export type ResultSuccess<T> = { type: 'success'; value: T }

export type ResultError = { type: 'error'; error: Error }

export type Result<T> = ResultSuccess<T> | ResultError

export class Grammar {
    static instance: Grammar;

    private rules: any = {}

    // private constructor() {
    //   // console.log('constructor called!')
    // }

    public getRules(): any {
      return this.rules
    }

    public static getInstance(): Grammar {
      if (!Grammar.instance) {
        Grammar.instance = new Grammar()
      }
      return Grammar.instance
    }

    public updateCountLHS(lhs: string): void {
      // if property already exists in the 'rules' object, then only increase counter
      // othertwise, creates property and initialize it
      if (this.rules[lhs]) {
        this.rules[lhs].lhsCount += 1
      } else {
        this.rules[lhs] = {rhs: {}, lhsCount: 1}
      }
    }

    public updateCountRHS(lhs: string, isTerminal: boolean, rhs: string): void {
      if (this.rules[lhs].rhs[(rhs as string)]) {
        // if rhs already exists, then increase counter
        this.rules[lhs].rhs[(rhs as string)].rhsCount += 1
      } else {
        // otherwise, initialize counter with 1
        this.rules[lhs].rhs[(rhs as string)] = {rhsCount: 1, weight: 1, isTerminal}
      }
    }

    public addToRules(rule: { lhs: string; isTerminal: boolean; rhs: string[][] }): void {
      this.updateCountLHS(rule.lhs)

      rule.rhs.forEach(r => {
        let formatedRHS = ''
        for (let i = 0; i < r.length - 1; i++) {
          formatedRHS = formatedRHS + r[i] + ' '
        }
        formatedRHS += r[r.length - 1]

        this.updateCountRHS(rule.lhs, rule.isTerminal, formatedRHS)
      })
    }

    public extractRules(exp: Array<SExpression>): void {
      for (let i = 0; i < exp.length; i++) {
        const isNonTerminal = i === 0 && typeof exp[i] === 'string'
        const isList = i !== 0 && Array.isArray(exp[i])

        if (isNonTerminal) {
          const lhs: string = (exp[i] as string)
          const x: any[] = []
          const rhs: string[][] = []
          let isTerminal = false

          // Loop to get rhs of production rule
          for (let j = 1; j < exp.length; j++) {
            if (Array.isArray(exp[j])) {
              x.push(((exp[j] as Array<SExpression>)[0] as string))
              isTerminal = false
            }  else if (typeof exp[j] === 'string') {
              x.push((exp[j] as string))
              isTerminal = true
            }
          }

          rhs.push(x)
          this.addToRules({lhs, isTerminal, rhs})
        } else if (isList) {
          this.extractRules((exp[i] as Array<SExpression>))
        }
      }
    }

    public getRuleStats(lhs: string, rhs: string): RuleStats {
      return this.rules[lhs].rhs[rhs]
    }

    public setRuleWeight(lhs: string, rhs: string, weight: number): void {
      const ruleStats: RuleStats = this.getRuleStats(lhs, rhs)
      ruleStats.weight = weight
    }

    public getRuleWeight(rule: {lhs: string; rhs: string}): number {
      const lhsCount: number = this.rules[rule.lhs].lhsCount
      const rhsCount: number = this.rules[rule.lhs].rhs[rule.rhs].rhsCount
      return rhsCount / lhsCount
    }

    public createRulesFile(name: string): void {
      const options: { flags: string; fd?: number } = {flags: 'a'}
      const rulesFile = fs.createWriteStream(`${name}.rules`, options)
      if (!name) options.fd = 1 // if we are using stdout, then set filedescriptor to 1 (default stdout)

      Object.keys(this.rules).forEach((l: string) => {
        const lhs = l
        Object.keys(this.rules[lhs].rhs).forEach((r: string) => {
          const rhs = r
          rulesFile.write(`${lhs} -> ${rhs} ${this.getRuleWeight({lhs, rhs})}\n`)
        })
      })

      rulesFile.end()
    }

    public createLexiconFile(name: string): void {
      const options: { flags: string; fd?: number } = {flags: 'a'}
      const lexiconFile = fs.createWriteStream(`${name}.lexicon`, options)

      Object.keys(this.rules).forEach((l: string) => {
        const lhs = l
        Object.keys(this.rules[lhs].rhs).forEach((r: string) => {
          if (this.rules[lhs].rhs[r].isTerminal) {
            const rhs = r
            lexiconFile.write(`${lhs} ${rhs} ${this.getRuleWeight({lhs, rhs})}\n`)
          }
        })
      })

      lexiconFile.end()
    }

    public createWordsFile(name: string): void {
      const options: { flags: string; fd?: number } = {flags: 'a'}
      const wordsFile = fs.createWriteStream(`${name}.words`, options)
      const uniqueWords = new Set()
      if (!name) options.fd = 1 // if we are using stdout, then set filedescriptor to 1 (default stdout)

      Object.keys(this.rules).forEach((l: string) => {
        const lhs = l
        Object.keys(this.rules[lhs].rhs).forEach((r: string) => {
          if (this.rules[lhs].rhs[r].isTerminal) {
            uniqueWords.add(r)
          }
        })
      })

      for (const word of uniqueWords) {
        wordsFile.write(`${word}\n`)
      }

      wordsFile.end()
    }

    public async readFileLineByLine(filePath: string) {
      const liner = new LineByLine(path.resolve(filePath))

      let line = liner.next()

      while (line) {
        const str = line.toString('ascii')
        const expression = this.tokenizer().File.tryParse(str)[0] // index 0 is important
        this.extractRules(expression)
        line = liner.next()
      }
    }

    public tokenizer(): P.Language {
      return P.createLanguage({
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
    }
}
