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
  // TODO: implement it correctly
  // Look data structure that u want to use (u wrote on a paper)
  // console.log(rule)
  if (!rules[rule.lhs]) {
    rules[rule.lhs] = {}
  }
  rule.rhs.forEach(r => {
    // TODO: use regex!!!
    const regex = /([^,"\[\]]+)/gm
    const str = JSON.stringify(r).match(regex)
    let finalText = ''
    if (str.length > 1) {
      // TODO: rename variables x, str and finalText
      // TODO: see if there is a better implementation
      let x = ''
      for (let i = 0; i < str?.length; i++) {
        // if(i === x.length - 1) {}
        x = x + str[i] + ' '
      }
      // If last character is a whitespace, then remove it.
      if (x[x.length - 1] === ' ') {
        finalText = (x as string).slice(0, -1)
      } else {
        finalText = (x as string)
      }
    }

    rules[rule.lhs][(finalText as string)] = {count: 1, weight: 1}
  })
  // TODO: see if it makes sense to return a boolean
  // if thats the case, then fix the returned value
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
  // console.log('rules = ')
  console.log(JSON.stringify(rules))
}
runMyApp()

