// 任务缓存队列，自动对任务进行去重
const queue = new Set()
// 代表是否正在刷新任务队列
let isFlushing = false
// 创建一个立即 resolve 的Promise实例
const p = Promise.resolve()

// 调度器的主要函数，用来将一个任务添加到缓冲队列中，并开始刷新队列
export function queueJob(job) {
  // 将 job 添加到任务队列
  queue.add(job)
  if (!isFlushing) {
    isFlushing = true
    p.then(() => {
      try {
        queue.forEach((job) => job())
      } finally {
        isFlushing = false
        queue.clear()
      }
    })
  }
}
