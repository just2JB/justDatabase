import StudySidebar from '../../../shared/components/StudySidebar'
import { algorithmLessons } from '../data/algorithmLessons'

export default function AlgorithmSidebar({page,onNavigate}:{page:string;onNavigate:(page:string,target?:string)=>void}) {
  return <StudySidebar course="컴퓨터 알고리즘" page={page} lessons={algorithmLessons} otherCourse={{href:'?course=database',title:'데이터베이스'}} onNavigate={onNavigate}/>
}
