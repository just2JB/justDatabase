import { useState } from 'react'

export default function BruteForceExamples({ kind }: { kind: 'sequential' | 'matching' | 'closest' }) {
  const [step, setStep] = useState(0)
  const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
  const points = [{ name: 'A', x: 1, y: 1 }, { name: 'B', x: 2, y: 2 }, { name: 'C', x: 5, y: 1 }, { name: 'D', x: 5, y: 4 }]
  const limit = kind === 'sequential' ? 3 : kind === 'matching' ? 2 : 5
  const [a, b] = pairs[step]
  const distance = (i: number, j: number) => Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
  const minimum = Math.min(...pairs.slice(0, step + 1).map(([i, j]) => distance(i, j)))
  return <div className="algo-visual"><h3>{kind === 'sequential' ? '탐색 키 2를 왼쪽부터 찾기' : kind === 'matching' ? '패턴 ABAC를 한 칸씩 이동하기' : '모든 점 쌍을 하나씩 비교하기'}</h3>
    {kind === 'sequential' ? <><div className="algo-tokens">{[4, 1, 5, 2, 3].map((value, i) => <span className={i === step ? 'focus' : ''} key={i}><b>{value}</b><small>인덱스 {i}</small></span>)}</div><p aria-live="polite">{step + 1}번째 비교: {step === 3 ? '2를 찾았습니다. 인덱스 3을 반환합니다.' : `${[4, 1, 5][step]} ≠ 2이므로 다음 항목으로 이동합니다.`}</p></> : null}
    {kind === 'matching' ? <><div className="matching-example" aria-label={`텍스트 ABABAC, 패턴 ABAC의 시작 위치 ${step}`}><div>{'ABABAC'.split('').map((c, i) => <span key={i}>{c}<small>{i}</small></span>)}</div><div>{Array.from({ length: step }, (_, i) => <span key={`blank-${i}`} />)}{'ABAC'.split('').map((c, i) => <span className={'ABABAC'[step + i] === c ? 'match' : 'mismatch'} key={i}>{c}</span>)}</div></div><p aria-live="polite">{step === 0 ? 'A, B, A는 일치하지만 네 번째 문자 B와 C가 다릅니다.' : step === 1 ? '첫 문자 B와 A가 다릅니다. 다시 한 칸 이동합니다.' : '네 문자가 모두 일치합니다. 시작 인덱스 2를 반환합니다.'}</p><p>색은 현재 정렬 위치의 문자 대응을 보여줍니다. 실제 알고리즘은 첫 불일치에서 비교를 멈춥니다.</p></> : null}
    {kind === 'closest' ? <><svg className="algo-diagram" viewBox="0 0 360 250" role="img" aria-label={`현재 ${points[a].name}와 ${points[b].name}의 거리 비교`}><path d="M35 15V215H335" stroke="#bac8d7" fill="none"/><line x1={points[a].x * 48 + 35} y1={215 - points[a].y * 42} x2={points[b].x * 48 + 35} y2={215 - points[b].y * 42} stroke="#2563eb" strokeWidth="3"/>{points.map(p => <g key={p.name}><circle cx={p.x * 48 + 35} cy={215 - p.y * 42} r="7" fill="#28775c"/><text x={p.x * 48 + 45} y={215 - p.y * 42 - 10} fontSize="12">{p.name}({p.x},{p.y})</text></g>)}</svg><p aria-live="polite">{points[a].name}·{points[b].name} 거리: {distance(a, b).toFixed(3)} · 지금까지 최소: {minimum.toFixed(3)}</p><p>서로 다른 4개 점의 쌍은 4×3÷2 = 6개입니다. 전체 비교 후 A·B가 최근접 쌍이며, 거리는 √2 ≈ 1.414입니다.</p></> : null}
    <div className="algo-controls"><button disabled={step === 0} onClick={() => setStep(step - 1)}>← 이전</button><span>{step + 1} / {limit + 1}</span><button disabled={step === limit} onClick={() => setStep(step + 1)}>다음 →</button><button onClick={() => setStep(0)}>처음</button></div>
  </div>
}
