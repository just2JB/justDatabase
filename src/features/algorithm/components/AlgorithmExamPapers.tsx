import ExamSession from '../../../shared/components/ExamSession'
import type { AlgorithmMockSet } from '../data/algorithmMockSets'
import { isTraversalGraph } from '../data/traversalGraphs'
import TraversalAnswer from './TraversalAnswer'
import SortQuestionVisual from './SortQuestionVisual'
import { pushLocation } from '../../../shared/navigation'
import './exam-papers.css'

export default function AlgorithmExamPapers({ sets, kinds, activeView, onSelect, onOpenMistakes, lastMinute = false }: {
  sets: AlgorithmMockSet[]; kinds: Record<string,string>; activeView: string; onSelect: (view:string)=>void; onOpenMistakes: ()=>void; lastMinute?: boolean
}) {
  const selected = sets.find(set=>set.view===activeView) ?? sets[0]
  const usedKinds = Object.fromEntries(Object.entries(kinds).filter(([kind])=>selected.questions.some(question=>question.kind===kind)))
  return <>
    <div className="exam-paper-heading"><h2>{lastMinute?'시험 직전 · 시험지 선택':'모의고사 · 회차 선택'}</h2><p>{lastMinute?'두 시험지 모두 35문제입니다. 풀이와 제출 상태는 시험지별로 저장됩니다.':'기존 모의고사 1~5회를 선택하세요. 이전 답안과 진도는 그대로 이어집니다.'}</p></div>
    <div className="exam-paper-picker" role="group" aria-label={lastMinute?'시험 직전 시험지 선택':'모의고사 회차 선택'}>{sets.map(set=><button type="button" key={set.view} aria-pressed={selected.view===set.view} onClick={()=>onSelect(set.view)}><strong>{set.short}</strong><span>{set.questions.length}문제</span><small>{set.guide}</small></button>)}</div>
    <p className="master-study-link"><a href="?course=algorithm&amp;topic=divide#divide-master" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();pushLocation(new URL(event.currentTarget.href));window.dispatchEvent(new PopStateEvent('popstate'))}}>마스터 정리 설명·단계별 예제 보기 →</a></p>
    <ExamSession key={selected.view} title={`${selected.title} · ${lastMinute?'35문제':'힌트 없이 풀기'}`}
      guide={<><p>실제 기출이 아닌 학습용 예상 시험지입니다. 알고리즘을 실행해 정렬 과정, 방문 순서, 코드 출력을 계산했습니다. 서술형은 제출 후 모범 풀이와 비교해 직접 채점하세요.</p>{lastMinute?<p>정렬 표는 한 회전의 행을 채운 뒤 ‘정답 확인’을 누르면 해당 행만 확인합니다. 전체 제출과 별개이며 답안은 자동으로 바뀌지 않습니다. 병합 정렬은 왼쪽부터 재귀 처리하고 각 병합 직후의 전체 배열을 적습니다. 시각화에서는 단계별 풀이와 결과를 볼 수 있습니다.</p>:null}</>}
      questions={selected.questions} kinds={usedKinds} storageKey={selected.storageKey} reviewCourse="algorithm" onOpenMistakes={onOpenMistakes}
      renderQuestion={question=><SortQuestionVisual key={question.id} question={question}/>}
      renderAnswer={(question,props)=>isTraversalGraph(question.graph)?<TraversalAnswer kind={question.graph} {...props}/>:undefined}/>
  </>
}
