"""Computed written-exam practice for rounds 4 and 5."""
import json
from functools import lru_cache
from itertools import product

from algo_engine import (bfs_order, binary_search, dfs_order, fmt, insertion_passes,
                         merge_sort_trace, quick_rounds, run_python, selection_passes,
                         seq_variants, string_match, topo_order)

GRAPH_DATA = {
    'mock4walk': {'start': 'A', 'order': 'alphabet', 'positions': {
        'A': [65, 80], 'B': [230, 55], 'C': [65, 235], 'D': [390, 55],
        'E': [230, 235], 'F': [390, 235], 'G': [540, 145]},
        'edges': [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'E'],
                  ['D', 'F'], ['E', 'F'], ['F', 'G']]},
    'mock5walk': {'start': 'D', 'order': 'alphabet', 'positions': {
        'A': [65, 70], 'B': [230, 60], 'C': [390, 60], 'D': [65, 235],
        'E': [230, 235], 'F': [390, 235], 'G': [540, 145]},
        'edges': [['A', 'B'], ['A', 'D'], ['B', 'C'], ['B', 'E'], ['C', 'F'],
                  ['D', 'E'], ['E', 'F'], ['E', 'G'], ['F', 'G']]},
    'mock4topo': {'start': '', 'order': 'alphabet', 'directed': True, 'positions': {
        'A': [65, 65], 'B': [65, 275], 'C': [230, 45], 'D': [230, 170],
        'E': [390, 275], 'F': [390, 70], 'G': [540, 170]},
        'edges': [['A', 'C'], ['A', 'D'], ['B', 'D'], ['B', 'E'], ['C', 'F'],
                  ['D', 'F'], ['E', 'G'], ['F', 'G']]},
    'mock5topo': {'start': '', 'order': 'alphabet', 'directed': True, 'positions': {
        'A': [65, 235], 'B': [65, 65], 'C': [230, 235], 'D': [230, 65],
        'E': [390, 145], 'F': [540, 235], 'G': [540, 65]},
        'edges': [['B', 'D'], ['D', 'A'], ['A', 'C'], ['C', 'E'], ['D', 'E'],
                  ['E', 'F'], ['E', 'G']]},
}


def question(kind, prompt, answer, explanation, **extra):
    return dict(kind=kind, prompt=prompt, answer=answer, explanation=explanation, **extra)


def choice(kind, prompt, options, correct, explanation, **extra):
    return question(kind, prompt, options[correct], explanation, options=options, correct=correct, **extra)


def output(kind, prompt, code, explanation):
    answer = run_python(code)
    return question(kind, prompt, answer, explanation, code=code,
                    accepted=list(dict.fromkeys([answer, answer.replace('\n', ' ')])))


def blanks(code, fills, explanation):
    completed = code
    for i, value in enumerate(fills, 1):
        completed = completed.replace(f'__{i}__', value)
    answer = run_python(completed)
    shown = code
    for i in range(1, len(fills) + 1):
        shown = shown.replace(f'__{i}__', f'【{i}】')
    labels = [f'빈칸 {i}' for i in range(1, len(fills) + 1)] + ['출력 결과']
    values = fills + [answer]
    alternatives = {'m + 1': ['m + 1', '1 + m'], 'j + 1': ['j + 1', '1 + j'],
                    'h * h * a': ['h * h * a', 'a * h * h', 'h * a * h'],
                    'i += 1': ['i += 1', 'i = i + 1'], 'j += 1': ['j += 1', 'j = j + 1']}
    accepted = [json.dumps([*variant, answer], ensure_ascii=False)
                for variant in product(*(alternatives.get(fill, [fill]) for fill in fills))]
    name = code.split('def ', 1)[1].split('(', 1)[0]
    return question('blank', f'함수 {name}의 동작을 읽고 빈칸과 출력 결과를 채우시오. 코드에 있는 변수명과 연산자를 사용하세요.',
                    '\n'.join(f'{label}: {value}' for label, value in zip(labels, values)),
                    explanation + '\n완성 코드의 실제 실행으로 출력 결과를 확인했습니다.', code=shown,
                    answerFields=labels, accepted=accepted)


def sort_table(method, values):
    if method == '퀵':
        trace = quick_rounds(values)
        rows = [[r['pivot'], r['at'], *r['values']] for r in trace]
        columns = ['선택 피벗', '최종 인덱스'] + [f'[{i}]' for i in range(len(values))]
        rule = ('현재 구간의 첫 원소 피벗, low=left+1, high=right. low는 피벗 이상, high는 피벗 이하에서 멈춥니다. '
                'low<high이면 교환 후 각각 +1, −1, 만나거나 엇갈리면 종료하고 A[left]와 A[high]를 교환합니다. '
                '왼쪽부터 재귀 처리하며 원소 1개 이하는 회전에 넣지 않습니다. 최종 인덱스는 전체 배열의 0부터 시작하는 위치입니다.')
    else:
        rows = selection_passes(values) if method == '선택' else insertion_passes(values)
        columns = [f'[{i}]' for i in range(len(values))]
        rule = ('남은 구간에서 최솟값을 찾아 첫 자리와 교환합니다. 동률이면 먼저 발견한 것을 선택합니다.' if method == '선택'
                else '두 번째 원소부터 key로 잡고, 앞의 정렬된 구간에서 key보다 큰 원소만 오른쪽으로 밀어 삽입합니다.')
        rule += ' 값이 바뀌지 않아도 1회전입니다.'
    labels = [f'{i+1}회전' for i in range(len(rows))]
    answer = '\n'.join(f'{label}: ' + ', '.join(map(str, row)) for label, row in zip(labels, rows))
    return question('sort', f'{method} 정렬로 {fmt(values)}를 오름차순 정렬하시오. 각 회전 직후의 전체 배열을 표에 넣으세요. {rule}',
                    answer, f'총 {len(rows)}회전입니다. '+rule,
                    sortVisual={'method': {'선택': 'selection', '삽입': 'insertion', '퀵': 'quick'}[method], 'values': list(values)},
                    answerTable={'columns': columns, 'rows': labels, 'initial': values},
                    accepted=[json.dumps([str(cell) for row in rows for cell in row])])


def graphs(round_number):
    walk = f'mock{round_number}walk'
    graph = GRAPH_DATA[walk]
    edges, start = graph['edges'], graph['start']
    items = []
    for name, compute in [('DFS', dfs_order), ('BFS', bfs_order)]:
        order = compute(edges, start)
        rule = '방문 즉시 기록하고, 미방문 이웃으로 재귀 호출합니다.' if name == 'DFS' else '큐에 넣을 때 방문 처리하며, 큐에서 꺼내는 순서를 답합니다.'
        items.append(question('graph', f'{start}에서 시작하는 {name} 순서대로 노드를 클릭하시오. 이웃은 알파벳순으로 확인합니다. {rule}',
                              ' → '.join(order), f'{name}: '+ ' → '.join(order) + '\n'+rule,
                              graph=walk, accepted=seq_variants(order)))
    key = f'mock{round_number}topo'
    graph = GRAPH_DATA[key]
    order, zero = topo_order(graph['edges'], sorted(graph['positions']))
    assert len(order) == len(graph['positions'])
    items.append(question('graph', '위상 정렬로 제거할 순서대로 노드를 클릭하시오. 매 단계에서 남은 그래프의 진입 차수가 0인 후보 중 알파벳이 가장 빠른 노드를 선택합니다.',
                          ' → '.join(order), '처음 후보: '+', '.join(zero)+'\n정답: '+' → '.join(order)+
                          '\n정점을 제거할 때 그 정점에서 나가는 간선도 없앱니다. 새 후보가 생기면 기존 후보와 함께 다시 알파벳순으로 비교합니다.',
                          graph=key, accepted=seq_variants(order)))
    return items


def recurrence(round_number, half):
    if round_number == 4 and not half:
        expr, base, closed = 'T(n−1)+3n', 3, lambda n: 3*n*(n+1)//2
        rec = lru_cache(None)(lambda n: base if n == 1 else rec(n-1)+3*n)
        answer = 'T(n)=T(n−2)+3(n−1)+3n\n=T(n−k)+3[(n−k+1)+…+n]\nn−k=1에서 k=n−1\nT(n)=3(1+2+…+n)=3n(n+1)/2 → O(n²)'
        explanation = '① T(n−1)=T(n−2)+3(n−1)을 원래 식의 T(n−1) 자리에 넣습니다.\n② T(n)=T(n−2)+3(n−1)+3n. 한 번 더 대입하면 T(n−3)+3(n−2)+3(n−1)+3n입니다.\n③ k회 대입하면 입력은 n−k이고, 추가 비용은 연속된 수의 합에 3을 곱한 값입니다.\n④ T(1)에서 멈추므로 n−k=1, k=n−1입니다.\n⑤ T(1)=3을 3×1로 생각하면 T(n)=3(1+2+…+n)입니다.\n⑥ 1부터 n까지의 합은 n(n+1)/2입니다. 상수 배를 제외하면 O(n²)입니다. n=3일 때 3+6+9=18로 확인할 수 있습니다.'
        ns = range(1, 40)
    elif round_number == 4:
        expr, base, closed = '2T(n/2)+n', 1, lambda n: n*(n.bit_length())
        rec = lru_cache(None)(lambda n: base if n == 1 else 2*rec(n//2)+n)
        answer = 'T(n)=4T(n/4)+2n=8T(n/8)+3n=2ᵏT(n/2ᵏ)+kn\nn/2ᵏ=1에서 k=log₂n\nT(n)=n+n log₂n → O(n log n)'
        explanation = '① n 대신 n/2를 넣어 T(n/2)=2T(n/4)+n/2를 만듭니다.\n② 식 전체를 대입하면 2[2T(n/4)+n/2]+n=4T(n/4)+2n입니다. 바깥의 2는 괄호 안 모든 항에 곱합니다.\n③ 다음은 4[2T(n/8)+n/4]+2n=8T(n/8)+3n입니다. 매번 n만큼 추가됩니다.\n④ k회 반복하면 2ᵏT(n/2ᵏ)+kn입니다.\n⑤ T(1)에서 멈추려면 n/2ᵏ=1, 즉 2ᵏ=n이어야 합니다. 2를 몇 번 곱해야 n이 되는지를 나타내는 값이 log₂n이므로 k=log₂n입니다.\n⑥ 2ᵏ=n과 T(1)=1을 넣어 n+n log₂n을 얻습니다. n=8이면 8+8×3=32입니다.'
        ns = [2**k for k in range(9)]
    elif not half:
        expr, base, closed = 'T(n−1)+2', 1, lambda n: 2*n-1
        rec = lru_cache(None)(lambda n: base if n == 1 else rec(n-1)+2)
        answer = 'T(n)=T(n−2)+4=T(n−3)+6=…=T(n−k)+2k\nn−k=1에서 k=n−1\nT(n)=1+2(n−1)=2n−1 → O(n)'
        explanation = '① T(n−1)=T(n−2)+2를 대입하면 T(n)=T(n−2)+2+2입니다.\n② 한 번 더 대입하면 T(n−3)+6입니다. 1회에 +2, 2회에 +4, k회에 +2k가 붙고 입력은 n−k가 됩니다.\n③ 값을 아는 T(1)로 바꾸려면 n−k=1이어야 하므로 k=n−1입니다.\n④ T(n)=T(1)+2(n−1)=1+2n−2=2n−1입니다.\n⑤ 최고차항이 n이므로 O(n)입니다. n=4이면 1+2+2+2=7입니다.'
        ns = range(1, 40)
    else:
        expr, base, closed = 'T(n/2)+3', 2, lambda n: 2+3*(n.bit_length()-1)
        rec = lru_cache(None)(lambda n: base if n == 1 else rec(n//2)+3)
        answer = 'T(n)=T(n/4)+6=T(n/8)+9=…=T(n/2ᵏ)+3k\nn/2ᵏ=1에서 k=log₂n\nT(n)=2+3 log₂n → O(log n)'
        explanation = '① T(n/2)=T(n/4)+3을 대입하면 T(n)=T(n/4)+6입니다.\n② 한 번 더 대입하면 T(n/8)+9입니다. k회 반복하면 입력은 n/2ᵏ이고 추가 비용은 3k입니다.\n③ T(1)에 도달하는 조건은 n/2ᵏ=1, 즉 2ᵏ=n입니다. 따라서 k=log₂n입니다.\n④ 초기값 T(1)=2를 넣으면 2+3 log₂n입니다.\n⑤ n=8일 때 8→4→2→1로 3번 줄고, 비용은 2+3×3=11입니다. 일정한 비용 3을 log₂n번 더하므로 O(log n)입니다.'
        ns = [2**k for k in range(9)]
    for n in ns:
        assert rec(n) == closed(n)
    suffix = ' n은 2의 비음수 정수 거듭제곱입니다.' if half else ''
    return question(
        'analysis', f'T(n)={expr}, T(1)={base}을 연속 대치법으로 풀고 시간 복잡도를 쓰시오. 대입 2회 이상, k회 일반형, 종료 조건, 최종 정리 과정을 모두 쓰세요.'+suffix,
        answer, explanation)


def make_sets():
    sets = []
    for number in (4, 5):
        if number == 4:
            loop = 'count = 0\nfor i in range(n):\n    j = 1\n    while j <= n:\n        count += 1\n        j *= 2'
            items = [choice('analysis', 'f(n)=7n²+20n+100의 가장 정확한 점근적 차수(Θ)는?', ['Θ(n)', 'Θ(n log n)', 'Θ(n²)', 'Θ(n³)'], 2, '최고차항은 7n²입니다. 낮은 차수와 상수 계수를 제거하면 Θ(n²)입니다.'),
                     choice('analysis', '다음 코드에서 count 증가 연산을 기준으로 가장 정확한 시간 복잡도는? (n≥1)', ['Θ(n)', 'Θ(log n)', 'Θ(n log n)', 'Θ(n²)'], 2, '바깥은 n번, 안쪽은 1, 2, 4, …로 ⌊log₂n⌋+1번입니다. 곱하면 Θ(n log n)입니다.', code=loop),
                     output('analysis', 'n=8일 때 count의 출력값은?', 'n = 8\n'+loop+'\nprint(count)', 'j=1, 2, 4, 8의 4번을 바깥 8번 동안 수행하므로 32입니다.'),
                     recurrence(4, False), recurrence(4, True)]
            items += [output('recursion', '다음 코드의 출력 순서를 쓰시오. (공백으로 구분)', 'def rina(n):\n    if n == 0:\n        return\n    print(n, end=" ")\n    rina(n - 1)\n    print(n, end=" ")\n\nrina(3)', '내려갈 때3,2,1을 출력하고, 돌아올 때1,2,3을 출력합니다.'),
                      output('recursion', '다음 코드의 출력값을 쓰시오.', 'def doro(n):\n    if n <= 1:\n        return n\n    return doro(n - 1) + doro(n - 2)\n\nprint(doro(6))', 'doro(0)=0, doro(1)=1. 이후1,2,3,5,8입니다.')]
            items += [sort_table('선택', [29, 10, 14, 37, 13]), sort_table('삽입', [8, 3, 7, 3, 2]), sort_table('퀵', [7, 2, 9, 4, 1, 8])]
            array, key, text, pattern = [3, 8, 12, 17, 25, 31, 46, 59, 72], 31, 'ABABACABA', 'ABAC'
        else:
            loop = 'count = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        count += 1'
            items = [choice('analysis', '충분히 큰 n에서 증가율이 느린 것부터 올바르게 나열한 것은?', ['log n < n < n log n < n² < 2ⁿ', 'n < log n < n² < n log n < 2ⁿ', 'log n < n < 2ⁿ < n² < n log n', 'n² < n log n < n < log n < 2ⁿ'], 0, '로그, 일차, 일차×로그, 이차, 지수 순서로 빨라집니다. 상수 배는 점근적 순서를 바꾸지 않습니다.'),
                     choice('analysis', '다음 코드의 가장 정확한 시간 복잡도는?', ['Θ(n)', 'Θ(n log n)', 'Θ(n²)', 'Θ(n³)'], 2, '증가 연산 횟수는 (n−1)+(n−2)+…+1=n(n−1)/2이므로 Θ(n²)입니다.', code=loop),
                     output('analysis', 'n=6일 때 count의 출력값은?', 'n = 6\n'+loop+'\nprint(count)', '5+4+3+2+1+0=15입니다.'), recurrence(5, False), recurrence(5, True)]
            items += [output('recursion', '다음 코드의 출력 순서를 쓰시오. (공백으로 구분)', 'def vemi(n):\n    if n <= 0:\n        return\n    vemi(n - 2)\n    print(n, end=" ")\n\nvemi(7)', '호출은7→5→3→1→−1이고, 복귀하며1,3,5,7을 출력합니다.'),
                      output('recursion', '다음 코드의 출력값을 쓰시오.', 'def lumo(a, l, r):\n    if l == r:\n        return a[l]\n    m = (l + r) // 2\n    return max(lumo(a, l, m), lumo(a, m + 1, r))\n\nprint(lumo([4, 11, 2, 9, 6], 0, 4))', '각 구간의 최댓값을 구한 뒤 두 값을 비교합니다. 전체 최댓값은 11입니다.')]
            items += [sort_table('선택', [6, 2, 6, 1, 4]), sort_table('삽입', [9, 7, 5, 3, 1]), sort_table('퀵', [5, 5, 2, 8, 1, 7])]
            array, key, text, pattern = [2, 6, 9, 15, 21, 28, 35, 42], 20, 'AAAABAAA', 'AAB'
        index, trace = binary_search(array, key)
        mids = [row[3] for row in trace]
        items += [question('search', f'A={fmt(array)}에서 key={key}를 이진 탐색할 때 비교하는 값을 순서대로 쓰시오. mid=(low+high)//2, 인덱스는 0부터입니다.', ' → '.join(map(str, mids)), '\n'.join(f'low={lo}, high={hi}, mid={mid}, 값={v}' for lo, hi, mid, v in trace), accepted=seq_variants(mids)),
                  question('search', f'같은 이진 탐색(A={fmt(array)},key={key})의 반환 인덱스는? 없으면−1입니다.', str(index), '탐색 성공 시mid를, low>high가 되면−1을 반환합니다.', accepted=[str(index)])]
        pos, count = string_match(text, pattern)
        items.append(question('search', f'텍스트 "{text}", 패턴 "{pattern}"을 왼쪽부터 억지 기법으로 탐색할 때 처음 일치할 때까지 문자 비교 횟수는? 불일치 비교도 세고, 일치 즉시 종료합니다.', str(count), f'첫 일치 시작 인덱스는 {pos}입니다. 각 시작 위치에서 왼쪽부터 비교하고 첫 불일치에서 다음 위치로 옮깁니다.', accepted=[str(count), f'{count}번']))
        items += graphs(number)
        values = [12, 5, 9, 1, 8, 3] if number == 4 else [10, 4, 7, 2, 9, 1, 6, 3]
        result, merges = merge_sort_trace(values)
        items += [question('divide', f'{fmt(values)}를 병합 정렬한다. 매번 앞쪽 ⌊n/2⌋개가 왼쪽 구간이며 왼쪽부터 재귀 처리한다. 마지막 병합 직전 왼쪽·오른쪽 정렬 리스트를 각각 쓰시오.', f"왼쪽: {fmt(merges[-1]['left'])}\n오른쪽: {fmt(merges[-1]['right'])}", '\n'.join(f"{fmt(m['left'])}+{fmt(m['right'])} → {fmt(m['merged'])}" for m in merges)),
                  question('divide', f'위 병합 정렬 {fmt(values)}에서 원소끼리 비교한 횟수의 총합은? 한쪽이 비면 남은 원소는 비교 없이 붙입니다.', str(sum(m['comparisons'] for m in merges)), '병합별 비교 횟수: '+', '.join(str(m['comparisons']) for m in merges)+f'\n최종 정렬: {fmt(result)}', accepted=[str(sum(m['comparisons'] for m in merges))]),
                  choice('divide', '서로 겹치지 않는 두 절반을 모두 재귀 처리하고, 결합에 Θ(n)이 걸린다. 올바른 점화식은? T(1)=Θ(1).', ['T(n)=T(n/2)+n', 'T(n)=2T(n/2)+n', 'T(n)=T(n−1)+1', 'T(n)=2T(n−1)+n'], 1, '절반 문제 2개를 모두 풀므로 2T(n/2), 결합 비용 n이 붙습니다. 깊이 log₂n, 각 단계 비용 n으로 Θ(n log n)입니다.'),
                  choice('divide', '첫 원소를 피벗으로 하는 퀵 정렬에서 정렬된 서로 다른 n개 원소를 입력했다. 분할이 매번 0개와 n−1개로 나뉠 때 최악 시간 복잡도는?', ['Θ(log n)', 'Θ(n)', 'Θ(n log n)', 'Θ(n²)'], 3, 'T(n)=T(n−1)+Θ(n)입니다. 합이 n+(n−1)+…+1이므로 Θ(n²)입니다.'),
                  output('divide', '같은 절반의 결과를 한 번만 계산하는 아래 코드의 출력은? (결과, 호출 횟수)', f'calls = 0\ndef zeri(a, n):\n    global calls\n    calls += 1\n    if n == 0:\n        return 1\n    h = zeri(a, n // 2)\n    if n % 2 == 0:\n        return h * h\n    return h * h * a\n\nprint(zeri({2 if number == 4 else 3}, {11 if number == 4 else 7}), calls)', '지수를 반으로 줄인 호출을 한 번만 합니다. n=0인 호출도 셉니다. 호출 깊이는 Θ(log n)이고, 같은 h를 곱셈에 재사용합니다.')]
        if number == 5:
            items[-3] = choice('divide', '입력 크기 n=8을 정확히 반씩 나누어 원소 1개까지 재귀 호출한다. 내부 호출은 자식 호출을 정확히 2개 만든다. 최초 호출과 크기 1 호출까지 포함한 총 호출 횟수는?', ['7', '8', '14', '15'], 3,
                               '호출 수는 깊이별 1+2+4+8=15입니다. 리프 n개와 내부 노드 n−1개를 합하면 2n−1입니다. log₂8=3은 깊이이지 총 호출 수가 아닙니다.')
            items[-2] = choice('divide', '아래 코드에서 n은 2의 거듭제곱이다. 곱셈을 상수 시간으로 셀 때 가장 정확한 시간 복잡도는?', ['Θ(log n)', 'Θ(n)', 'Θ(n log n)', 'Θ(n²)'], 1,
                               '같은 절반을 두 번 호출하므로 T(n)=2T(n/2)+Θ(1)입니다. 호출 수가 1+2+…+n=2n−1이어서 Θ(n)입니다. 절반 결과를 변수에 한 번 저장해 재사용하면 Θ(log n)으로 줄일 수 있습니다.',
                               code='def benu(a, n):\n    if n == 1:\n        return a\n    return benu(a, n // 2) * benu(a, n // 2)')
        master = [(2, 2, 1, 'Θ(n log n)'), (8, 2, 2, 'Θ(n³)')] if number == 4 else [(1, 2, 1, 'Θ(n)'), (9, 3, 2, 'Θ(n² log n)')]
        for a, b, d, answer in master:
            power = b**d
            relation = '=' if a == power else '>' if a > power else '<'
            rule = 'a=bᵈ이면Θ(nᵈ log n)' if a == power else 'a>bᵈ이면Θ(n^(log_b a))' if a > power else 'a<bᵈ이면Θ(nᵈ)'
            items.append(question('master', f'T(n)={a}T(n/{b})+n^{d}, T(1)=1에 마스터 정리를 적용하시오. a, b, d와 a와 bᵈ의 비교, 최종 복잡도를 쓰시오. n은 {b}의 거듭제곱입니다.', f'a={a}, b={b}, d={d}\nbᵈ={power}, a{relation}bᵈ\n{answer}', f'① T(n)=aT(n/b)+Θ(nᵈ)와 비교합니다.\n② 재귀 개수 a={a}, 입력 축소 비율 b={b}, 결합 비용 지수 d={d}입니다.\n③ bᵈ={power}이므로 a{relation}bᵈ입니다.\n④ {rule}를 적용하면 {answer}입니다.'))
        if number == 4:
            items += [blanks('def navo(a, x):\n    l, r = 0, len(a) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if a[m] == x:\n            return m\n        if a[m] < x:\n            l = __1__\n        else:\n            r = __2__\n    return -1\n\nprint(navo([2, 5, 8, 12, 19, 23], 19))', ['m + 1', 'm - 1'], '이진 탐색입니다. 작은 쪽을 제외할 때 l=m+1, 큰 쪽을 제외할 때 r=m−1입니다. 19의 인덱스는 4입니다.'),
                      blanks('def pavo(a):\n    for i in range(1, len(a)):\n        x, j = a[i], i - 1\n        while j >= 0 and a[j] > x:\n            a[j + 1] = __1__\n            j -= 1\n        a[__2__] = x\n    return a\n\nprint(pavo([4, 1, 3, 2]))', ['a[j]', 'j + 1'], '삽입 정렬입니다. 큰 원소를 오른쪽으로 밀고 j+1에 key를 삽입합니다. 출력은 [1, 2, 3, 4]입니다.'),
                      blanks('def keri(a, n):\n    if n == 0:\n        return 1\n    h = keri(a, __1__)\n    if n % 2 == 0:\n        return h * h\n    return __2__\n\nprint(keri(3, 5))', ['n // 2', 'h * h * a'], '빠른 거듭제곱입니다. 지수를 절반으로 줄이고 홀수면 a를 한 번 더 곱합니다. 3⁵=243입니다.')]
        else:
            items += [blanks('def mavo(l, r):\n    i = j = 0\n    out = []\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            out.append(l[i])\n            __1__\n        else:\n            out.append(r[j])\n            __2__\n    return out + l[i:] + r[j:]\n\nprint(mavo([1, 6, 9], [2, 4, 10]))', ['i += 1', 'j += 1'], '정렬된 두 리스트의 병합입니다. 선택한 쪽의 인덱스만 1 늘립니다. 출력은 [1, 2, 4, 6, 9, 10]입니다.'),
                      blanks('def tevo(a):\n    if len(a) <= 1:\n        return a\n    p = a[len(a) // 2]\n    l, m, r = [], [], []\n    for x in a:\n        if x < p:\n            l.append(x)\n        elif x > p:\n            r.append(x)\n        else:\n            m.append(x)\n    return tevo(__1__) + m + tevo(__2__)\n\nprint(tevo([5, 2, 5, 1, 4]))', ['l', 'r'], '중앙 원소 피벗의 리스트 분할 퀵 정렬입니다. 작은 값 리스트와 큰 값 리스트만 재귀 정렬합니다. 동일 값 m은 그대로 결합합니다.'),
                      blanks('def gavo(v, g, seen, out):\n    seen.add(v)\n    out.append(v)\n    for u in sorted(g[v]):\n        if u not in __1__:\n            gavo(__2__, g, seen, out)\n\ng = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C"]}\nout = []\ngavo("A", g, set(), out)\nprint(" ".join(out))', ['seen', 'u'], 'DFS 재귀 탐색입니다. 방문 집합 seen을 확인하고 미방문 이웃 u를 재귀 호출합니다. A→B→D→C 순서입니다.')]
        assert len(items) == 26, len(items)
        assert sum(q['kind'] == 'analysis' for q in items) == 5
        assert sum(q['kind'] == 'master' for q in items) == 2
        sets.append((f'mock{number}', f'모의고사 {number}회 · 필기 종합', f'{number}회 필기', '분석5 · 그래프 클릭 · 정렬 표 · 분할 정복 · 코드 빈칸', items))
    return sets
