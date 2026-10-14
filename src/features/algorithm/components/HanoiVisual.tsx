import { useState } from 'react'

const moves: [number, number][] = [[0,2],[0,1],[2,1],[0,2],[1,0],[1,2],[0,2]]
export default function HanoiVisual() {
  const [step, setStep] = useState(0)
  const towers: number[][] = [[3,2,1],[],[]]
  for (let i=0;i<step;i++) { const [from,to] = moves[i]; towers[to].push(towers[from].pop()!) }
  const move = step ? moves[step-1] : null
  return <div className="algo-visual"><h3>하노이탑: 원판 3개 옮기기</h3><svg className="algo-diagram" viewBox="0 0 540 235" role="img" aria-label={towers.map((tower,i) => `${'ABC'[i]} 기둥 아래부터 ${tower.join(', ') || '비어 있음'}`).join('. ')}>{towers.map((tower,i) => <g key={i}><rect x={86+i*180} y="55" width="8" height="140" rx="4" fill="#9bafbd" /><rect x={20+i*180} y="195" width="140" height="8" rx="4" fill="#9bafbd" /><text x={90+i*180} y="225" textAnchor="middle" fill="#526178">{'ABC'[i]}</text>{tower.map((disk,j) => <g key={disk}><rect x={90+i*180-(disk*18+18)} y={168-j*31} width={disk*36+36} height="27" rx="7" fill={['','#f2bf61','#6fa5df','#65ac87'][disk]} /><text x={90+i*180} y={187-j*31} textAnchor="middle" fill="#17354b" fontSize="14">{disk}</text></g>)}</g>)}{move ? <><path d={`M${90+move[0]*180} 40 Q270 -10 ${90+move[1]*180} 40`} fill="none" stroke="#2563eb" strokeWidth="2" /><path d={`M${84+move[1]*180} 30l6 10 6-10`} fill="none" stroke="#2563eb" strokeWidth="2" /></> : null}</svg><p aria-live="polite">{step === 0 ? '시작: 모든 원판을 A에서 C로 옮깁니다.' : `${step}번째 이동: ${'ABC'[move![0]]} → ${'ABC'[move![1]]}${step===7 ? ' · 7번 이동으로 완료!' : ''}`}</p><div className="algo-controls"><button disabled={!step} onClick={() => setStep(step-1)}>← 이전</button><span>{step} / 7 이동</span><button disabled={step===7} onClick={() => setStep(step+1)}>다음 →</button><button onClick={() => setStep(0)}>처음</button></div><p>한 번에 맨 위 원판 하나만 옮기며, 큰 원판을 작은 원판 위에 놓을 수 없습니다.</p></div>
}
