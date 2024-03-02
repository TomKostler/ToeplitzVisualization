# Toeplitz' Visualization
Visualization of the famous unsolved problem by mathematician Otto Toeplitz proposed in 1911.

# The problem
The Toeplitz' Conjecture or inscribed square problem, is an open problem in the field of geometry and topology. It asks whether every Jordan Curve (a simple closed curve) in R^2 contains the vertices of a square.

## More formally: 
Let $\gamma: \mathbb{R}/L\mathbb{Z} \rightarrow \mathbb{R}^2$ be a simple closed curve. Then &\gamma(\mathbb{R}/L\mathbb{Z})$ inscribes a square. (Terence Tao)

It is widely believed that the conjecture holds true, i.e. that it is indeed possible to inscribe a square in every Jordan Curve. However, the conjecture still couldn't be proved.
The fact that it is a still-open problem captivates me, motivating my desire to build this visualisation: to cultivate intuition for the problem (and perhaps also persuade my self of its probable veracity ;))

# The visualisation


## Simulation Mode
In this mode **random generated Jordan Curves** are automatically traversed and inscribed squares are found. 
* "Alter Circle": This Simulation Strategy uses a circle with random radius and position on the canvas as a starting point and adds random points to the path in the correct order. It also generates a random path from the circle to this tip-point and back with varying complexity.
* "TSP": This Strategy sets random points on the canvas and then finds a route through them to order them. This is done with the Travelling Salesman Problem (TSP) - heuristic "Nearest Neighbor Insertion" in $O(n^2)$













