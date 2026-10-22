import { lessonSections } from '../data/algorithmSections'
import FloatingContents from '../../../shared/components/FloatingContents'

export default function LessonContents({ topic, onJump }: { topic: string; onJump: (target: string) => void }) {
  const links = lessonSections(topic).map(section => ({ title: section.title, target: topic === 'brute-force' && section.id !== 'brute-force-strategy' ? `brute-force-${section.indices[0]}` : section.id }))
  if (topic === 'brute-force') links.push({ title: '완전 탐색 · 틱택토·TSP·배낭·일 배정', target: 'exhaustive-search' })
  if (['analysis', 'recursion'].includes(topic)) links.push({ title: '단계별 시각화', target: `visual-${topic}` })
  if (topic === 'analysis') links.push({ title: '시험 대비 · 핵심 정리', target: 'exam-analysis' })

  return <FloatingContents links={links} onJump={onJump} />
}
