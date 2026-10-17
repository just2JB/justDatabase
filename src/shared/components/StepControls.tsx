import { useEffect, useState } from 'react'

export default function StepControls({ step, count, onChange }: { step: number; count: number; onChange: (step: number) => void }) {
  const [playing, setPlaying] = useState(false)
  const [delay, setDelay] = useState(1400)
  useEffect(() => {
    if (!playing) return
    if (step >= count - 1) { setPlaying(false); return }
    const timer = window.setTimeout(() => onChange(step + 1), delay)
    return () => window.clearTimeout(timer)
  }, [playing, step, count, delay, onChange])
  function go(next: number) { setPlaying(false); onChange(next) }
  return <div className="step-controls" aria-label="예제 단계 조작">
    <div className="step-controls-main">
      <button type="button" disabled={step === 0} onClick={() => go(step - 1)}>← 이전</button>
      <span aria-live="off">{step + 1} / {count}</span>
      <button type="button" disabled={step >= count - 1} onClick={() => go(step + 1)}>다음 →</button>
      <button type="button" className="step-play" aria-pressed={playing} onClick={() => { if (!playing && step >= count - 1) onChange(0); setPlaying(!playing) }}>{playing ? 'Ⅱ 일시정지' : '▶ 자동 재생'}</button>
    </div>
    <div className="step-controls-extra">
      <button type="button" onClick={() => go(0)}>처음</button>
      <button type="button" onClick={() => go(count - 1)}>최종 결과</button>
      <label>속도 <select value={delay} onChange={event => setDelay(Number(event.target.value))}><option value={2200}>천천히</option><option value={1400}>보통</option><option value={900}>빠르게</option></select></label>
    </div>
    <div className="step-track" aria-hidden="true"><span style={{ width: `${count > 1 ? step / (count - 1) * 100 : 100}%` }} /></div>
  </div>
}
