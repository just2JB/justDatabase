// 선택한 여러 줄에도 동일하게 들여쓰기를 적용하고 선택 영역을 유지합니다.
export function indentSql(value: string, start: number, end: number, outdent: boolean) {
  if (!outdent && start === end) return { value: value.slice(0, start) + '  ' + value.slice(end), start: start + 2, end: start + 2 }
  const first = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1
  const last = end > start && value[end - 1] === '\n' ? end - 1 : end
  const edits: { at: number; remove: number; insert: string }[] = []
  for (let at = first; at <= last;) {
    const remove = outdent ? (value[at] === '\t' ? 1 : /^ {1,2}/.exec(value.slice(at))?.[0].length ?? 0) : 0
    edits.push({ at, remove, insert: outdent ? '' : '  ' })
    const newline = value.indexOf('\n', at)
    if (newline < 0) break
    at = newline + 1
  }
  let next = value
  for (const edit of [...edits].reverse()) next = next.slice(0, edit.at) + edit.insert + next.slice(edit.at + edit.remove)
  const move = (position: number) => position + edits.reduce((offset, edit) => offset + (edit.at <= position ? edit.insert.length - Math.min(edit.remove, position - edit.at) : 0), 0)
  return { value: next, start: move(start), end: move(end) }
}
