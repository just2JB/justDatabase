import ExamSession from '../../../shared/components/ExamSession'
import { examKinds, examPractice } from '../data/examPractice'
import { isTraversalGraph } from '../data/traversalGraphs'
import TraversalAnswer from './TraversalAnswer'
export { Graph } from './TraversalGraph'

export default function ExamPractice({onOpenMistakes}:{onOpenMistakes:()=>void}) {
  return <ExamSession onOpenMistakes={onOpenMistakes} reviewCourse="algorithm" questions={examPractice} kinds={examKinds} storageKey="justStudy.algorithm.examPractice.v1" renderAnswer={(question,props)=>isTraversalGraph(question.graph)?<TraversalAnswer kind={question.graph} {...props}/>:undefined}/>
}
