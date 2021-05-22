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
  rules[rule.lhs] = rule.rhs
  return true
}

export function extractRules(exp: Array<SExpression>): void {
  for (let i = 0; i < exp.length; i++) {
    const isNonTerminal = i === 0 && typeof exp[i] === 'string'
    const isList = i !== 0 && Array.isArray(exp[i])

    if (isNonTerminal) {
      const lhs: string = (exp[i] as string)
      const rhs: string[] = []

      for (let j = 1; j < exp.length; j++) {
        if (Array.isArray(exp[j])) {
          rhs.push(((exp[j] as Array<SExpression>)[0] as string))
        }  else if (typeof exp[j] === 'string') {
          rhs.push((exp[j] as string))
        }
      }

      addToRules({lhs, rhs})
    } else if (isList) {
      extractRules((exp[i] as Array<SExpression>))
    }
  }
}

export function runMyApp(): void {
  const exp: SExpression = ['S', ['NP', 'John'], ['VP', ['V', 'hit'], ['NP', ['DET', 'the'], ['N', 'ball']]]]
  extractRules(exp)
  console.log(rules)
}
runMyApp()

