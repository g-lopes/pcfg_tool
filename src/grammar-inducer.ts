// TODO: se livrar dessas variavies globais
// TODO: "NP VP" === "VP NP" ???? Se sim, entao tem que implementar logica pra prever isso
// TODO: consider making 2 implementations to see which one has better performance
// first implementation should calculate 'count' and 'weight' of each rule as soon
// as they are created. the second implementation should only calculate these
// parameters if the user actually asks for it (probably the better solution)
// if we calculate the probability on-demand, then we dont need the 'weight' property
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

export type SExpression = string | Array<SExpression>;

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

// export function buildRHSString(tokens: string[]): string {
//   let rhs = ''
//   if (tokens.length > 0) {
//     for (let i = 0; i < tokens?.length; i++) {
//       rhs = rhs + tokens[i] + ' '
//     }
//     // TODO: probably there is a better implementation of this
//     // remove last whitespace from string if any
//     if (rhs[rhs.length - 1] === ' ') {
//       rhs = rhs.slice(0, -1)
//     }
//   }
//   return rhs
// }

export function addToRules(rule: { lhs: string; isTerminal: boolean; rhs: string[][] }): void {
  updateCountLHS(rule.lhs)

  rule.rhs.forEach(r => {
    let x = ''
    for (let i = 0; i < r.length - 1; i++) {
      x = x + r[i] + ' '
    }
    x += r[r.length - 1]

    updateCountRHS(rule.lhs, rule.isTerminal, x)
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

// export function getRuleProbability(rule: { lhs: string; rhs: string }): number {
//   const lhs = rule.lhs
//   const rhs = rule.rhs
//   let probability = -1

//   Object.keys(rules).forEach(l => {
//     if (l === lhs) {
//       const numberOfRulesWithSameLHS = rules[lhs].count
//       Object.keys(rules[lhs].rhs).forEach(r => {
//         if (r === rhs) {
//           const numberOfRulesWithSameLHSAndRHS = rules[lhs].rhs[rhs].count
//           probability = numberOfRulesWithSameLHSAndRHS / numberOfRulesWithSameLHS
//         }
//       })
//     }
//   })

//   return probability
// }

// export function printRuleWithProbability(rule: { lhs: string; rhs: string }): void {
//   console.log(`${rule.lhs} -> ${rule.rhs} ${getRuleProbability(rule)}`)
// }

export function runMyApp(): void {
  const exp: SExpression = ['S', ['NP', 'John'], ['NP', 'John'], ['VP', ['V', 'hit'], ['NP', ['DET', 'the'], ['N', 'ball']]]]
  extractRules(exp)
  console.log(JSON.stringify(rules))
  // // console.log(getRuleProbability({lhs: 'NP', rhs: 'John'}))
  // printRuleWithProbability({lhs: 'VP', rhs: 'V NP'})
}
runMyApp()
