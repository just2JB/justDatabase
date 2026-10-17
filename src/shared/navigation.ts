export function scrollToTarget(target:string) {
  requestAnimationFrame(()=>document.getElementById(target)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}))
}
export function pushLocation(url:URL) {
  if(url.href!==location.href) history.pushState(null,'',url)
}
