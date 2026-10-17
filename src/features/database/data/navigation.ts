import { sections } from './content'
import type { PageId } from './content'
import { dbmsGroups } from './dbmsContent'
import { dbsGroups } from './dbsContent'
import { relationGroups } from './relationContent'
import { subqueryGroups, changeGroups } from '../sql/data/sqlAdvancedData'
import { sql4Groups, sql5Groups } from '../sql/data/sqlLessonData'

export const databaseLessons: {id:PageId; title:string}[] = [
  {id:'basics',title:'데이터베이스, 정보'},
  {id:'dbms',title:'데이터베이스 관리 시스템'},
  {id:'dbs',title:'데이터베이스 시스템'},
  {id:'relation',title:'관계 데이터 모델'},
  {id:'sql4',title:'SQL 기초 · 테이블 정의'},
  {id:'sql5',title:'SQL 검색 · 데이터 질의'},
  {id:'subqueries',title:'부속질의'},
  {id:'changes',title:'데이터 삽입·수정·삭제'},
]
export function databaseContents(page:PageId) {
  if(page==='basics')return sections.map(section=>({title:section.title,target:section.id}))
  const groups = page==='dbms'?dbmsGroups:page==='dbs'?dbsGroups:page==='relation'?relationGroups:page==='sql4'?sql4Groups:page==='sql5'?sql5Groups:page==='subqueries'?subqueryGroups:page==='changes'?changeGroups:[]
  return groups.map(group=>({title:group.title,target:group.section}))
}
