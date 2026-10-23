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
  },
  "mockPre1walk1": {
    "start": "A",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        265
      ],
      "C": [
        230,
        65
      ],
      "D": [
        230,
        265
      ],
      "E": [
        390,
        65
      ],
      "F": [
        390,
        265
      ],
      "G": [
        540,
        165
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
        "G"
      ]
    ]
  },
  "mockPre1walk2": {
    "start": "C",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        265
      ],
      "C": [
        230,
        65
      ],
      "D": [
        230,
        265
      ],
      "E": [
        390,
        65
      ],
      "F": [
        390,
        265
      ],
      "G": [
        540,
        165
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
        "G"
      ],
      [
        "F",
        "G"
      ]
    ]
  },
  "mockPre1walk3": {
    "start": "D",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        265
      ],
      "C": [
        230,
        65
      ],
      "D": [
        230,
        265
      ],
      "E": [
        390,
        65
      ],
      "F": [
        390,
        265
      ],
      "G": [
        540,
        165
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
  "mockPre1topo1": {
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
  "mockPre1topo2": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "B": [
        65,
        65
      ],
      "D": [
        65,
        275
      ],
      "A": [
        230,
        45
      ],
      "C": [
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
        "B",
        "A"
      ],
      [
        "B",
        "C"
      ],
      [
        "D",
        "C"
      ],
      [
        "D",
        "E"
      ],
      [
        "A",
        "F"
      ],
      [
        "C",
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
  "mockPre1topo3": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "C": [
        65,
        65
      ],
      "A": [
        65,
        275
      ],
      "D": [
        230,
        45
      ],
      "B": [
        230,
        170
      ],
      "F": [
        390,
        275
      ],
      "E": [
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
        "C",
        "D"
      ],
      [
        "C",
        "B"
      ],
      [
        "A",
        "B"
      ],
      [
        "A",
        "F"
      ],
      [
        "D",
        "E"
      ],
      [
        "B",
        "E"
      ],
      [
        "F",
        "G"
      ],
      [
        "E",
        "G"
      ]
    ]
  },
  "mockPre2walk1": {
    "start": "B",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        265
      ],
      "C": [
        230,
        65
      ],
      "D": [
        230,
        265
      ],
      "E": [
        390,
        65
      ],
      "F": [
        390,
        265
      ],
      "G": [
        540,
        165
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
        "E"
      ],
      [
        "C",
        "D"
      ],
      [
        "C",
        "F"
      ],
      [
        "D",
        "G"
      ],
      [
        "E",
        "F"
      ]
    ]
  },
  "mockPre2walk2": {
    "start": "E",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        265
      ],
      "C": [
        230,
        65
      ],
      "D": [
        230,
        265
      ],
      "E": [
        390,
        65
      ],
      "F": [
        390,
        265
      ],
      "G": [
        540,
        165
      ]
    },
    "edges": [
      [
        "A",
        "D"
      ],
      [
        "A",
        "E"
      ],
      [
        "B",
        "D"
      ],
      [
        "B",
        "F"
      ],
      [
        "C",
        "E"
      ],
      [
        "C",
        "G"
      ],
      [
        "D",
        "E"
      ],
      [
        "F",
        "G"
      ]
    ]
  },
  "mockPre2walk3": {
    "start": "F",
    "order": "alphabet",
    "positions": {
      "A": [
        65,
        65
      ],
      "B": [
        65,
        265
      ],
      "C": [
        230,
        65
      ],
      "D": [
        230,
        265
      ],
      "E": [
        390,
        65
      ],
      "F": [
        390,
        265
      ],
      "G": [
        540,
        165
      ]
    },
    "edges": [
      [
        "A",
        "B"
      ],
      [
        "A",
        "F"
      ],
      [
        "B",
        "C"
      ],
      [
        "B",
        "D"
      ],
      [
        "C",
        "E"
      ],
      [
        "D",
        "G"
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
  "mockPre2topo1": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "D": [
        65,
        65
      ],
      "A": [
        65,
        275
      ],
      "C": [
        230,
        45
      ],
      "B": [
        230,
        170
      ],
      "G": [
        390,
        275
      ],
      "E": [
        390,
        70
      ],
      "F": [
        540,
        170
      ]
    },
    "edges": [
      [
        "D",
        "C"
      ],
      [
        "D",
        "B"
      ],
      [
        "A",
        "B"
      ],
      [
        "A",
        "G"
      ],
      [
        "C",
        "E"
      ],
      [
        "B",
        "E"
      ],
      [
        "G",
        "F"
      ],
      [
        "E",
        "F"
      ]
    ]
  },
  "mockPre2topo2": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "B": [
        65,
        65
      ],
      "C": [
        65,
        275
      ],
      "A": [
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
      "G": [
        390,
        70
      ],
      "F": [
        540,
        170
      ]
    },
    "edges": [
      [
        "B",
        "A"
      ],
      [
        "B",
        "D"
      ],
      [
        "C",
        "D"
      ],
      [
        "C",
        "E"
      ],
      [
        "A",
        "G"
      ],
      [
        "D",
        "G"
      ],
      [
        "E",
        "F"
      ],
      [
        "G",
        "F"
      ]
    ]
  },
  "mockPre2topo3": {
    "start": "",
    "order": "alphabet",
    "directed": true,
    "positions": {
      "C": [
        65,
        65
      ],
      "F": [
        65,
        275
      ],
      "A": [
        230,
        45
      ],
      "B": [
        230,
        170
      ],
      "D": [
        390,
        275
      ],
      "E": [
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
        "C",
        "A"
      ],
      [
        "C",
        "B"
      ],
      [
        "F",
        "B"
      ],
      [
        "F",
        "D"
      ],
      [
        "A",
        "E"
      ],
      [
        "B",
        "E"
      ],
      [
        "D",
        "G"
      ],
      [
        "E",
        "G"
      ]
    ]
  }
} satisfies Record<string, TraversalGraph>
