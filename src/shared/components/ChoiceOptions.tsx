export default function ChoiceOptions({ options, value, onChange, disabled=false, correctIndex, revealed=false }: { options:string[]; value?:number; onChange:(index:number)=>void; disabled?:boolean; correctIndex?:number; revealed?:boolean }) {
  return <div className="choice-options" role="group" aria-label="정답 선택">{options.map((option,index)=>{
    const result = revealed && correctIndex !== undefined ? index === correctIndex ? 'correct' : index === value ? 'incorrect' : undefined : undefined
    return <button type="button" disabled={disabled} key={index} aria-pressed={value===index} data-result={result} onClick={()=>onChange(index)}><span className="choice-index">{index+1}</span><span>{option}</span>{result ? <strong className="choice-result">{result==='correct'?'✓ 정답':'✕ 오답'}</strong> : null}</button>
  })}</div>
}
