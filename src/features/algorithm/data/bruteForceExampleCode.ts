export const bruteForceExampleDescriptions = {
  selection: [
    ['문제 설명', '정렬은 레코드를 키의 순서로 재배열하는 것이다. 키는 정렬 기준이며 숫자 리스트에서는 숫자 자체가 키다. n개 항목을 오름차순으로 정렬하라. 예: [8, 3, 2, 9, 7, 1, 5, 4] → [1, 2, 3, 4, 5, 7, 8, 9].'],
    ['억지 기법 전략', '입력에서 가장 작은 항목을 찾아 꺼내 별도 결과 리스트 뒤에 저장한다. 이를 제자리 정렬로 개선하려면 아직 정렬되지 않은 구간의 최솟값을 찾아 그 구간의 첫 항목과 교환한다. 매 단계 앞의 한 자리가 확정된다.'],
    ['복잡도', '표준 선택 정렬의 비교 횟수는 n(n−1)/2회다. 최선·평균·최악 모두 O(n²)이다. 별도 리스트 방식은 O(n), 제자리 교환 방식은 O(1)의 추가 공간을 사용한다. 제자리 정렬에서도 교환용 임시 변수는 사용할 수 있다.'],
  ],
  sequential: [
    ['문제 설명', '리스트에서 탐색 키와 같은 첫 번째 항목의 인덱스를 찾아라. 없으면 −1을 반환한다. 예: [34, 12, 78, 5, 63, 27, 91, 18, 56, 42, 7, 85]에서 42를 찾으면 인덱스 9이다. 정렬되지 않은 리스트에도 적용할 수 있다.'],
    ['억지 기법 전략', '순차 탐색 또는 선형 탐색은 첫 항목부터 차례로 탐색 키와 하나씩 비교하는 직접적인 방법이다. 같으면 즉시 위치를 반환하고, 끝까지 일치하지 않을 때 −1을 반환한다.'],
    ['복잡도', '최선은 첫 항목에서 발견하는 경우로 비교 1회, O(1)이다. 최악은 마지막에서 찾거나 없는 경우로 n회, O(n)이다. 탐색에 성공하며 각 위치에 같은 확률로 존재하면 평균 비교는 (n+1)/2회, O(n)이다. 추가 공간은 O(1)이다.'],
  ],
  matching: [
    ['문제 설명', '길이 n인 텍스트 T에서 길이 m인 패턴 P가 처음 나타나는 시작 인덱스를 찾아라. 없으면 −1을 반환한다. 예: T=ABABABABACABAC, P=ABAC이면 시작 위치는 6이다. 인덱스는 0부터 센다.'],
    ['억지 기법 전략', '텍스트의 첫 번째 문자 위치에 패턴을 놓고 왼쪽부터 비교한다. 불일치하면 패턴을 오른쪽으로 한 칸 옮겨 처음부터 다시 비교한다. 모든 문자가 일치하면 그 시작 위치를 반환한다.'],
    ['복잡도', 'n≥m≥1에서 후보 시작 위치는 n−m+1개이며 각 위치에서 최대 m회 비교한다. 최악 O((n−m+1)m), 간단히 O(nm)이다. 첫 위치에서 일치하면 m회 비교하므로 최선 O(m)이다. 추가 공간은 O(1)이다.'],
  ],
  closest: [
    ['문제 설명', '평면 위 n개 점에서 가장 가까운 두 점과 그 거리를 찾아라. 거리는 √((x₁−x₂)²+(y₁−y₂)²)이다. 예: A(1,1), B(2,2), C(5,1), D(5,4), E(8,2), F(9,6), G(2,7), H(6,8)의 최근접 쌍은 A·B, 거리는 √2다.'],
    ['억지 기법 전략', '가능한 모든 서로 다른 두 점의 거리를 계산하고 지금까지의 최소 거리와 쌍을 갱신한다. i<j인 쌍만 비교해 자기 자신과 역순 중복을 제외한다. 제곱 거리로 비교한 뒤 마지막에만 제곱근을 계산할 수도 있다.'],
    ['복잡도', '비교하는 점 쌍은 n(n−1)/2개다. 모든 쌍을 조사하는 이 방식의 시간 복잡도는 O(n²)이고, 최소 거리와 쌍만 기억하면 추가 공간은 O(1)이다.'],
  ],
}

export const bruteForceExampleCode = {
  selection: `# 기본 전략: 최솟값을 꺼내 별도 리스트에 저장
def selection_with_result(values):
    remaining = values.copy()
    result = []
    while remaining:
        least = min(remaining)
        remaining.remove(least)
        result.append(least)
    return result

# 개선: 원래 리스트 안에서 교환하는 제자리 선택 정렬
def selection_sort(values):
    for i in range(len(values) - 1):
        least = i
        for j in range(i + 1, len(values)):
            if values[j] < values[least]:
                least = j
        values[i], values[least] = values[least], values[i]
    return values

data = [8, 3, 2, 9, 7, 1, 5, 4]
print(selection_with_result(data))  # [1, 2, 3, 4, 5, 7, 8, 9]
print(selection_sort(data))         # [1, 2, 3, 4, 5, 7, 8, 9]`,
  sequential: `def sequential_search(values, key):
    # 첫 항목부터 키와 하나씩 비교
    for i in range(len(values)):
        if values[i] == key:
            return i
    # 끝까지 일치하는 항목이 없을 때만 실행
    return -1

data = [34, 12, 78, 5, 63, 27, 91, 18, 56, 42, 7, 85]
print(sequential_search(data, 42))  # 9
print(sequential_search(data, 100))  # -1`,
  matching: `def string_search(text, pattern):
    n, m = len(text), len(pattern)
    # 빈 패턴은 시작 위치 0에서 일치한다고 정의
    if m == 0:
        return 0
    # 패턴이 들어갈 수 있는 시작 위치를 한 칸씩 이동
    for start in range(n - m + 1):
        j = 0
        while j < m and text[start + j] == pattern[j]:
            j += 1
        if j == m:
            return start
    return -1

print(string_search("ABABABABACABAC", "ABAC"))  # 6
print(string_search("ABABABABACABAC", "XYZ"))   # -1`,
  closest: `from math import sqrt

def closest_pair(points):
    if len(points) < 2:
        raise ValueError("점이 두 개 이상 필요합니다.")
    best_pair = None
    min_squared = float("inf")
    # i < j인 쌍만 조사해 자기 자신과 역순 중복을 제외
    for i in range(len(points) - 1):
        for j in range(i + 1, len(points)):
            dx = points[i][0] - points[j][0]
            dy = points[i][1] - points[j][1]
            squared = dx * dx + dy * dy
            if squared < min_squared:
                min_squared = squared
                best_pair = (i, j)
    # 비교는 제곱 거리로, 최종 거리만 제곱근 계산
    return best_pair, sqrt(min_squared)

points = [(1, 1), (2, 2), (5, 1), (5, 4), (8, 2), (9, 6), (2, 7), (6, 8)]  # A~H
pair, distance = closest_pair(points)
print(pair)                   # (0, 1): A와 B
print(round(distance, 3))     # 1.414`,
}
