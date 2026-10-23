"""Two complete pre-exam papers; answers computed from actual algorithms."""
import json
from collections import Counter
from functools import lru_cache

from algo_engine import (bfs_order, dfs_order, binary_search, fmt, merge_sort_trace,
                         run_python, seq_variants, string_match, topo_order)
from extended_mock_sets import question, sort_table, recurrence
from recurrence_explanations import EXPLANATIONS

PRE_KINDS = {'dfs': 'DFS', 'bfs': 'BFS', 'topological': '위상 정렬',
             'selection': '선택 정렬', 'insertion': '삽입 정렬', 'quick': '퀵 정렬', 'merge': '병합 정렬',
             'binary': '이진 탐색', 'matching': '문자열 탐색', 'sum': '분할 덧셈',
             'substitution': '연속 대치법', 'master': '마스터 정리'}
PRE_GRAPHS = {}
POSITIONS = {'A': [65, 65], 'B': [65, 265], 'C': [230, 65], 'D': [230, 265],
             'E': [390, 65], 'F': [390, 265], 'G': [540, 165]}
WALKS = [
    ([('A','B'),('A','C'),('B','D'),('B','E'),('C','E'),('D','F'),('E','G')], 'A'),
    ([('A','C'),('A','D'),('B','C'),('B','E'),('C','F'),('D','E'),('E','G'),('F','G')], 'C'),
    ([('A','B'),('A','D'),('B','C'),('B','E'),('C','F'),('D','F'),('E','G'),('F','G')], 'D'),
    ([('A','B'),('A','C'),('B','E'),('C','D'),('C','F'),('D','G'),('E','F')], 'B'),
    ([('A','D'),('A','E'),('B','D'),('B','F'),('C','E'),('C','G'),('D','E'),('F','G')], 'E'),
    ([('A','B'),('A','F'),('B','C'),('B','D'),('C','E'),('D','G'),('E','F'),('F','G')], 'F'),
]


def fields(kind, prompt, labels, values, explanation, **extra):
    strings = list(map(str, values))
    return question(kind, prompt, '\n'.join(f'{k}: {v}' for k, v in zip(labels, strings)), explanation,
                    answerFields=labels, accepted=[json.dumps(strings, ensure_ascii=False)], **extra)


def merge_rounds(values):
    a, result = list(values), []
    def visit(left, right):
        if right-left <= 1:
            return
        mid = (left+right)//2
        visit(left, mid)
        visit(mid, right)
        l, r = a[left:mid], a[mid:right]
        merged, i, j = [], 0, 0
        while i<len(l) and j<len(r):
            if l[i]<=r[j]:
                merged.append(l[i]); i+=1
            else:
                merged.append(r[j]); j+=1
        merged += l[i:]+r[j:]
        a[left:right] = merged
        result.append({'values': list(a), 'left': left, 'right': right-1, 'merged': merged})
    visit(0,len(a))
    expected, old = merge_sort_trace(values)
    assert a==expected==sorted(values)
    assert [r['merged'] for r in result]==[r['merged'] for r in old]
    return result


def merge_question(values):
    trace = merge_rounds(values)
    rows = [f"{i+1}회 병합 [{r['left']}~{r['right']}]" for i,r in enumerate(trace)]
    return question('merge', f'배열 {fmt(values)}를 병합 정렬하시오. 각 구간을 앞쪽 ⌊길이/2⌋개와 나머지로 나누고 왼쪽부터 재귀 처리합니다. 두 정렬 구간의 병합이 한 번 끝날 때마다 전체 배열을 표에 적으세요. 같은 값은 왼쪽 것을 먼저 선택합니다.',
                    '\n'.join(f"{label}: {fmt(r['values'])}" for label,r in zip(rows,trace)),
                    '한 번의 병합은 두 정렬 구간을 합치는 작업입니다. 아직 처리하지 않은 다른 구간의 원소도 표에 그대로 적습니다.\n'+
                    '\n'.join(f"{label}: 부분 결과 {fmt(r['merged'])}" for label,r in zip(rows,trace)),
                    sortVisual={'method':'merge','values':values},
                    answerTable={'columns':[f'[{i}]' for i in range(len(values))], 'rows':rows, 'initial':values, 'checkRows':True},
                    accepted=[json.dumps([str(v) for r in trace for v in r['values']])])


def graph_questions(paper):
    items=[]
    for method, compute in [('dfs',dfs_order),('bfs',bfs_order)]:
        for index in range(3):
            edges, start = WALKS[(paper-1)*3+index]
            key=f'mockPre{paper}walk{index+1}'
            PRE_GRAPHS[key]={'start':start, 'order':'alphabet','positions':POSITIONS,'edges':edges}
            order=compute(edges,start)
            assert len(order)==7
            rule='방문 즉시 기록하고 미방문 이웃으로 재귀 호출합니다.' if method=='dfs' else '큐에 넣을 때 방문 처리하고 큐에서 꺼내는 순서를 답합니다.'
            items.append(question(method,f'{method.upper()} {index+1}: {start}에서 시작해 방문할 순서대로 노드를 클릭하시오. 이웃은 알파벳순으로 확인합니다. '+rule,
                                  ' → '.join(order),'방문 순서: '+' → '.join(order)+'\n'+rule,
                                  graph=key,accepted=seq_variants(order)))
    permutations = ['ABCDEFG','BDACEFG','CADBFEG'] if paper==1 else ['DACBGEF','BCADEGF','CFABDEG']
    base_edges=[(0,2),(0,3),(1,3),(1,4),(2,5),(3,5),(4,6),(5,6)]
    coords=[(65,65),(65,275),(230,45),(230,170),(390,275),(390,70),(540,170)]
    for index,nodes in enumerate(permutations):
        edges=[(nodes[a],nodes[b]) for a,b in base_edges]
        order, first = topo_order(edges,nodes)
        key=f'mockPre{paper}topo{index+1}'
        PRE_GRAPHS[key]={'start':'','order':'alphabet','directed':True,'positions':dict(zip(nodes,coords)),'edges':edges}
        items.append(question('topological',f'위상 정렬 {index+1}: 제거할 순서대로 노드를 클릭하시오. 매 단계에서 남은 진입 차수가 0인 후보 중 알파벳이 가장 빠른 노드를 고릅니다.',
                              ' → '.join(order),'처음 후보: '+', '.join(first)+'\n정답: '+' → '.join(order)+'\n정점을 제거하면 나가는 간선도 제거하고 새 후보와 기존 후보를 함께 비교합니다.',graph=key,accepted=seq_variants(order)))
    return items


def searching_questions(paper):
    data = [([1,3,5,7,9,11,13],9),([2,4,6,8,10,12,14,16],2),([1,4,6,8,10,13,15],7)] if paper==1 else [([1,2,4,5,7,8,10,12],12),([2,3,6,7,9,11,14],6),([1,3,4,6,8,9,12,15],5)]
    items=[]
    for index,(a,key) in enumerate(data):
        found, trace=binary_search(a,key)
        sequence=' '.join(str(row[3]) for row in trace)
        items.append(fields('binary',f'이진 탐색 {index+1}: A={fmt(a)}, 찾는 값={key}. low=0, high=len(A)−1, mid=(low+high)//2로 탐색합니다. 비교하는 값을 순서대로 쓰고 반환 인덱스를 쓰시오. 없으면 −1입니다.',
                            ['비교하는 값 순서 · 공백으로 구분','반환 인덱스'],[sequence,found],
                            '\n'.join(f'low={lo}, high={hi}, mid={mid}, A[mid]={value}' for lo,hi,mid,value in trace)+f'\n반환 {found}'))
    data=[('ABABACAB','ABAC'),('AAAABAA','AAB'),('ABCABCAB','ABD')] if paper==1 else [('BANANANA','NANA'),('AAAAAB','AAAB'),('ABACABAB','BAB')]
    for index,(text,pattern) in enumerate(data):
        position, comparisons=string_match(text,pattern)
        details=[]
        for start in range(len(text)-len(pattern)+1):
            count=0
            for j,ch in enumerate(pattern):
                count+=1
                if text[start+j]!=ch: break
            details.append(f'시작 인덱스 {start}: {count}회 비교')
            if start==position:break
        items.append(fields('matching',f'문자열 탐색 {index+1}: 텍스트 "{text}", 패턴 "{pattern}". 패턴 시작 위치를 한 칸씩 옮기며 왼쪽부터 비교하는 억지 기법을 사용합니다. 첫 일치에서 종료합니다. 시작 인덱스와 총 문자 비교 횟수를 쓰시오. 불일치 비교도 세고, 없으면 인덱스는 −1입니다.',
                            ['첫 일치 시작 인덱스','총 문자 비교 횟수'],[position,comparisons],'\n'.join(details)+f'\n총 {comparisons}회, 반환 {position}'))
    return items


def sum_questions(paper):
    a,b,c=([[3,1,4,2],[2,5,2,1,3],[1,3,2,4]] if paper==1 else [[2,4,1,3,2],[4,1,4,2,3,1],[2,2,1,3,2,4]])
    code='calls = 0\ndef calc(a, left, right):\n    global calls\n    calls += 1\n    if right - left == 1:\n        return a[left]\n    mid = (left + right) // 2\n    return calc(a, left, mid) + calc(a, mid, right)\n\n'+f'A = {a}\nprint(calc(A, 0, len(A)), calls)'
    result=run_python(code).split()
    assert list(map(int,result))==[sum(a),2*len(a)-1]
    q1=fields('sum','분할 덧셈 1: 아래 코드가 출력하는 합과 총 호출 횟수를 구하시오. right는 구간에 포함되지 않으며 최초 호출과 원소 한 개 호출도 셉니다.', ['출력되는 합','출력되는 호출 횟수'],result,
              f'합은 {sum(a)}입니다. 크기 1 호출은 {len(a)}개이고 내부 호출은 {len(a)-1}개이므로 총 {2*len(a)-1}회입니다.',code=code)
    m=len(b)//2
    q2=fields('sum',f'분할 덧셈 2: {fmt(b)}를 앞쪽 ⌊n/2⌋개와 나머지로 나눠 각각 재귀적으로 더합니다. 최초 분할의 왼쪽 부분합, 오른쪽 부분합, 전체 합을 구하시오.', ['왼쪽 부분합','오른쪽 부분합','전체 합'],[sum(b[:m]),sum(b[m:]),sum(b)],f'왼쪽 {fmt(b[:m])} → {sum(b[:m])}\n오른쪽 {fmt(b[m:])} → {sum(b[m:])}\n전체 {sum(b)}')
    code='def calc(a):\n    if len(a) == 1:\n        return a[0]\n    mid = len(a) // 2\n    value = calc(a[:mid]) + calc(a[mid:])\n    print(value, end=" ")\n    return value\n\n'+f'A = {c}\nanswer = calc(A)\nprint()\nprint(answer)'
    lines=run_python(code).split('\n')
    q3=fields('sum','분할 덧셈 3: 재귀가 돌아오며 부분합을 출력한다. 첫 줄의 출력 순서와 마지막 줄의 전체 합을 쓰시오.', ['첫 줄 출력 순서 · 공백으로 구분','마지막 줄 전체 합'],lines,
              '왼쪽 구간을 끝까지 계산하고 오른쪽 구간을 계산한 뒤 두 합을 더해 출력합니다. 최초 전체 합은 마지막 부분합으로도 출력되고, 마지막 print(answer)에서도 다시 출력됩니다.',code=code)
    return [q1,q2,q3]


def substitutions(paper):
    records=[('T(n)=T(n−1)+n, T(1)=1','T(n)=T(n−k)+(n−k+1)+…+n; k=n−1; T(n)=n(n+1)/2 → O(n²)','r1'),
             ('T(n)=T(n/2)+n, T(1)=1','T(n)=T(n/2ᵏ)+n+n/2+…+n/2^(k−1); k=log₂n; T(n)=2n−1 → O(n)','r2')] if paper==1 else [
             ('T(n)=T(n−1)+2n, T(1)=2','T(n)=T(n−k)+2[(n−k+1)+…+n]; k=n−1; T(n)=n(n+1) → O(n²)','r3'),
             ('T(n)=2T(n−1)+1, T(1)=1','T(n)=2ᵏT(n−k)+(2ᵏ−1); k=n−1; T(n)=2ⁿ−1 → O(2ⁿ)','r5')]
    result=[question('substitution',f'연속 대치법 {i+1}: {expr}. 대입 2회 이상 → k회 일반형 → T(1) 종료 조건 → 최종 식과 시간 복잡도를 모두 쓰시오. 나눗셈이 있으면 n은 2의 거듭제곱입니다.',answer,EXPLANATIONS[key]) for i,(expr,answer,key) in enumerate(records)]
    third=recurrence(4,True) if paper==1 else recurrence(5,True)
    third['kind']='substitution'
    third['prompt']='연속 대치법 3: '+third['prompt']
    result.append(third)
    return result


def make_pre_exam_sets():
    sets=[]
    for paper in (1,2):
        items=graph_questions(paper)
        arrays = {
            '선택': [[7,2,5,1,6,3,4],[4,2,4,1,3,2,5,1],[1,2,3,5,4,7,6,8]],
            '삽입': [[6,2,5,1,7,3,4],[3,2,3,1,2,4,1,5],[2,1,4,3,6,5,8,7]],
            '퀵': [[4,1,7,2,6,3,5],[3,3,1,5,2,4,3,2],[6,1,5,2,7,3,4,2]],
            '병합': [[7,2,5,1,6,3,4],[3,1,3,2,1,4,2,5],[8,2,6,1,7,3,5,4]],
        } if paper==1 else {
            '선택': [[6,3,7,1,5,2,4],[2,4,2,1,3,5,1,4],[8,7,6,5,4,3,2,1]],
            '삽입': [[4,2,7,1,6,3,5],[2,2,1,4,3,1,5,3],[1,3,2,5,4,7,6,8]],
            '퀵': [[2,6,1,7,4,3,5],[4,2,4,1,3,5,2,4],[5,1,3,2,7,4,6,3]],
            '병합': [[2,6,1,7,3,5,4],[2,3,2,1,5,1,4,3],[4,1,3,2,4,1,5,2]],
        }
        for method, values_list in arrays.items():
            for index,values in enumerate(values_list):
                q=merge_question(values) if method=='병합' else sort_table(method,values)
                q['kind']={'선택':'selection','삽입':'insertion','퀵':'quick','병합':'merge'}[method]
                q['prompt']=f'{method} 정렬 {index+1}: '+q['prompt']
                q['answerTable']['checkRows']=True
                items.append(q)
        items+=searching_questions(paper)+sum_questions(paper)+substitutions(paper)
        master=[(2,2,1,'Θ(n log n)'),(4,2,1,'Θ(n²)')] if paper==1 else [(1,2,1,'Θ(n)'),(9,3,2,'Θ(n² log n)')]
        for index,(a,b,d,answer) in enumerate(master):
            comparison='=' if a==b**d else '<' if a<b**d else '>'
            rule='Θ(nᵈ log n)' if comparison=='=' else 'Θ(nᵈ)' if comparison=='<' else 'Θ(n^(log_b a))'
            items.append(question('master',f'마스터 정리 {index+1}: T(n)={a}T(n/{b})+n^{d}, T(1)=1. a, b, d를 찾고 a와 bᵈ를 비교한 뒤 적용한 공식과 시간 복잡도를 쓰시오.',
                                  f'a={a}, b={b}, d={d}\nbᵈ={b**d}, a{comparison}bᵈ\n{rule} 적용 → {answer}',
                                  f'재귀 호출 앞의 수가 a={a}, n을 나누는 수가 b={b}, 바깥 비용에서 n의 지수가 d={d}입니다. bᵈ={b**d}를 먼저 계산하고 a와 비교하면 {comparison}인 경우입니다. 공식 {rule}에 대입하면 {answer}입니다.'))
        assert len(items)==35,len(items)
        assert Counter(q['kind'] for q in items)==Counter({kind:2 if kind=='master' else 3 for kind in PRE_KINDS})
        questions=[{'id':f'algo-preexam{paper}-{i+1}','unit':PRE_KINDS[q['kind']],**q} for i,q in enumerate(items)]
        sets.append({'view':f'preexam{paper}','title':f'시험 직전 {paper}번 시험지','short':f'{paper}번 시험지','guide':'그래프9 · 정렬12 · 탐색6 · 분할덧셈3 · 연속대치3 · 마스터2',
                     'storageKey':f'justStudy.algorithm.preexam{paper}.v1','questions':questions})
    return sets
