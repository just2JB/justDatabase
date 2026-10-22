import './master-theorem.css'

const examples = [
  { expression: 'T(n)=2T(n/2)+n', symbols: 'a=2, b=2, d=1', compare: 'bᵈ=2¹=2. a=2이므로 a=bᵈ입니다.', rule: '같은 경우의 공식 Θ(nᵈ log n)을 고릅니다.', result: 'Θ(n¹ log n)=Θ(n log n)', note: '두 절반을 모두 정렬하고 병합에 n만큼 일하는 병합 정렬의 모델입니다.' },
  { expression: 'T(n)=8T(n/2)+n²', symbols: 'a=8, b=2, d=2', compare: 'bᵈ=2²=4. a=8이므로 a>bᵈ입니다.', rule: '큰 경우의 공식 Θ(n^(log_b a))를 고릅니다.', result: 'Θ(n^(log₂8))=Θ(n³)', note: '2³=8이므로 log₂8=3입니다. n²만 보고 답을 고르면 재귀 호출의 비용을 빠뜨립니다.' },
  { expression: 'T(n)=T(n/2)+n', symbols: 'a=1, b=2, d=1', compare: 'T 앞에 숫자가 없으면 1입니다. bᵈ=2¹=2이므로 a<bᵈ입니다.', rule: '작은 경우의 공식 Θ(nᵈ)을 고릅니다.', result: 'Θ(n¹)=Θ(n)', note: '입력이 절반이 되어도 현재 n만큼 일합니다. 비용 n+n/2+n/4+…를 모두 더하면 n에 비례합니다.' },
  { expression: 'T(n)=9T(n/3)+n²', symbols: 'a=9, b=3, d=2', compare: 'bᵈ=3²=9. a=9이므로 a=bᵈ입니다.', rule: '같은 경우의 공식 Θ(nᵈ log n)을 고릅니다.', result: 'Θ(n² log n)', note: 'n/3의 3은 b이고, 재귀 호출 앞의 9는 a입니다. 두 숫자의 역할을 바꾸지 마세요.' },
]

export default function MasterTheoremLesson() {
  return <div className="master-lesson">
    <p>마스터 정리는 <strong>분할 정복 점화식의 시간 복잡도를 빠르게 구하는 방법</strong>입니다. 연속 대치법처럼 끝까지 펼치는 대신, 식에서 세 숫자를 찾고 어느 공식에 해당하는지 판단합니다.</p>
    <p className="master-formula">T(n) = aT(n/b) + Θ(nᵈ)</p>
    <p>여기서는 a≥1, b&gt;1, d≥0이며, 초기 비용 T(1)은 양의 상수라고 가정합니다. 처음에는 n이 b의 거듭제곱인 경우로 생각하면 됩니다. Θ는 정확한 증가 차수를 뜻하며, 같은 식을 O로 쓰면 상한을 나타냅니다.</p>

    <h3>1. 먼저 a·b·d를 찾기</h3>
    <div className="table-wrap"><table><thead><tr><th>기호</th><th>식에서 찾을 곳</th><th>T(n)=4T(n/2)+3n²의 경우</th></tr></thead><tbody>
      <tr><th scope="row">a</th><td>T 앞의 계수 · 실제로 푸는 부분 문제 수</td><td>4T이므로 a=4</td></tr>
      <tr><th scope="row">b</th><td>T 안에서 n을 나누는 수 · 입력 축소 비율</td><td>n/2이므로 b=2</td></tr>
      <tr><th scope="row">d</th><td>재귀 항 바깥 비용에서 n의 지수</td><td>3n²이므로 d=2. 앞의 3은 상수 배</td></tr>
    </tbody></table></div>
    <p><strong>d는 재귀 호출 안의 n에서 찾지 않습니다.</strong> 바깥 비용이 1 또는 7처럼 상수면 n⁰에 비례하므로 d=0입니다. n이나 5n이면 d=1, n²이나 3n²이면 d=2입니다.</p>

    <h3>2. bᵈ를 계산한 뒤 a와 비교하기</h3>
    <p>예를 들어 b=2, d=2이면 bᵈ=2²=4입니다. 이 <strong>숫자 4와 a를 비교</strong>합니다. a와 n을 비교하거나, nᵈ를 계산하는 단계가 아닙니다.</p>
    <div className="table-wrap"><table><thead><tr><th>비교 결과</th><th>적용할 공식</th><th>왜 이렇게 되는가?</th></tr></thead><tbody>
      <tr><th scope="row">a &lt; bᵈ</th><td>Θ(nᵈ)</td><td>아래 단계로 갈수록 전체 비용이 줄어, 위쪽 비용이 기준이 됩니다.</td></tr>
      <tr><th scope="row">a = bᵈ</th><td>Θ(nᵈ log n)</td><td>단계마다 비용이 비슷합니다. 약 log_b n개의 단계 비용을 더합니다.</td></tr>
      <tr><th scope="row">a &gt; bᵈ</th><td>Θ(n^(log_b a))</td><td>아래 단계로 갈수록 전체 비용이 커져, 많은 재귀 호출의 비용이 기준이 됩니다.</td></tr>
    </tbody></table></div>
    <p>기억할 순서: <strong>a·b·d 찾기 → bᵈ 계산 → 대소 비교 → 해당 공식에 대입</strong>. 같은 경우에는 nᵈ 뒤에 log n이 붙습니다. a가 더 큰 경우에는 지수가 d가 아니라 log_b a로 바뀝니다.</p>

    <h3>3. 모의고사 4·5회 문제를 차례대로 풀기</h3>
    {examples.map((example, index) => <article className="master-worked-example" key={example.expression}>
      <h4>예제 {index+1} · {example.expression}</h4>
      <ol>
        <li>세 숫자 찾기: <strong>{example.symbols}</strong></li>
        <li>비교: {example.compare}</li>
        <li>공식 선택: {example.rule}</li>
        <li>대입해서 정리: <strong>{example.result}</strong></li>
      </ol>
      <p>{example.note}</p>
    </article>)}

    <h3>4. 상수 비용에서는 d=0</h3>
    <p><strong>T(n)=T(n/2)+1</strong>이면 a=1, b=2, d=0입니다. bᵈ=2⁰=1이므로 같은 경우입니다. Θ(n⁰ log n)=Θ(log n)입니다. n⁰=1이므로 n이 앞에 붙지 않습니다. 이진 탐색의 최악 비용 모델입니다.</p>
    <p><strong>T(n)=2T(n/2)+1</strong>이면 a=2, b=2, d=0입니다. bᵈ=1보다 a가 크므로 Θ(n^(log₂2))=Θ(n)입니다. 절반 두 개를 모두 처리하는 리스트 합의 비용 모델입니다.</p>

    <h3>5. 필기시험에는 이렇게 쓰기</h3>
    <pre className="master-answer-template">{`T(n)=8T(n/2)+n²
① a=8, b=2, d=2
② bᵈ=2²=4이므로 a>bᵈ
③ 마스터 정리에 의해 Θ(n^(log₂8))
④ log₂8=3이므로 Θ(n³), 따라서 O(n³)`}</pre>
    <p>시간 복잡도만 적기보다 <strong>계수 찾기, 비교, 적용한 공식</strong>을 함께 쓰면 풀이 과정을 보여 줄 수 있습니다. 연속 대치법으로 풀라는 문제에서는 직접 대입한 과정과 종료 조건도 써야 합니다.</p>

    <h3>6. 이 표를 그대로 적용하면 안 되는 경우</h3>
    <p><strong>T(n)=T(n−1)+n</strong>은 n/b 꼴이 아니므로 이 마스터 정리 표에 넣을 수 없습니다. 연속 대치법으로 풉니다.</p>
    <p>바깥 비용이 <strong>n log n</strong>이면 단순히 d=1로 놓으면 안 됩니다. n log n은 n에 상수 배로 비례하지 않습니다. 여기의 세 공식은 바깥 비용이 Θ(nᵈ)인 경우에 사용합니다.</p>
    <p className="algo-source-note">이해를 돕기 위해 추가한 학습용 보충 정리입니다. 시험 답안은 교수님이 지정한 풀이 방법과 표기를 따르세요.</p>
  </div>
}
