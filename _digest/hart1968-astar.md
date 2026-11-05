---
title: A Formal Basis for the Heuristic Determination of Minimum Cost Paths
arxiv: ''
date: '1968-07-01'
added: '2026-11-05'
authors: Peter E. Hart, Nils J. Nilsson, Bertram Raphael
venue: IEEE Transactions on Systems Science and Cybernetics
doi: 10.1109/TSSC.1968.300136
pdf: https://ai.stanford.edu/~nilsson/OnlinePubs-Nils/PublishedPapers/astar.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
must_read: true
tldr: The paper defines A*, a graph search that always expands the open node with the smallest f̂ = ĝ + ĥ, and proves it always finds a minimum-cost path when ĥ never overestimates the remaining cost. Under a consistency assumption on ĥ, no admissible algorithm that uses no more information expands fewer nodes.
abstract: Although the problem of determining the minimum cost path through a graph arises naturally in a number of interesting applications, there has been no underlying theory to guide the development of efficient search procedures. Moreover, there is no adequate conceptual framework within which the various ad hoc search strategies proposed to date can be compared. This paper describes how heuristic information from the problem domain can be incorporated into a formal mathematical theory of graph searching and demonstrates an optimality property of a class of search strategies.
thumb:
  image: hart1968-astar/thumb.webp
  width: 224
  height: 186
videos: []
youtube: []
figures:
- image: hart1968-astar/figure1.webp
  width: 224
  height: 186
  caption: 'From Figure 1: The worked example of A* building a subgraph. From start s, n1 and n2 first get path costs 3 and 7; after n1 is expanded, n3 gets 3 + 2 = 5 and the cost of n2 drops to 3 + 3 = 6.'
- image: hart1968-astar/figure2.webp
  width: 290
  height: 217
  caption: 'From Figure 2: An inconsistent heuristic. With ĥ(n2) = 1 and ĥ(n3) = 5, A* scores n2 at 6 + 1 = 7 and n3 at 3 + 5 = 8, so it wrongly expands n2 next, although ĥ(s) = 8 says no path to the goal t is shorter than 8.'
---
## What they do
Minimum-cost path problems (telephone routing, mazes, circuit layout, theorem proving) had been attacked either mathematically, with guaranteed algorithms that use no knowledge of the problem, or heuristically, with domain knowledge but no guarantee of finding the cheapest path. Hart, Nilsson and Raphael combine the two: search algorithm A* orders node expansion with an estimate of the remaining cost, and they prove when it finds an optimal path and when it expands the fewest nodes.

## How it works
- **Evaluation function.** Each open node n is scored f̂(n) = ĝ(n) + ĥ(n): the cheapest cost from the start found so far, plus an estimate of the cost to the nearest goal, such as the airline distance between cities.
- **Search loop.** Expand the open node with the smallest f̂, close it, open its successors (reopening a closed one whose f̂ dropped), and stop when a goal is selected; back-pointers give the path.
- **Admissibility (Theorem 1).** If ĥ(n) ≤ h(n) for all n, A* always finds an optimal path when every arc costs at least some δ > 0.
- **Consistency.** If ĥ also satisfies the triangle inequality h(m,n) + ĥ(n) ≥ ĥ(m), every closed node already has its optimal cost, so no node is ever reopened.

## Results
A theory paper with no experiments.
- Theorems 2 and 3: with a consistent ĥ, every node A* expands is also expanded by any admissible algorithm with no more information about the problem. A* therefore expands the fewest nodes, apart from tie-breaking; the extra nodes are bounded by the number of critical ties.
- With ĥ = 0, A* is essentially an algorithm Pollack and Wiebenson attribute to Minty; the breadth-first methods of Moore and of Busacker and Saaty are A* with ĥ = 0 and unit arc costs.

## Limitations
Optimality counts nodes expanded, not total computation: computing √(x² + y²) can cost more than a few extra expansions, and the cheaper (x + y)/2 stays admissible. An ĥ that overestimates, such as x + y, may expand fewer nodes but loses the guarantee of an optimal path. Building the graph for a real problem is left out of scope.
