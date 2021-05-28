// TODO: se livrar dessas variavies globais
// TODO: "NP VP" === "VP NP" ???? Se sim, entao tem que implementar logica pra prever isso
// TODO: consider making 2 implementations to see which one has better performance
// first implementation should calculate 'count' and 'weight' of each rule as soon
// as they are created. the second implementation should only calculate these
// parameters if the user actually asks for it (probably the better solution)
// if we calculate the probability on-demand, then we dont need the 'weight' property
import * as fs from 'fs'
export const rules: Rule = {}
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

// TODO: change name of the function based on its functionality
// here we are creating an object AND initializing its counter
export function updateCountLHS(lhs: string): void {
  // if property already exists in the 'rules' object, then only increase counter
  // othertwise, creates property and initialize it
  if (rules[lhs]) {
    rules[lhs].lhsCount += 1
  } else {
    rules[lhs] = {rhs: {}, lhsCount: 1}
  }
}

export function updateCountRHS(lhs: string, isTerminal: boolean, rhs: string): void {
  if (rules[lhs].rhs[(rhs as string)]) {
    // if rhs already exists, then increase counter
    rules[lhs].rhs[(rhs as string)].rhsCount += 1
  } else {
    // otherwise, initialize counter with 1
    rules[lhs].rhs[(rhs as string)] = {rhsCount: 1, weight: 1, isTerminal}
  }
}

export function addToRules(rule: { lhs: string; isTerminal: boolean; rhs: string[][] }): void {
  updateCountLHS(rule.lhs)

  rule.rhs.forEach(r => {
    let formatedRHS = ''
    for (let i = 0; i < r.length - 1; i++) {
      formatedRHS = formatedRHS + r[i] + ' '
    }
    formatedRHS += r[r.length - 1]

    updateCountRHS(rule.lhs, rule.isTerminal, formatedRHS)
  })
}

export function extractRules(exp: Array<SExpression>): void {
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

      addToRules({lhs, isTerminal, rhs})
    } else if (isList) {
      extractRules((exp[i] as Array<SExpression>))
    }
  }
}

export function getRuleStats(lhs: string, rhs: string): RuleStats {
  return rules[lhs].rhs[rhs]
}

export function setRuleWeight(lhs: string, rhs: string, weight: number): void {
  const ruleStats: RuleStats = getRuleStats(lhs, rhs)
  ruleStats.weight = weight
}

export function getRuleWeight(rule: {lhs: string; rhs: string}): number {
  const lhsCount: number = rules[rule.lhs].lhsCount
  const rhsCount: number = rules[rule.lhs].rhs[rule.rhs].rhsCount
  return rhsCount / lhsCount
}

export function createRulesFile(name: string): void {
  const options: { flags: string; fd?: number } = {flags: 'a'}
  const rulesFile = fs.createWriteStream(`${name}.rules`, options)
  if (!name) options.fd = 1 // if we are using stdout, then set filedescriptor to 1 (default stdout)

  Object.keys(rules).forEach((l: string) => {
    const lhs = l
    Object.keys(rules[lhs].rhs).forEach((r: string) => {
      const rhs = r
      rulesFile.write(`${lhs} -> ${rhs} ${getRuleWeight({lhs, rhs})}\n`)
    })
  })

  rulesFile.end()
}

export function createLexiconFile(name: string): void {
  const options: { flags: string; fd?: number } = {flags: 'a'}
  const lexiconFile = fs.createWriteStream(`${name}.lexicon`, options)

  Object.keys(rules).forEach((l: string) => {
    const lhs = l
    Object.keys(rules[lhs].rhs).forEach((r: string) => {
      if (rules[lhs].rhs[r].isTerminal) {
        const rhs = r
        lexiconFile.write(`${lhs} ${rhs} ${getRuleWeight({lhs, rhs})}\n`)
      }
    })
  })

  lexiconFile.end()
}

export function createWordsFile(name: string): void {
  const options: { flags: string; fd?: number } = {flags: 'a'}
  const wordsFile = fs.createWriteStream(`${name}.words`, options)
  if (!name) options.fd = 1 // if we are using stdout, then set filedescriptor to 1 (default stdout)

  Object.keys(rules).forEach((l: string) => {
    const lhs = l
    Object.keys(rules[lhs].rhs).forEach((r: string) => {
      if (rules[lhs].rhs[r].isTerminal) {
        wordsFile.write(`${r}\n`)
      }
    })
  })

  wordsFile.end()
}
