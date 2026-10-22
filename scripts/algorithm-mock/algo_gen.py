"""Usage: python algo_gen.py <app data .ts path> <vault notes dir>

Builds three algorithm mock exams from computed answers and writes the app data file + vault notes."""
import json
import math
import sys
from functools import lru_cache
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from algo_engine import (bfs_order, binary_search, dfs_order, fmt, insertion_passes, merge_sort_trace,
                         quick_rounds, run_python, selection_passes, seq_variants, string_match, topo_order)
from recurrence_explanations import EXPLANATIONS

APP_FILE = Path(sys.argv[1])
VAULT_DIR = Path(sys.argv[2])

KINDS = {'analysis': '효율성 분석', 'recursion': '재귀·코드 읽기', 'sort': '정렬 회전', 'search': '탐색',
         'graph': '그래프', 'divide': '분할 정복'}
GRAPH_RULE = '인접 정점은 알파벳순으로 확인합니다. DFS는 재귀 호출, BFS는 큐에 넣을 때 방문 처리합니다.'
TOPO_RULE = '진입 차수가 0인 정점을 하나씩 제거하며, 후보가 여러 개면 알파벳이 빠른 정점을 먼저 고릅니다.'
SORT_RULE = '값이 바뀌지 않아도 1회전으로 셉니다.'
QUICK_RULE = '첫 원소를 피벗으로 하는 양방향 분할(low는 피벗 이상, high는 피벗 이하에서 멈춤)을 쓰고, 왼쪽 구간부터 처리합니다. 분할 1번이 1회전이며 원소가 1개인 구간은 회전으로 세지 않습니다.'


def check_recurrence(rec, closed, ns):
    for n in ns:
        assert rec(n) == closed(n), (n, rec(n), closed(n))


def q(kind, prompt, answer, explanation, *, code=None, options=None, correct=None, accepted=None):
    item = {'kind': kind, 'prompt': prompt, 'answer': answer, 'explanation': explanation}
    if code: item['code'] = code
    if options is not None: item.update(options=options, correct=correct, answer=options[correct])
    if accepted is not None: item['accepted'] = accepted
    return item


def nums(*values):
    out = set()
    for v in values:
        out |= {str(v), f'{v}회', f'{v}번', f'{v}개'}
    return sorted(out)


def trace_text(label, passes):
    return '\n'.join(f'{i + 1}{label}: {fmt(p)}' for i, p in enumerate(passes))


def selection_q(values, ask_round=None):
    passes = selection_passes(values)
    full = q('sort', f'리스트 {fmt(values)}를 선택 정렬로 오름차순 정렬할 때 회전별 리스트를 모두 쓰시오. ({SORT_RULE})',
             trace_text('회전', passes),
             f'남은 구간의 최솟값을 그 구간의 첫 자리와 교환합니다. 원소 {len(values)}개이므로 {len(values) - 1}회전입니다.')
    items = [full]
    if ask_round:
        r = passes[ask_round - 1]
        items.append(q('sort', f'리스트 {fmt(values)}를 선택 정렬로 정렬할 때 {ask_round}회전 직후의 리스트는? (예: 1, 2, 3)',
                       fmt(r), f'1~{ask_round}회전: ' + ' → '.join(fmt(p) for p in passes[:ask_round]), accepted=seq_variants(r)))
    return items


def insertion_q(values, ask_round=None):
    passes = insertion_passes(values)
    items = [q('sort', f'리스트 {fmt(values)}를 삽입 정렬로 오름차순 정렬할 때 회전별 리스트를 모두 쓰시오. ({SORT_RULE})',
               trace_text('회전', passes),
               f'i번째 원소(key)를 앞의 정렬된 구간에 끼워 넣습니다. 큰 값만 오른쪽으로 밀어요. {len(values) - 1}회전입니다.')]
    if ask_round:
        r = passes[ask_round - 1]
        items.append(q('sort', f'리스트 {fmt(values)}를 삽입 정렬로 정렬할 때 {ask_round}회전 직후의 리스트는?',
                       fmt(r), ' → '.join(fmt(p) for p in passes[:ask_round]), accepted=seq_variants(r)))
    return items


def quick_q(values, ask_count=False):
    rounds = quick_rounds(values)
    lines = '\n'.join(f"{i + 1}회전 (피벗 {r['pivot']}, 구간 {r['range'][0]}~{r['range'][1]}, 위치 {r['at']} 확정): {fmt(r['values'])}"
                      for i, r in enumerate(rounds))
    items = [q('sort', f'리스트 {fmt(values)}를 퀵 정렬로 정렬할 때 회전별 리스트를 모두 쓰시오. {QUICK_RULE}', lines,
               f'총 {len(rounds)}회전입니다. 각 회전은 피벗 위치가 확정된 직후의 전체 리스트입니다.')]
    if ask_count:
        items.append(q('sort', f'위 규칙의 퀵 정렬로 리스트 {fmt(values)}를 정렬하면 회전은 모두 몇 번인가?', f'{len(rounds)}회',
                       '피벗별 회전: ' + ', '.join(str(r['pivot']) for r in rounds) + '. 원소 1개 구간은 세지 않습니다.',
                       accepted=nums(len(rounds))))
    return items


def binary_q(a, key):
    idx, steps = binary_search(a, key)
    mids = [s[3] for s in steps]
    detail = ' / '.join(f'low={l}, high={h}, mid={m} → A[{m}]={v}' for l, h, m, v in steps)
    result = f'반환 {idx}' if idx >= 0 else '반환 -1 (없음)'
    return [q('search', f'정렬된 A = {fmt(a)}에서 이진 탐색을 한다(찾는 값 key = {key}). mid = (low + high) // 2일 때 비교하는 값을 순서대로 쓰시오.',
              ', '.join(map(str, mids)), f'{detail}. {result}', accepted=seq_variants(mids)),
            q('search', f'위 탐색(A = {fmt(a)}, key = {key})에서 함수가 반환하는 값은? (인덱스는 0부터, 없으면 -1)',
              str(idx), f'{detail}.', accepted=[str(idx)])]


def match_q(text, pattern):
    pos, comps = string_match(text, pattern)
    return [q('search', f'억지 기법 문자열 탐색(텍스트 "{text}", 패턴 "{pattern}")에서 처음 일치하는 시작 인덱스는? (0부터, 없으면 -1)',
              str(pos), '패턴을 한 칸씩 옮기며 왼쪽부터 비교합니다.', accepted=[str(pos)]),
            q('search', f'위 탐색(텍스트 "{text}", 패턴 "{pattern}")에서 처음 일치를 찾을 때까지 문자 비교는 모두 몇 번인가? (불일치가 난 비교도 1번으로 셉니다)',
              f'{comps}번', '각 시작 위치에서 일치하는 동안 비교하고, 첫 불일치에서 다음 위치로 이동합니다.', accepted=nums(comps))]


def graph_qs(edges, start):
    edge_text = ', '.join(f'{u}–{v}' for u, v in edges)
    d, b = dfs_order(edges, start), bfs_order(edges, start)
    return [q('graph', f'무방향 그래프의 간선이 {edge_text}이다. {start}에서 시작하는 DFS의 방문 순서는? {GRAPH_RULE}',
              ' '.join(d), '방문 순서: ' + ' → '.join(d), accepted=seq_variants(d)),
            q('graph', f'같은 그래프({edge_text})에서 {start}에서 시작하는 BFS의 방문 순서는? {GRAPH_RULE}',
              ' '.join(b), '방문 순서: ' + ' → '.join(b), accepted=seq_variants(b))]


def topo_qs(edges, nodes, ask_first=False):
    order, first_zero = topo_order(edges, nodes)
    edge_text = ', '.join(f'{u}→{v}' for u, v in edges)
    items = [q('graph', f'방향 그래프의 간선이 {edge_text}일 때 위상 정렬 결과는? {TOPO_RULE}', ' '.join(order),
               f'처음 진입 차수 0: {", ".join(first_zero)}. 결과 {" → ".join(order)}. (규칙이 없으면 다른 순서도 정답일 수 있어요.)',
               accepted=seq_variants(order))]
    if ask_first:
        items.append(q('graph', f'위 그래프({edge_text})에서 처음 진입 차수가 0인 정점을 모두 쓰시오. (알파벳순)', ', '.join(first_zero),
                       '들어오는 간선이 없는 정점입니다.', accepted=seq_variants(first_zero)))
    return items


def topo_cycle_qs(edges, nodes):
    order, _ = topo_order(edges, nodes)
    edge_text = ', '.join(f'{u}→{v}' for u, v in edges)
    stuck = [v for v in nodes if v not in order]
    return [q('graph', f'방향 그래프의 간선이 {edge_text}이다. {TOPO_RULE} 이렇게 진행할 때 처리(출력)되는 정점을 순서대로 쓰시오.',
              ' '.join(order), f'{" → ".join(order)}까지 처리한 뒤 진입 차수 0인 정점이 더 없어 멈춥니다. 남은 {", ".join(stuck)}는 사이클에 걸려 있어요.',
              accepted=seq_variants(order)),
            q('graph', f'위 그래프({edge_text})는 전체 위상 정렬이 가능하다. (O / X)', '',
              f'처리한 정점 수({len(order)}) < 전체 정점 수({len(nodes)})이면 사이클이 있다는 뜻이라 전체 위상 정렬은 불가능합니다.',
              options=['O', 'X'], correct=1)]


def merge_qs(values):
    result, merges = merge_sort_trace(values)
    last = merges[-1]
    total = sum(m['comparisons'] for m in merges)
    steps = '\n'.join(f"{fmt(m['left'])} + {fmt(m['right'])} → {fmt(m['merged'])} (비교 {m['comparisons']}번)" for m in merges)
    return [q('divide', f'리스트 {fmt(values)}를 병합 정렬로 정렬한다(앞쪽 ⌊n/2⌋개를 왼쪽으로 분할). 병합 과정을 순서대로 쓰시오.', steps,
              f'분할 후 작은 조각부터 병합합니다. 최종 결과 {fmt(result)}.'),
            q('divide', f'위 병합 정렬({fmt(values)})의 마지막 병합에서 비교는 몇 번 일어나는가?', f"{last['comparisons']}번",
              f"{fmt(last['left'])} + {fmt(last['right'])}: 한쪽이 먼저 비면 나머지는 비교 없이 붙입니다.",
              accepted=nums(last['comparisons'])),
            q('divide', f'위 병합 정렬({fmt(values)}) 전체에서 일어나는 비교 횟수의 합은?', f'{total}번',
              '병합별 비교: ' + ', '.join(str(m['comparisons']) for m in merges), accepted=nums(total))]


def code_q(kind, prompt, code, explanation):
    out = run_python(code)
    lines = out.split('\n')
    accepted = sorted({out, ' '.join(lines), ', '.join(lines), ','.join(lines)})
    return q(kind, prompt, out, explanation, code=code, accepted=accepted)


# ---------- recurrences, each closed form checked by substitution ----------
r1 = lru_cache(None)(lambda n: 1 if n == 1 else r1(n - 1) + n)
check_recurrence(r1, lambda n: n * (n + 1) // 2, range(1, 40))
r2 = lru_cache(None)(lambda n: 1 if n == 1 else r2(n // 2) + n)
check_recurrence(r2, lambda n: 2 * n - 1, [2 ** k for k in range(7)])
r3 = lru_cache(None)(lambda n: 2 if n == 1 else r3(n - 1) + 2 * n)
check_recurrence(r3, lambda n: n * (n + 1), range(1, 40))
r4 = lru_cache(None)(lambda n: 1 if n == 1 else 4 * r4(n // 2) + n)
check_recurrence(r4, lambda n: 2 * n * n - n, [2 ** k for k in range(7)])
r5 = lru_cache(None)(lambda n: 1 if n == 1 else 2 * r5(n - 1) + 1)
check_recurrence(r5, lambda n: 2 ** n - 1, range(1, 30))
r6 = lru_cache(None)(lambda n: 1 if n == 1 else 3 * r6(n // 3) + n)
check_recurrence(r6, lambda n: n * round(math.log(n, 3)) + n, [3 ** k for k in range(6)])


def count_loops(code, n):
    env = {'n': n}
    exec(code, env)
    return env['count']


# ---------- set 1: 기본 ----------
loop1 = 'count = 0\nfor i in range(1, n + 1):\n    for j in range(i):\n        count += 1'
c1 = count_loops(loop1, 6)
set1 = [
    q('analysis', 'T(n) = 3n² + 5n log n + 7의 가장 알맞은 Big-O는?', '', '최고차항 n²이 증가를 지배합니다. 계수와 낮은 차수는 버립니다.',
      options=['O(n log n)', 'O(n²)', 'O(n³)', 'O(n² log n)'], correct=1),
    q('analysis', '2n + 10은 O(n²)이다. (O / X)', '', 'Big-O는 상한이므로 느슨한 상한도 맞습니다. 가장 타이트한 표현은 Θ(n)입니다.',
      options=['O', 'X'], correct=0),
    q('analysis', 'n = 6일 때 count의 최종 값은?', f'{c1}', f'i마다 안쪽이 i번 → 1+2+…+6 = {c1}. 일반식 n(n+1)/2, O(n²).',
      code=loop1, accepted=nums(c1)),
    q('analysis', 'T(n) = T(n−1) + n, T(1) = 1을 연속 대치법으로 풀고 시간 복잡도를 쓰시오. 풀이 과정을 쓰세요.',
      'T(n) = T(n−1) + n = T(n−2) + (n−1) + n = … = T(1) + 2 + 3 + … + n = n(n+1)/2 → O(n²)',
      EXPLANATIONS['r1']),
    q('analysis', 'T(n) = T(n/2) + n, T(1) = 1을 연속 대치법으로 풀고 시간 복잡도를 쓰시오. (n은 2의 거듭제곱) 풀이 과정을 쓰세요.',
      'T(n) = T(n/2) + n = T(n/4) + n/2 + n = … = T(n/2ᵏ) + n(1 + 1/2 + … + 1/2ᵏ⁻¹) = T(n/2ᵏ) + 2n − 2n/2ᵏ. n/2ᵏ = 1이면 T(n) = 1 + 2n − 2 = 2n − 1 → O(n)',
      EXPLANATIONS['r2']),
    code_q('recursion', '출력 결과를 쓰시오.', 'def f(n):\n    if n <= 0:\n        return 0\n    return n + f(n - 2)\n\nprint(f(7))',
           '7 + f(5) = 7 + 5 + f(3) = … = 7 + 5 + 3 + 1 + f(-1)(=0)'),
    code_q('recursion', '출력 결과를 줄마다 순서대로 쓰시오.',
           'def g(n):\n    if n == 0:\n        print("*")\n        return\n    print(n)\n    g(n - 1)\n    print(n * 10)\n\ng(2)',
           '내려가면서 2, 1을 출력하고, 바닥에서 *, 돌아오면서 10, 20을 출력합니다.'),
    *selection_q([5, 2, 8, 1, 9, 3], ask_round=2),
    *insertion_q([4, 7, 1, 3, 9, 2]),
    *quick_q([5, 3, 8, 1, 9, 2, 7], ask_count=True),
    *binary_q([3, 8, 12, 17, 21, 26, 30, 35, 41], 26),
    *match_q('ABCABDABC', 'ABD'),
    *graph_qs([('A', 'B'), ('A', 'C'), ('B', 'D'), ('B', 'E'), ('C', 'F'), ('E', 'F')], 'A'),
    *topo_qs([('A', 'C'), ('B', 'C'), ('B', 'D'), ('C', 'E'), ('D', 'E'), ('E', 'F')], 'ABCDEF', ask_first=True),
    *merge_qs([6, 2, 9, 4, 1, 7, 3, 8])[:2],
    q('divide', 'T(n) = 4T(n/2) + n에서 a, b, d를 쓰고 마스터 정리로 복잡도를 구하시오.', 'a = 4, b = 2, d = 1, 4 > 2¹ → O(n^(log₂4)) = O(n²)',
      'a > bᵈ이면 재귀(부분 문제 수)가 지배해서 O(n^(log_b a))입니다.'),
]

# ---------- set 2: 응용 ----------
loop2 = 'count = 0\ni = n\nwhile i > 1:\n    i = i // 2\n    for j in range(n):\n        count += 1'
c2 = count_loops(loop2, 32)
pow_code = ('mul = 0\ndef power(x, n):\n    global mul\n    if n == 0:\n        return 1\n    half = power(x, n // 2)\n'
            '    if n % 2 == 0:\n        mul += 1\n        return half * half\n    mul += 2\n    return x * half * half\n\nprint(power(2, 13), mul)')
set2 = [
    q('analysis', '충분히 큰 n에서 가장 빠르게 증가하는 것은?', '', 'n²/log n과 n^1.5를 비교하면 n^0.5가 log n보다 빨리 커지므로 n²/log n이 가장 큽니다.',
      options=['100n log n', 'n^1.5', 'n² / log n', '1000n'], correct=2),
    q('analysis', '3n + 5 ≤ c·n을 c = 4로 만족시키는 가장 작은 정수 n₀는?', '5', '3n + 5 ≤ 4n ⇔ n ≥ 5. 따라서 3n + 5 = O(n) (c = 4, n₀ = 5).',
      accepted=nums(5)),
    q('analysis', 'n = 32일 때 count의 최종 값과 일반적인 시간 복잡도는? (count 값만 숫자로)', f'{c2}', f'바깥 반복 log₂32 = 5번 × 안쪽 32번 = {c2}. O(n log n).',
      code=loop2, accepted=nums(c2)),
    q('analysis', 'T(n) = T(n−1) + 2n, T(1) = 2를 연속 대치법으로 풀고 시간 복잡도를 쓰시오. 풀이 과정을 쓰세요.',
      'T(n) = T(n−1) + 2n = T(n−2) + 2(n−1) + 2n = … = T(1) + 2(2 + 3 + … + n) = 2 + 2(n(n+1)/2 − 1) = n(n+1) → O(n²)',
      EXPLANATIONS['r3']),
    q('analysis', 'T(n) = 4T(n/2) + n, T(1) = 1을 연속 대치법으로 풀고 시간 복잡도를 쓰시오. (n은 2의 거듭제곱) 풀이 과정을 쓰세요.',
      'T(n) = 4T(n/2) + n = 16T(n/4) + 2n + n = … = 4ᵏT(n/2ᵏ) + n(1 + 2 + … + 2ᵏ⁻¹) = 4ᵏT(n/2ᵏ) + n(2ᵏ − 1). 2ᵏ = n이면 4ᵏ = n²이므로 T(n) = n² + n(n − 1) = 2n² − n → O(n²)',
      EXPLANATIONS['r4']),
    code_q('recursion', '출력 결과를 줄마다 순서대로 쓰시오.',
           "def h(n, a, b, c):\n    if n == 0:\n        return 0\n    x = h(n - 1, a, c, b)\n    print(a, '->', c)\n    y = h(n - 1, b, a, c)\n    return x + y + 1\n\nprint(h(2, 'A', 'B', 'C'))",
           '하노이탑 n = 2: 원판 이동 3줄을 출력한 뒤 이동 횟수 3을 출력합니다.'),
    code_q('recursion', '출력 결과를 쓰시오. (fib 값과 전체 호출 횟수)',
           'cnt = 0\ndef fib(n):\n    global cnt\n    cnt += 1\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(4), cnt)',
           'C(n) = 1 + C(n−1) + C(n−2), C(0) = C(1) = 1 → C(4) = 9. 같은 값을 반복 계산해서 호출이 늘어나요.'),
    *selection_q([29, 10, 14, 37, 13], ask_round=3),
    *insertion_q([5, 1, 4, 2, 8, 3], ask_round=3),
    *quick_q([4, 9, 2, 7, 5, 1, 8, 3, 6], ask_count=True),
    *binary_q([2, 5, 9, 14, 18, 23, 31, 40], 20),
    *match_q('AAAAAB', 'AAB'),
    *graph_qs([('A', 'B'), ('A', 'D'), ('B', 'C'), ('B', 'E'), ('C', 'F'), ('D', 'E'), ('E', 'F'), ('F', 'G')], 'A'),
    *topo_qs([('A', 'B'), ('A', 'C'), ('B', 'D'), ('C', 'D'), ('C', 'E'), ('D', 'F'), ('E', 'F'), ('G', 'E')], 'ABCDEFG'),
    *merge_qs([38, 27, 43, 3, 9, 82, 10]),
    code_q('divide', '빠른 거듭제곱 코드의 출력 결과를 쓰시오. (결과값과 곱셈 횟수)', pow_code,
           '13 → 6 → 3 → 1 → 0. 홀수 단계는 곱셈 2번, 짝수 단계는 1번입니다. 절반 결과를 한 번만 계산해 재사용해요.'),
    q('divide', 'T(n) = 8T(n/2) + n²에서 a, b, d를 쓰고 마스터 정리로 복잡도를 구하시오.', 'a = 8, b = 2, d = 2, 8 > 2² → O(n^(log₂8)) = O(n³)',
      'a > bᵈ → O(n^(log_b a)).'),
]

# ---------- set 3: 고난도·분할 정복 집중 ----------
loop3 = 'count = 0\nfor i in range(n):\n    for j in range(i, n):\n        for k in range(j, n):\n            count += 1'
c3 = count_loops(loop3, 4)
tree_code = 'def f(n):\n    if n <= 1:\n        return 1\n    return f(n // 2) + f(n // 2) + n\n\nprint(f(8))'
pre_code = "def p(l, r):\n    if l > r:\n        return\n    m = (l + r) // 2\n    print(m, end=' ')\n    p(l, m - 1)\n    p(m + 1, r)\n\np(0, 6)"
sum_code = ('calls = 0\ndef s(a, l, r):\n    global calls\n    calls += 1\n    if l == r:\n        return a[l]\n    m = (l + r) // 2\n'
            '    return s(a, l, m) + s(a, m + 1, r)\n\nprint(s([3, 1, 4, 1, 5, 9], 0, 5), calls)')
set3 = [
    q('analysis', 'O(n log n) 알고리즘은 O(n²) 알고리즘보다 모든 입력 크기 n에서 항상 빠르다. (O / X)', '',
      '점근 표기는 충분히 큰 n에서의 증가율 비교입니다. 작은 n이나 상수 계수 때문에 O(n²)이 더 빠를 수 있어요.', options=['O', 'X'], correct=1),
    q('analysis', '아래 코드의 시간 복잡도는?', '', '바깥 n번 × 안쪽 j가 1, 2, 4, …로 두 배씩 → log n번. O(n log n).',
      code='for i in range(n):\n    j = 1\n    while j < n:\n        j *= 2', options=['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'], correct=2),
    q('analysis', 'n = 4일 때 count의 최종 값은?', f'{c3}', f'i ≤ j ≤ k인 조합 수 = C(n+2, 3) = {c3}. O(n³).', code=loop3, accepted=nums(c3)),
    q('analysis', 'T(n) = 2T(n−1) + 1, T(1) = 1을 연속 대치법으로 풀고 시간 복잡도를 쓰시오. 풀이 과정을 쓰세요.',
      'T(n) = 2T(n−1) + 1 = 4T(n−2) + 2 + 1 = … = 2ᵏT(n−k) + (2ᵏ − 1). n−k = 1이면 k = n−1, T(n) = 2ⁿ⁻¹ + 2ⁿ⁻¹ − 1 = 2ⁿ − 1 → O(2ⁿ)',
      EXPLANATIONS['r5']),
    q('analysis', 'T(n) = 3T(n/3) + n, T(1) = 1을 연속 대치법으로 풀고 시간 복잡도를 쓰시오. (n은 3의 거듭제곱) 풀이 과정을 쓰세요.',
      'T(n) = 3T(n/3) + n = 9T(n/9) + n + n = … = 3ᵏT(n/3ᵏ) + kn. n/3ᵏ = 1이면 k = log₃n, T(n) = n + n log₃n → O(n log n)',
      EXPLANATIONS['r6']),
    code_q('recursion', '출력 결과를 쓰시오.', tree_code, 'f(1) = 1, f(2) = 1 + 1 + 2 = 4, f(4) = 4 + 4 + 4 = 12, f(8) = 12 + 12 + 8'),
    code_q('recursion', '출력 결과를 쓰시오. (공백으로 구분)', pre_code, '가운데 m을 먼저 출력하고 왼쪽, 오른쪽 순으로 내려갑니다(이진 탐색의 mid 순서와 같은 모양).'),
    *selection_q([3, 1, 3, 2, 1]),
    *insertion_q([9, 8, 7, 6, 5], ask_round=2),
    *quick_q([6, 6, 2, 9, 6, 1, 8], ask_count=True),
    *binary_q([1, 4, 7, 9, 12, 15, 18, 22, 25, 29, 33, 36, 40, 44, 47], 4),
    *match_q('ABABABABACABAC', 'ABAC'),
    *graph_qs([('A', 'B'), ('A', 'C'), ('B', 'C'), ('B', 'D'), ('C', 'E'), ('D', 'E'), ('D', 'F'), ('E', 'G')], 'A'),
    *topo_cycle_qs([('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'B'), ('A', 'E'), ('E', 'F')], 'ABCDEF'),
    *merge_qs([5, 1, 4, 2, 8, 6, 3, 7]),
    code_q('divide', '리스트 합을 분할 정복으로 구하는 코드의 출력 결과를 쓰시오. (합과 호출 횟수)', sum_code,
           '원소 n개를 끝까지 나누면 리프 n개 + 내부 노드 n−1개 = 2n−1번 호출합니다.'),
    q('divide', '퀵 정렬이 최악 O(n²)이 되는 입력의 예와 이유를 쓰시오. (첫 원소 피벗 기준)', '이미 정렬된(또는 역순) 리스트. 피벗이 항상 최솟값(최댓값)이라 한쪽 구간이 n−1개로 분할이 치우쳐 T(n) = T(n−1) + n이 되기 때문',
      'T(n) = T(n−1) + n → n(n+1)/2 → O(n²). 반대로 균등하게 나뉘면 T(n) = 2T(n/2) + n → O(n log n).'),
    q('divide', '병합 정렬과 퀵 정렬을 분할·정복·병합 단계의 "일하는 곳" 관점에서 비교하시오.', '병합 정렬은 분할이 단순(반으로)하고 병합 단계에서 비교·정렬 작업을 한다. 퀵 정렬은 분할(피벗 기준 나누기) 단계에서 작업을 하고 별도 병합이 없다.',
      '병합 정렬: 항상 O(n log n), 추가 공간 O(n), 안정. 퀵 정렬: 평균 O(n log n), 최악 O(n²), 제자리, 불안정.'),
]

SETS = [
    ('mock1', '모의고사 1회 · 기본', '1회 기본', '교과서 기본 입력으로 6개 영역을 고르게 확인합니다.', set1),
    ('mock2', '모의고사 2회 · 응용', '2회 응용', '조금 더 긴 입력과 탐색 실패, 하노이·피보나치 코드 읽기를 다룹니다.', set2),
    ('mock3', '모의고사 3회 · 고난도', '3회 고난도', '중복값 정렬, 사이클 있는 위상 정렬, 분할 정복 서술을 집중적으로 다룹니다.', set3),
]

# ---------- app data file ----------
lines = [
    "import type { ReviewQuestion } from '../../../shared/quiz/mistakeStorage'",
    '',
    '// 시험 유형 안내(분석·점화식·코드 읽기·정렬 회전·탐색·그래프·분할 정복)에 맞춘 예상 문제이며 실제 기출이 아닙니다.',
    '// 정답은 scripts/algorithm-mock/algo_gen.py가 실제 알고리즘을 실행해 계산했습니다. 손으로 고치지 말고 생성기를 다시 돌리세요.',
    '// 실행: python scripts/algorithm-mock/algo_gen.py src/features/algorithm/data/algorithmMockSets.ts <노트 폴더>',
    f'export const algorithmMockKinds: Record<string, string> = {json.dumps(KINDS, ensure_ascii=False)}',
    '',
    'export type AlgorithmMockSet = { view: string; title: string; short: string; guide: string; storageKey: string; questions: ReviewQuestion[] }',
    '',
    'export const algorithmMockSets: AlgorithmMockSet[] = [',
]
for view, title, short, guide, items in SETS:
    questions = [{'id': f'algo-{view}-{i + 1}', 'unit': KINDS[it['kind']], **it} for i, it in enumerate(items)]
    lines.append('  ' + json.dumps({'view': view, 'title': title, 'short': short, 'guide': guide,
                                    'storageKey': f'justStudy.algorithm.{view}.v1', 'questions': questions}, ensure_ascii=False) + ',')
lines.append(']')
APP_FILE.write_text('\n'.join(lines) + '\n', encoding='utf-8')

# ---------- vault notes ----------
for n, (view, title, short, guide, items) in enumerate(SETS, 1):
    md = ['---', '태그: [알고리즘, 모의고사]', '---', f'# 알고리즘 {title}', '',
          f'> 실제 기출 아님. {guide}', '> 정답은 실제 코드를 실행해 계산했어. 정답 칸을 눌러서 확인!', '']
    for kind, label in KINDS.items():
        group = [it for it in items if it['kind'] == kind]
        if not group:
            continue
        md += [f'## {label}', '']
        for it in group:
            num = items.index(it) + 1
            md.append(f"**{num}.** {it['prompt']}")
            if it.get('code'):
                md += ['```python', it['code'], '```']
            if it.get('options'):
                md.append(' / '.join(f'{"①②③④"[i]} {o}' for i, o in enumerate(it['options'])))
            md += ['> [!success]- 정답']
            md += ['> ' + line for line in str(it['answer']).split('\n')]
            md += ['>', f"> 💡 {it['explanation']}", '']
    others = ' · '.join(f'[[알고리즘 모의고사 {m}회]]' for m in (1, 2, 3) if m != n)
    md += [f'다른 회차: {others} · 정리: [[ALG 헷갈리는 포인트]]']
    (VAULT_DIR / f'알고리즘 모의고사 {n}회.md').write_text('\n'.join(md) + '\n', encoding='utf-8')

for view, title, *_rest, items in SETS:
    counts = {label: sum(1 for it in items if it['kind'] == k) for k, label in KINDS.items()}
    print(view, len(items), counts)
