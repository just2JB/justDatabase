export type QuickSplit = {low:number;high:number;at:number;depth:number;left:number[];right:number[];value:number}
export type QuickFrame = {values:number[];low:number;high:number;pivot:number;scanLow?:number;scanHigh?:number;compare?:number;swapped?:number[];fixed:number[];text:string;splits:QuickSplit[];partitionDone?:boolean}
export function quickSortTrace(input:number[]) {
  const a=[...input], frames:QuickFrame[]=[], splits:QuickSplit[]=[], fixed:number[]=[]
  function sort(left:number,right:number,depth=0) {
    if(left>right)return
    if(left===right){fixed.push(left);record(-1,`${a[left]} 하나만 남아 정렬 완료`);return}
    const pivot=a[left];let low=left+1,high=right
    function scan(text:string,compare?:number,swapped?:number[]){record(left,text,compare,swapped,false,low,high)}
    scan(`첫 원소 ${pivot}을 피벗으로 선택: low=${low}, high=${high}`)
    while(low<=high) {
      while(low<=right) {
        scan(`${a[low]} < ${pivot} 비교: ${a[low]<pivot?'low를 오른쪽으로 이동':'low 정지'}`,low)
        if(a[low]>=pivot)break
        low++
      }
      while(high>=left+1) {
        scan(`${a[high]} > ${pivot} 비교: ${a[high]>pivot?'high를 왼쪽으로 이동':'high 정지'}`,high)
        if(a[high]<=pivot)break
        high--
      }
      if(low<high){const x=a[low],y=a[high];[a[low],a[high]]=[a[high],a[low]];scan(`${x}와 ${y} 교환 후 low +1, high −1`,undefined,[low,high]);low++;high--}
      else {scan(low===high?'low와 high가 만나 반복 종료':'low와 high가 엇갈려 반복 종료');break}
    }
    ;[a[left],a[high]]=[a[high],a[left]]
    fixed.push(high)
    splits.push({low:left,high:right,at:high,depth,left:a.slice(left,high),right:a.slice(high+1,right+1),value:pivot})
    record(high,`피벗 ${pivot}과 A[${high}]를 교환하여 위치 확정. 왼쪽부터 재귀 정렬합니다.`,undefined,[left,high],true,low,high)
    sort(left,high-1,depth+1);sort(high+1,right,depth+1)
    function record(pivotIndex:number,text:string,compare?:number,swapped?:number[],partitionDone=false,scanLow?:number,scanHigh?:number){frames.push({values:[...a],low:left,high:right,pivot:pivotIndex,scanLow,scanHigh,compare,swapped,fixed:[...fixed],text,splits:[...splits],partitionDone})}
  }
  sort(0,a.length-1)
  frames.push({values:[...a],low:0,high:a.length-1,pivot:-1,fixed:[...fixed],text:'전체 정렬 완료',splits:[...splits]})
  return frames
}
export const quickPartitionCode = `def partition(A, left, right):
    low, high = left + 1, right
    pivot = A[left]
    while low <= high:
        while low <= right and A[low] < pivot:
            low += 1
        while high >= left + 1 and A[high] > pivot:
            high -= 1
        if low < high:
            A[low], A[high] = A[high], A[low]
            low += 1
            high -= 1
        else:  # 만나거나 엇갈리면 종료
            break
    A[left], A[high] = A[high], A[left]
    return high

def quick_sort(A, left, right):
    if left < right:
        p = partition(A, left, right)
        quick_sort(A, left, p - 1)
        quick_sort(A, p + 1, right)`
