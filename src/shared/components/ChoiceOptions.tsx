export default function ChoiceOptions({ options, value, onChange, disabled=false }: { options:string[]; value?:number; onChange:(index:number)=>void; disabled?:boolean }) {
  return <div className="choice-options" role="group" aria-label="정답 선택">{options.map((option,index)=><button type="button" disabled={disabled} key={index} aria-pressed={value===index} onClick={()=>onChange(index)}><span className="choice-index">{index+1}</span><span>{option}</span></button>)}</div>
}
