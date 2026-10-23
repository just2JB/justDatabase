import { preExamKinds, preExamSets } from '../data/preExamSets'
import AlgorithmExamPapers from './AlgorithmExamPapers'

export default function PreExamPapers({ activeView, onSelect, onOpenMistakes }: { activeView:string; onSelect:(view:string)=>void; onOpenMistakes:()=>void }) {
  return <AlgorithmExamPapers sets={preExamSets} kinds={preExamKinds} activeView={activeView} onSelect={onSelect} onOpenMistakes={onOpenMistakes} lastMinute/>
}
