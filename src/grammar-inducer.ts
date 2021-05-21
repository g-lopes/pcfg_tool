// export interface Node { id: number; children?: number[]; value: string }
// export interface Tree {
//   [index: number]: Node;
// }
// TODO: se livrar dessas variavies globais
const rules: any = {}
let counter = 0
export interface RHS {
   str: string;
   count: number;
   weight: number;
}
export interface Rule {
  [lhs: string]: { [rhs: string]: RHS };
}

export type SExpression = string | Array<SExpression>;

// export function list2Tree(list: NestedList): Tree {
//   const tree: Tree = {}
//   if (Array.isArray(list)) {
//     for (let i = 0; i < list.length; i++) {
//       const value = list[i]
//       const index = i
//       const current = {index, value}
//       if (typeof current.value === 'string') {
//         // processAtom(current, list)
//       } else if (Array.isArray(current.value)) {
//         // list2Tree(current.value)
//         // processExpression(current);
//       }
//     }
//   }
//   return tree
// }

// function processAtom(atom, list) {
//   console.log(`${atom.value} is an atom`)
//   const id = counter
//   counter++
//   if (isTerminal(atom)) {
//     const value = atom.value
//     const index = atom.index
//     const newAtom = {id, value, index}
//     atoms[id] = newAtom
//     buildRuleFromTerminal(newAtom, list)
//   } else {
//     console.log('This atom is nonterminal.')
//     const value = atom.value
//     const index = atom.index
//     const newAtom = {id, value, index}
//     atoms[id] = newAtom
//     buildRuleFromNonterminal(newAtom, list)
//   }
// }

// function processExpression(expression) {
//   console.log(`${expression.value} is an expression`)
//   const id = counter
//   counter++
//   const value = expression
//   expressions[id] = {id, value}
// }

// function buildRuleFromNonterminal(nonterminal, list) {
//   console.log('\nBuilding rule from nonterminal: ' + JSON.stringify(nonterminal))
//   const lhs = nonterminal.value
//   const rhs = getRHS(nonterminal, list)
//   const newRule = {lhs, rhs}
//   rules.push(newRule)
// }

// function buildRuleFromTerminal(terminal, list) {
//   console.log('\nBuilding rule from terminal: ' + JSON.stringify(terminal))
//   const index = terminal.index
//   const lhs = list[0]
//   const rhs = terminal.value
//   const newRule = {lhs, rhs}
//   rules.push(newRule)
// }

// function getRHS(atom, list) {
//   let rhs = ''
//   const next = atom.index + 1
//   for (let i = next; i < list.length; i++) {
//     const current = list2[i]
//     if (typeof current === 'string') {
//       rhs = appendToRHS(rhs, current)
//     } else if (Array.isArray(current)) {
//       rhs = appendToRHS(rhs, current[0])
//     }
//     appendToRHS(rhs, current)
//   }
//   return rhs
// }

// function appendToRHS(old, appendex) {
//   if (old.length === 0) {
//     return old + appendex
//   }
//   return old + ' ' + appendex
// }

// export function getChildrenFromList(list: SExpression, rootIndex: number): string[] {
//   const children: string[] = []
//   if (Array.isArray(list)) {
//     if (list?.length === 0) return children
//     for (let i = rootIndex + 1; i < list?.length; i++) {
//       if (typeof list[i] === 'string') {
//         children.push((list[i] as string))
//       } else if (Array.isArray(list[i])) {
//         children.push(((list[i] as Array<SExpression>)[0] as string))
//       }
//     }
//   }
//   return children
// }

export function getRHS(list: Array<SExpression>): RHS {
  let str = ''
  // o index 0 eh o nonterminal, por isso comecamos o loop a
  // partir do elemento com index 1
  for (let i = 1; i < list.length; i++) {
    if (typeof list[i] === 'string') {
      str = str + ' ' + list[i]
    } else if (Array.isArray(list[i])) {
      // primeiro elemento de uma array eh sempre um nonterminal
      str = str + ' ' + list[i][0]
    }
  }
  const count = -1
  const weight = -1.0
  const rhs: RHS = {str, count, weight}

  return rhs
}

// export function addToRules(rule: Rule): void {

// }

export function isAtom(exp: SExpression): boolean {
  return typeof exp === 'string'
}

export function isTerminal(exp: SExpression): boolean {
  // TODO: tirar o 'true' da condicao abaixo
  // vale a pena criar essa funcao, ou eh mais facil executa-la dentro de extractRules?
  // acho que precisa de passar index para poder determinal se eh terminal ou nao
  // olhar email do richard com a dica
  if (isAtom(exp) && true) {
    console.log('')
  }
  return true
}

export function isLHS(): boolean {
  return true
}

export function addToRules(rule: any): boolean {
  // TODO: implementar direito
  rules[counter] = rule
  counter++
  return true
}

export function extractRules(exp: SExpression): boolean {
  for (let i = 0; i < exp.length; i++) {
    const current = exp[i]
    // const isNonterminal = i !== exp.length - 1
    const isLHS = i === 0 && typeof exp[i] === 'string'
    if (isAtom(current) && isLHS) {
      const lhs: string = (exp[i] as 'string')
      const list: Array<SExpression> = (exp as Array<SExpression>)
      const rhs: RHS = getRHS(list)
      const rule: any = {leftHandSide: lhs, rightHandSide: rhs}
      addToRules(rule)
      console.log(JSON.stringify(rules))
    }
  }
  return true
}
