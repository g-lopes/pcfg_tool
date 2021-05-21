// import {NestedList, getChildrenFromList, getRHS} from '../src/grammar-inducer'
import {RHS, Rule, isAtom, SExpression, isTerminal, extractRules} from '../src/grammar-inducer'

// test('isTerminal returns true when symbol is a termninal', () => {
//   const terminal: Node = {id: 1, children: undefined, value: 'hit'}
//   expect(isTerminal(terminal)).toBeTruthy()
// })

// test('isTerminal returns false when symbol is a nonterminal', () => {
//   const nonTerminal: Node = {id: 0, children: [1], value: 'V'}
//   expect(isTerminal(nonTerminal)).toBeFalsy()
// })

// test('list2Tree([V hit]) returns {}', () => {
//   const list: NestedList = ['V', 'hit']
//   const tree: Tree = list2Tree(list)
//   const node1: Node = {id: 0, children: [1], value: 'V'}
//   const node2: Node = {id: 1, children: undefined, value: 'hit'}
//   const expectedTree: Tree = {
//     0: node1,
//     1: node2,
//   }
//   expect(tree).toStrictEqual(expectedTree)
// })

// test('getChildrenFromList(["V", "hit"]) = ["hit"]', () => {
//   const expectedChildren: string[] = ['hit']
//   const list: string[] = ['V', 'hit']
//   const rootIndex = 0
//   const children: string[] = getChildrenFromList(list, rootIndex)
//   expect(children).toStrictEqual(expectedChildren)
// })

// test('getChildrenFromList([]) = []', () => {
//   const expectedChildren: string[] = []
//   const list: string[] = []
//   const rootIndex = 0
//   const children: string[] = getChildrenFromList(list, rootIndex)
//   expect(children).toStrictEqual(expectedChildren)
// })

// test('getChildrenFromList() = []', () => {
//   const expectedChildren: string[] = ['N', 'VP']
//   const list: NestedList = ['S',
//     ['N', 'john'],
//     ['VP',
//       ['V', 'hit'],
//       ['NP',
//         ['D', 'the'],
//         ['N', 'ball']]]]
//   const rootIndex = 0
//   const children: string[] = getChildrenFromList(list, rootIndex)
//   expect(children).toStrictEqual(expectedChildren)
// })

// test('getChildrenFromList() = []', () => {
//   const expectedChildren: string[] = ['S']
//   const list: NestedList = ['ROOT',
//     ['S',
//       ['NP-SBJ',
//         ['NN', 'Champagne'],
//         ['CC', 'and'],
//         ['NN', 'dessert']],
//       ['VP',
//         ['VBD', 'followed']],
//       ['.', '.']]]
//   const rootIndex = 0
//   const children: string[] = getChildrenFromList(list, rootIndex)
//   expect(children).toStrictEqual(expectedChildren)
// })

// test('getRHS', () => {
//   const list: NestedList = [
//     ['N', 'john'],
//     ['VP',
//       ['V', 'hit'],
//       ['NP',
//         ['D', 'the'],
//         ['N', 'ball']]],
//   ]
//   const rhs = getRHS(list)
//   expect(rhs).toStrictEqual(['N', 'VP'])
// })

// test('getRHS', () => {
//   const list: NestedList = [
//     ['V', 'hit'],
//     ['NP',
//       ['D', 'the'],
//       ['N', 'ball']],
//   ]
//   const rhs = getRHS(list)
//   expect(rhs).toStrictEqual(['V', 'NP'])
// })

// test('getRHS', () => {
//   const list: NestedList = [
//     ['hit'],
//   ]
//   const rhs = getRHS(list)
//   expect(rhs).toStrictEqual(['hit'])
// })

// test('RHS interface has right format', () => {
//   const rhs: RHS = {count: -1, weight: -1}
//   const rule: Rule = {'VP-LW': {'dad-': rhs}}
//   expect(rule).toBeTruthy()
// })

// isAtom(exp)
test('isAtom(exp) returns true if exp is a nonterminal', () => {
  const atom: SExpression = 'V'
  expect(isAtom(atom)).toBeTruthy()
})
test('isAtom(exp) returns true if exp is a terminal', () => {
  const atom: SExpression = 'hit'
  expect(isAtom(atom)).toBeTruthy()
})
test('isAtom(exp) returns false if exp is not an atom, i.e., if it is a list', () => {
  const atom: SExpression = ['V', 'hit']
  expect(isAtom(atom)).toBeFalsy()
})
test('isAtom(exp) returns false if exp is not an atom, i.e., if it is a list', () => {
  const atom: SExpression = ['S', ['N', 'john'], ['VP', ['V', 'hit'], ['NP', ['D', 'the'], ['N', 'ball']]]]
  expect(isAtom(atom)).toBeFalsy()
})

// isTerminal()

// extractRules
test('extractRules', () => {
  const expectedRules: any = []
  const exp: SExpression = ['S', ['N', 'john'], ['VP', ['V', 'hit'], ['NP', ['D', 'the'], ['N', 'ball']]]]
  const rules: boolean = extractRules(exp)
  expect(true).toBe(true)
})
