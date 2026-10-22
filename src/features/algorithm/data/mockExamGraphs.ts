import type { TraversalGraph } from './traversalGraphs'

export const mockExamGraphs = {
  "mock4walk": {
    "start": "A",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        80
      ],
      "B": [
        230,
        55
      ],
      "C": [
        65,
        235
      ],
      "D": [
        390,
        55
      ],
      "E": [
        230,
        235
      ],
      "F": [
        390,
        235
      ],
      "G": [
        540,
        145
      ]
    },
    "edges": [
      [
        "A",
        "B"
      ],
      [
        "A",
        "C"
      ],
      [
        "B",
        "D"
      ],
      [
        "B",
        "E"
      ],
      [
        "C",
        "E"
      ],
      [
        "D",
        "F"
      ],
      [
        "E",
        "F"
      ],
      [
        "F",
        "G"
      ]
    ]
  },
  "mock5walk": {
    "start": "D",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        70
      ],
      "B": [
        230,
        60
      ],
      "C": [
        390,
        60
      ],
      "D": [
        65,
        235
      ],
      "E": [
        230,
        235
      ],
      "F": [
        390,
        235
      ],
      "G": [
        540,
        145
      ]
    },
    "edges": [
      [
        "A",
        "B"
      ],
      [
        "A",
        "D"
      ],
      [
        "B",
        "C"
      ],
      [
        "B",
        "E"
      ],
      [
        "C",
        "F"
      ],
      [
        "D",
        "E"
      ],
      [
        "E",
        "F"
      ],
      [
        "E",
        "G"
      ],
      [
        "F",
        "G"
      ]
    ]
  },
  "mock4topo": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        275
      ],
      "C": [
        230,
        45
      ],
      "D": [
        230,
        170
      ],
      "E": [
        390,
        275
      ],
      "F": [
        390,
        70
      ],
      "G": [
        540,
        170
      ]
    },
    "edges": [
      [
        "A",
        "C"
      ],
      [
        "A",
        "D"
      ],
      [
        "B",
        "D"
      ],
      [
        "B",
        "E"
      ],
      [
        "C",
        "F"
      ],
      [
        "D",
        "F"
      ],
      [
        "E",
        "G"
      ],
      [
        "F",
        "G"
      ]
    ]
  },
  "mock5topo": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "A": [
        65,
        235
      ],
      "B": [
        65,
        65
      ],
      "C": [
        230,
        235
      ],
      "D": [
        230,
        65
      ],
      "E": [
        390,
        145
      ],
      "F": [
        540,
        235
      ],
      "G": [
        540,
        65
      ]
    },
    "edges": [
      [
        "B",
        "D"
      ],
      [
        "D",
        "A"
      ],
      [
        "A",
        "C"
      ],
      [
        "C",
        "E"
      ],
      [
        "D",
        "E"
      ],
      [
        "E",
        "F"
      ],
      [
        "E",
        "G"
      ]
    ]
  }
} satisfies Record<string, TraversalGraph>
