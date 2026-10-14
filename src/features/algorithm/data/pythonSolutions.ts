// 모범 답안은 가능한 구현 중 하나입니다. 자유 실습은 정해진 답안이 없어 제외합니다.
export const pythonSolutions: Record<string, string> = {
  gcd1: `def gcd1(a, b):
    alist = [i for i in range(1, a + 1) if a % i == 0]
    blist = [i for i in range(1, b + 1) if b % i == 0]
    return max(i for i in alist if i in blist)

print(gcd1(60, 28))`,
  gcd2: `def gcd2(a, b):
    alist = [i for i in range(1, a + 1) if a % i == 0]
    for divisor in reversed(alist):
        if b % divisor == 0:
            return divisor

print(gcd2(60, 28))`,
  gcd3: `def gcd3(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(gcd3(60, 28))`,
  brackets: `def is_balanced(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
    return len(stack) == 0

print(is_balanced("({[]})"))
print(is_balanced("({[}])"))`,
  words: `text = "python python python java java c"
freq = {}
for word in text.split():
    freq[word] = freq.get(word, 0) + 1

ranking = sorted(freq.items(), key=lambda item: item[1], reverse=True)
for rank, (word, count) in enumerate(ranking[:3], start=1):
    print(f"{rank}위: {word} ({count}회)")`,
  grades: `D_sungjuk = {}

def f1():
    for subject in ['국어', '영어', '수학']:
        D_sungjuk[subject] = int(input(f"{subject} 점수: "))

def f2():
    return sum(D_sungjuk.values()) / len(D_sungjuk) if D_sungjuk else 0

def f3():
    print(f"평균: {f2():.2f}")

while True:
    menu = input("1) 점수입력 2) 점수수정 0) 종료: ")
    if menu == '1':
        f1()
    elif menu == '2':
        subject = input("수정할 과목: ")
        if subject in D_sungjuk:
            D_sungjuk[subject] = int(input("새 점수: "))
    elif menu == '0':
        f3()
        break`,
  sequential: `def sequential_search(A, key):
    for index, value in enumerate(A):
        if value == key:
            return index
    return -1

print(sequential_search([2, 5, 8, 12], 8))
print(sequential_search([2, 5, 8, 12], 7))`,
  unique: `def unique_elem(A):
    for i in range(len(A) - 1):
        for j in range(i + 1, len(A)):
            if A[i] == A[j]:
                return False
    return True

print(unique_elem([32,14,5,17,23,9,11,14,26,29]))
print(unique_elem([13,6,8,7,12,25]))`,
  'binary-digits': `def binary_dig(n):
    count = 1
    while n > 1:
        n //= 2
        count += 1
    return count

for n in [1, 7, 8, 16]:
    print(binary_dig(n))`,
  timing: `import time

def gcd3(a, b):
    while b:
        a, b = b, a % b
    return a

for a, b in [(100, 70), (10000, 7000), (1000000, 700000)]:
    start = time.perf_counter()
    result = gcd3(a, b)
    elapsed = time.perf_counter() - start
    print(a, result, elapsed)`,
  factorial: `def facto1(n):
    if n <= 1:
        return 1
    return n * facto1(n - 1)

def facto2(n):
    result = 1
    for k in range(n, 0, -1):
        result *= k
    return result

print(facto1(5))
print(facto2(5))
print(facto1(0))`,
  hanoi: `def hanoi_tower(n, fr, tmp, to):
    if n == 1:
        print(f"원판 1: {fr} --> {to}")
        return
    hanoi_tower(n - 1, fr, to, tmp)
    print(f"원판 {n}: {fr} --> {to}")
    hanoi_tower(n - 1, tmp, fr, to)

hanoi_tower(3, "A", "B", "C")`,
  fibonacci: `def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

def fibonacci_iterative(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

for n in [5, 10, 20]:
    print(n, fibonacci_recursive(n), fibonacci_iterative(n))`,
  selection: `def selection_sort(A):
    for i in range(len(A) - 1):
        least = i
        for j in range(i + 1, len(A)):
            if A[j] < A[least]:
                least = j
        A[i], A[least] = A[least], A[i]

data = [5, 3, 8, 4, 9, 1, 6, 2, 7]
selection_sort(data)
print(data)`,
  matching: `def string_matching(T, P):
    n, m = len(T), len(P)
    for i in range(n - m + 1):
        j = 0
        while j < m and P[j] == T[i + j]:
            j += 1
        if j == m:
            return i
    return -1

print(string_matching("BRUTEFORCE", "FOR"))
print(string_matching("ALGORITHM", "FOR"))`,
  tsp: `from itertools import permutations

dist = {("A","B"):10, ("A","C"):15, ("A","D"):20,
        ("B","C"):40, ("B","D"):25, ("C","D"):30}

def get_distance(a, b):
    return dist[(a,b)] if (a,b) in dist else dist[(b,a)]

best_route = None
best_cost = float("inf")
for perm in permutations(["B", "C", "D"]):
    route = ["A"] + list(perm) + ["A"]
    cost = sum(get_distance(route[i], route[i + 1]) for i in range(len(route) - 1))
    if cost < best_cost:
        best_cost, best_route = cost, route

print(best_route)
print(best_cost)`,
  graph: `from collections import deque

graph = {"A":{"B","C"}, "B":{"A","D"}, "C":{"A","D","E"},
         "D":{"B","C","F"}, "E":{"C","G","H"}, "F":{"D"},
         "G":{"E","H"}, "H":{"E","G"}}

def dfs(graph, start, visited):
    visited.add(start)
    print(start, end=' ')
    for neighbor in sorted(graph[start]):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    while queue:
        vertex = queue.popleft()
        print(vertex, end=' ')
        for neighbor in sorted(graph[vertex]):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

dfs(graph, "A", set())
print()
bfs(graph, "A")`,
  insertion: `def insertion_sort(A):
    for i in range(1, len(A)):
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key:
            A[j + 1] = A[j]
            j -= 1
        A[j + 1] = key

data = [5, 3, 8, 4, 9, 1, 6, 2, 7]
insertion_sort(data)
print(data)`,
  topological: `def topological_sort(graph):
    in_degree = {vertex: 0 for vertex in graph}
    for vertex in graph:
        for neighbor in graph[vertex]:
            in_degree[neighbor] += 1
    ready = [vertex for vertex in graph if in_degree[vertex] == 0]
    result = []
    while ready:
        vertex = ready.pop()
        result.append(vertex)
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                ready.append(neighbor)
    if len(result) != len(graph):
        raise ValueError("사이클이 있습니다.")
    print(*result)

graph = {"A":["C","D"], "B":["D","E"], "C":["D","F"],
         "D":["F"], "E":["F"], "F":[]}
topological_sort(graph)`,
  'binary-search': `def binary_search_iter(A, key, low, high):
    while low <= high:
        mid = (low + high) // 2
        if key == A[mid]:
            return mid
        if key > A[mid]:
            low = mid + 1
        else:
            high = mid - 1
    return -1

A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search_iter(A, 23, 0, len(A)-1))
print(binary_search_iter(A, 50, 0, len(A)-1))`,
  power: `def slow_power(x, n):
    result = 1
    for _ in range(n):
        result *= x
    return result

def power(x, n):
    if n == 0:
        return 1
    half = power(x, n // 2)
    return half * half if n % 2 == 0 else x * half * half

print(slow_power(2, 10))
print(power(2, 10))`,
  lcm: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return a * b // gcd(a, b)

print(lcm(60, 28))`,
  quadratic: `from math import sqrt

def quadratic_roots(a, b, c):
    if a == 0:
        raise ValueError("a는 0이 아니어야 합니다.")
    d = b * b - 4 * a * c
    if d < 0:
        return ()
    if d == 0:
        return (-b / (2 * a),)
    return ((-b + sqrt(d)) / (2 * a),
            (-b - sqrt(d)) / (2 * a))

print(quadratic_roots(1, -3, 2))
print(quadratic_roots(1, 0, 1))`,
  'min-distance': `def min_distance(A):
    if len(A) < 2:
        raise ValueError("원소가 두 개 이상 필요합니다.")
    values = sorted(A)
    return min(values[i] - values[i - 1]
               for i in range(1, len(values)))

print(min_distance([8, 1, 14, 5, 9]))`,
  'linked-list-input': `class Node:
    def __init__(self, data, link=None):
        self.data = data
        self.link = link

def make_linked_list(values):
    head = None
    tail = None
    for value in values:
        node = Node(value)
        if head is None:
            head = node
        else:
            tail.link = node
        tail = node
    return head

def to_list(head):
    result = []
    current = head
    while current is not None:
        result.append(current.data)
        current = current.link
    return result

head = make_linked_list([5, 6, 7])
print(to_list(head))`,
  minmax: `def minmax(values):
    if not values:
        raise ValueError("빈 리스트입니다.")
    minimum = maximum = values[0]
    for value in values[1:]:
        if value < minimum:
            minimum = value
        if value > maximum:
            maximum = value
    return minimum, maximum

print(minmax([7, 2, 9, 4, 1]))`,
  'common-item': `def has_common_item(a, b):
    values = set(a)
    return any(item in values for item in b)

print(has_common_item([1, 2, 3], [5, 3, 8]))
print(has_common_item([1, 2], [3, 4]))`,
  'reverse-stack': `def reverse_with_stack(text):
    stack = []
    for char in text:
        stack.append(char)
    result = []
    while stack:
        result.append(stack.pop())
    return "".join(result)

print(reverse_with_stack("algorithm"))`,
  'fibonacci-queue': `from collections import deque

def fibonacci_queue(n):
    if n < 0:
        raise ValueError("n은 0 이상이어야 합니다.")
    if n < 2:
        return n
    queue = deque([0, 1])
    for _ in range(2, n + 1):
        old = queue.popleft()
        queue.append(old + queue[0])
    return queue[-1]

print([fibonacci_queue(n) for n in range(11)])`,
  'heap-sort': `import heapq

def heap_sort(values):
    heap = []
    for value in values:
        heapq.heappush(heap, value)
    result = []
    while heap:
        result.append(heapq.heappop(heap))
    return result

print(heap_sort([7, 3, 9, 1, 4]))`,
  'set-operations': `def set_operations(A, B):
    a, b = set(A), set(B)
    return sorted(a | b), sorted(a & b), sorted(a - b)

print(set_operations([1, 2, 3], [3, 4, 5]))`,
  'proper-subset': `def is_proper_subset(A, B):
    return set(A) < set(B)

print(is_proper_subset([1, 2], [1, 2, 3]))
print(is_proper_subset([1, 2], [1, 2]))`,
  'menu-dict': `price = {"콩나물해장국": 4500, "갈비탕": 9000, "돈가스": 8000}
price["팟타이"] = 7000

for menu in sorted(price):
    print(f"{menu}: {price[menu]}원")`,
}
