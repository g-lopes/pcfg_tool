// TODO: se livrar dessas variavies globais
// TODO: consider making 2 implementations to see which one has better performance
// first implementation should calculate 'count' and 'weight' of each rule as soon
// as they are created. the second implementation should only calculate these
// parameters if the user actually asks for it (probably the better solution)
// if we calculate the probability on-demand, then we dont need the 'weight' property
export const rules: any = {}
// TODO: interfaces are not being used
export interface RHS {
   str: string;
   count: number;
   weight: number;
}
export interface Rule {
  [lhs: string]: { [rhs: string]: RHS };
}

export type SExpression = string | Array<SExpression>;

export function updateCountLHS(rule: { lhs: string; rhs: Array<SExpression> }): void {
  if (rules[rule.lhs]) {
    rules[rule.lhs].count += 1
  } else {
    rules[rule.lhs] = {}
    rules[rule.lhs].rhs = {}
    rules[rule.lhs].count = 1
  }
}

export function updateCountRHS(rule: { lhs: string; rhs: Array<SExpression> }, x: string): void {
  if (rules[rule.lhs].rhs[(x as string)]) {
    // if rule already exists, then increase counter
    rules[rule.lhs].rhs[(x as string)].count += 1
  } else {
    // otherwise, initialize counter with 1
    rules[rule.lhs].rhs[(x as string)] = {count: 1, weight: 1}
  }
}

export function buildRHSString(tokens: string[]): string {
  let rhs = ''
  if (tokens.length > 0) {
    for (let i = 0; i < tokens?.length; i++) {
      rhs = rhs + tokens[i] + ' '
    }
    // TODO: probably there is a better implementation of this
    // remove last whitespace from string if any
    if (rhs[rhs.length - 1] === ' ') {
      rhs = rhs.slice(0, -1)
    }
  }
  return rhs
}

export function addToRules(rule: { lhs: string; rhs: Array<SExpression> }): boolean {
  updateCountLHS(rule)

  rule.rhs.forEach(r => {
    const regex = /([^,"\[\]]+)/gm
    const tokens = JSON.stringify(r).match(regex)
    const rhs: string = buildRHSString((tokens as string[]))

    updateCountRHS(rule, rhs)
  })
  // TODO: see if it makes sense to return a boolean
  // if thats the case, then fix the returned value
  // maybe use throw and catch to alert the user if
  // there is an error when adding a new procution rule
  return true
}

export function extractRules(exp: Array<SExpression>): void {
  for (let i = 0; i < exp.length; i++) {
    const isNonTerminal = i === 0 && typeof exp[i] === 'string'
    const isList = i !== 0 && Array.isArray(exp[i])

    if (isNonTerminal) {
      const lhs: string = (exp[i] as string)
      const x: string[] = []
      const rhs: string[][] = []

      // Loop to get rhs of production rule
      for (let j = 1; j < exp.length; j++) {
        if (Array.isArray(exp[j])) {
          x.push(((exp[j] as Array<SExpression>)[0] as string))
        }  else if (typeof exp[j] === 'string') {
          x.push((exp[j] as string))
        }
      }

      rhs.push(x)

      addToRules({lhs, rhs})
    } else if (isList) {
      extractRules((exp[i] as Array<SExpression>))
    }
  }
}

export function getRuleProbability(rule: { lhs: string; rhs: string }): number {
  const lhs = rule.lhs
  const rhs = rule.rhs
  let probability = -1

  Object.keys(rules).forEach(l => {
    if (l === lhs) {
      const numberOfRulesWithSameLHS = rules[lhs].count
      Object.keys(rules[lhs].rhs).forEach(r => {
        if (r === rhs) {
          const numberOfRulesWithSameLHSAndRHS = rules[lhs].rhs[rhs].count
          probability = numberOfRulesWithSameLHSAndRHS / numberOfRulesWithSameLHS
        }
      })
    }
  })

  return probability
}

export function printRuleWithProbability(rule: { lhs: string; rhs: string }): void {
  console.log(`${rule.lhs} -> ${rule.rhs} ${getRuleProbability(rule)}`)
}

export function runMyApp(): void {
  const exp: SExpression = ['S', ['NP', 'John'], ['NP', 'John'], ['VP', ['V', 'hit'], ['NP', ['DET', 'the'], ['N', 'ball']]]]
  extractRules(exp)
  // console.log(JSON.stringify(rules))
  // console.log(getRuleProbability({lhs: 'NP', rhs: 'John'}))
  printRuleWithProbability({lhs: 'VP', rhs: 'V NP'})
}
runMyApp()

