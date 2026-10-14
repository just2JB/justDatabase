type FilterOption<T extends string> = { value: T; label: string }

export default function QuizFilterBar<TTopic extends string, TType extends string>({
  topic,
  type,
  topics,
  types,
  onTopicChange,
  onTypeChange,
  count,
}: {
  topic: TTopic
  type: TType
  topics: FilterOption<TTopic>[]
  types: FilterOption<TType>[]
  onTopicChange: (value: TTopic) => void
  onTypeChange: (value: TType) => void
  count?: number
}) {
  return <div className="quiz-filter-bar">
    <fieldset><legend>주제 선택</legend><div className="quiz-filter-options">{topics.map(option => <button type="button" key={option.value} aria-pressed={topic === option.value} onClick={() => onTopicChange(option.value)}>{option.label}</button>)}</div></fieldset>
    <fieldset><legend>유형 선택</legend><div className="quiz-filter-options quiz-type-options">{types.map(option => <button type="button" key={option.value} aria-pressed={type === option.value} onClick={() => onTypeChange(option.value)}>{option.label}</button>)}</div></fieldset>
    {count !== undefined ? <p className="quiz-filter-count" aria-live="polite"><strong>{count}</strong>문제 선택됨</p> : null}
  </div>
}
