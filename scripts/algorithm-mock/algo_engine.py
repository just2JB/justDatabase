"""Answer engine for the algorithm mock exams: every trace is computed, never typed by hand.

Conventions follow the course app (justDatabase): selection/insertion count n-1 passes even when
nothing moves; quicksort uses the first element as pivot with bidirectional low/high scanning and
counts one round per partition of a range with 2+ elements (a single element is not a round).
"""
import contextlib
import heapq
import io
from collections import deque


def selection_passes(values):
    a, out = list(values), []
    for i in range(len(a) - 1):
        least = i
        for j in range(i + 1, len(a)):
            if a[j] < a[least]:
                least = j
        a[i], a[least] = a[least], a[i]
        out.append(list(a))
    return out


def insertion_passes(values):
    a, out = list(values), []
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
        out.append(list(a))
    return out


def quick_rounds(values):
    """Same partition as the app's quickPartitionCode; one round per partition."""
    a, out = list(values), []

    def partition(left, right):
        pivot, low, high = a[left], left + 1, right
        while low <= high:
            while low <= right and a[low] < pivot:
                low += 1
            while high >= left + 1 and a[high] > pivot:
                high -= 1
            if low < high:
                a[low], a[high] = a[high], a[low]
                low += 1
                high -= 1
            else:
                break
        a[left], a[high] = a[high], a[left]
        return high

    def sort(left, right):
        if left < right:
            pivot = a[left]
            p = partition(left, right)
            out.append({'pivot': pivot, 'range': (left, right), 'at': p, 'values': list(a)})
            sort(left, p - 1)
            sort(p + 1, right)

    sort(0, len(a) - 1)
    return out


def binary_search(a, key):
    low, high, steps = 0, len(a) - 1, []
    while low <= high:
        mid = (low + high) // 2
        steps.append((low, high, mid, a[mid]))
        if a[mid] == key:
            return mid, steps
        if a[mid] < key:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps


def string_match(text, pattern):
    """Brute force, left to right; counts every character comparison incl. the mismatching one."""
    comparisons = 0
    for i in range(len(text) - len(pattern) + 1):
        j = 0
        while j < len(pattern):
            comparisons += 1
            if text[i + j] != pattern[j]:
                break
            j += 1
        if j == len(pattern):
            return i, comparisons
    return -1, comparisons


def undirected(edges):
    g = {}
    for u, v in edges:
        g.setdefault(u, set()).add(v)
        g.setdefault(v, set()).add(u)
    return g


def dfs_order(edges, start):
    g, seen, order = undirected(edges), set(), []

    def visit(v):
        seen.add(v)
        order.append(v)
        for u in sorted(g[v]):
            if u not in seen:
                visit(u)

    visit(start)
    return order


def bfs_order(edges, start):
    g, seen, order, q = undirected(edges), {start}, [], deque([start])
    while q:
        v = q.popleft()
        order.append(v)
        for u in sorted(g[v]):
            if u not in seen:
                seen.add(u)
                q.append(u)
    return order


def topo_order(edges, nodes):
    """Kahn's algorithm, choosing the alphabetically first in-degree-0 vertex each time."""
    indeg = {v: 0 for v in nodes}
    out = {v: [] for v in nodes}
    for u, v in edges:
        out[u].append(v)
        indeg[v] += 1
    first_zero = sorted(v for v in nodes if indeg[v] == 0)
    heap, order = list(first_zero), []
    heapq.heapify(heap)
    while heap:
        v = heapq.heappop(heap)
        order.append(v)
        for u in out[v]:
            indeg[u] -= 1
            if indeg[u] == 0:
                heapq.heappush(heap, u)
    return order, first_zero


def merge_sort_trace(values):
    """Top-down merge sort, left half = first floor(n/2) items; returns merges and comparisons."""
    merges = []

    def sort(a):
        if len(a) <= 1:
            return a
        mid = len(a) // 2
        left, right = sort(a[:mid]), sort(a[mid:])
        i = j = comps = 0
        merged = []
        while i < len(left) and j < len(right):
            comps += 1
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
        merged += left[i:] + right[j:]
        merges.append({'left': left, 'right': right, 'merged': merged, 'comparisons': comps})
        return merged

    return sort(list(values)), merges


def run_python(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, {})
    return '\n'.join(line.rstrip() for line in buf.getvalue().rstrip().split('\n'))


def fmt(values):
    return '[' + ', '.join(str(v) for v in values) + ']'


def seq_variants(values):
    """Answer spellings the app's normalizer (trim, lowercase, drop spaces) can match."""
    items = [str(v) for v in values]
    return sorted({', '.join(items), '[' + ', '.join(items) + ']', ' '.join(items), '→'.join(items), ' → '.join(items)})
