import ExamSession from '../../../shared/components/ExamSession'
import { examKinds, examPractice } from '../data/examPractice'

const graphEdges={one:[['A','B'],['A','C'],['B','D'],['C','D'],['C','E'],['D','F'],['E','G'],['E','H'],['G','H']],two:[['A','B'],['A','C'],['B','D'],['B','E'],['C','E'],['C','F'],['D','E']]}
const graphPositions:Record<string,[number,number]>={A:[45,125],B:[160,45],C:[160,200],D:[290,45],E:[290,200],F:[440,45],G:[440,160],H:[440,260]}
function Graph({kind}:{kind:'one'|'two'}) {
  const edges=graphEdges[kind], names=[...new Set(edges.flat())].sort()
  return <><p>무방향 그래프 · A에서 시작 · 이웃은 알파벳순. DFS는 재귀 호출하며, BFS는 큐에 넣을 때 방문 처리합니다.</p><svg className="exam-graph" viewBox="0 0 500 300" role="img" aria-label={edges.map(pair=>pair.join('와 ')).join(', ')}>{edges.map(([a,b])=><line key={a+b} x1={graphPositions[a][0]} y1={graphPositions[a][1]} x2={graphPositions[b][0]} y2={graphPositions[b][1]} stroke="#adbdce" strokeWidth="2"/>)}{names.map(name=><g key={name}><circle cx={graphPositions[name][0]} cy={graphPositions[name][1]} r="20" fill="#edf4ff" stroke="#6c91c4"/><text x={graphPositions[name][0]} y={graphPositions[name][1]+5} textAnchor="middle">{name}</text></g>)}</svg><details><summary>연결 관계를 글로 확인</summary><p>{edges.map(pair=>pair.join('–')).join(' · ')}</p></details></>
}
export default function ExamPractice() {
  return <ExamSession questions={examPractice} kinds={examKinds} storageKey="justStudy.algorithm.examPractice.v1" renderQuestion={question=>question.graph==='one'||question.graph==='two'?<Graph kind={question.graph}/>:null}/>
}
