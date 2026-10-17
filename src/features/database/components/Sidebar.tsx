import StudySidebar from '../../../shared/components/StudySidebar'
import FloatingContents from '../../../shared/components/FloatingContents'
import { databaseLessons, databaseContents } from '../data/navigation'
import type { PageId, SearchEntry } from '../data/content'

export default function Sidebar({page,onSelect}:{active:string;page:PageId;onSelect:(entry:SearchEntry)=>void}) {
  return <><StudySidebar course="데이터베이스" page={page==='workbench-answers'?'workbench':page} lessons={databaseLessons} bottomLinks={[{id:'languages',title:'SQL 문법 사전'},{id:'workbench',title:'Workbench 실습 미션'}]} otherCourse={{href:'?course=algorithm',title:'컴퓨터 알고리즘'}} onNavigate={id=>onSelect({title:'',text:'',section:'main',page:id as PageId})}/>{page!=='quiz'?<FloatingContents key={page} links={databaseContents(page)} onJump={target=>onSelect({title:'',text:'',section:target,target,page})}/>:null}</>
}
