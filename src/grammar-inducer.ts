// TODO: se livrar dessas variavies globais
export const rules: any = {}
export interface RHS {
   str: string;
   count: number;
   weight: number;
}
export interface Rule {
  [lhs: string]: { [rhs: string]: RHS };
}

export type SExpression = string | Array<SExpression>;

export function addToRules(rule: { lhs: string; rhs: Array<SExpression> }): boolean {
  // Create object previously to avoid null pointer exception.
  if (!rules[rule.lhs]) {
    rules[rule.lhs] = {}
  }

  rule.rhs.forEach(r => {
    const regex = /([^,"\[\]]+)/gm
    const str = JSON.stringify(r).match(regex)
    let x = ''
    if (str.length > 0) {
      // TODO: rename variables x and str
      // TODO: see if there is a better implementation
      for (let i = 0; i < str?.length; i++) {
        if (i === x.length - 1) {
          x += str[i]
        } else {
          x = x + str[i] + ' '
        }
      }
    }

    if (rules[rule.lhs][(x as string)]) {
      // if rule already exists, then increase counter
      rules[rule.lhs][(x as string)].count += 1
    } else {
      // otherwise, initialize counter with 1
      rules[rule.lhs][(x as string)] = {count: 1, weight: 1}
    }
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

export function runMyApp(): void {
  const exp: SExpression = ['S', ['NP', 'John'], ['VP', ['V', 'hit'], ['NP', ['DET', 'the'], ['N', 'ball']]]]
  extractRules(exp)
  console.log(JSON.stringify(rules))
}
runMyApp()

