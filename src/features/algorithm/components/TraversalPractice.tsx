import ExamSession from '../../../shared/components/ExamSession'
import { traversalPractice, traversalStorageKey } from '../data/examPractice'
import { isTraversalGraph } from '../data/traversalGraphs'
import TraversalAnswer from './TraversalAnswer'

const kinds = { traversal: 'DFS·BFS 순서' }

export default function TraversalPractice({ onOpenMistakes }: { onOpenMistakes: () => void }) {
  return <section id="traversal-practice"><ExamSession
    key={traversalStorageKey}
    title="DFS·BFS 노드 순서 맞추기"
    guide={<p>시작 정점과 이웃 선택 순서를 확인하세요. 처음 방문하는 노드를 순서대로 클릭하세요. 같은 노드는 한 번만 선택할 수 있습니다. 마지막 선택 취소나 초기화로 수정할 수 있습니다. 그림의 왼쪽 순서가 아니라 지정된 이웃 순서를 따르세요.</p>}
    questions={traversalPractice}
    kinds={kinds}
    storageKey={traversalStorageKey}
    reviewCourse="algorithm"
    onOpenMistakes={onOpenMistakes}
    renderAnswer={(question, props) => isTraversalGraph(question.graph) ? <TraversalAnswer kind={question.graph} {...props} /> : undefined}
  /></section>
}
