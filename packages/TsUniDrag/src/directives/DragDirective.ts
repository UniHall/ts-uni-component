import { DirectiveOptions } from 'vue'
const drag: DirectiveOptions = {
  bind: function(el, binding, vnode: any) {
    const moveEl = el
    moveEl.onmousedown = (event) => {
      // 获取事件触发位置与元素左上角的偏移量
      const disX = event.clientX - moveEl.offsetLeft
      const disY = event.clientY - moveEl.offsetTop
      // 页面的宽度和高度
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      // 触发拖拽开始事件
      vnode.context.$emit('drag-start', event)
      document.onmousemove = (dEvent) => {
        // 鼠标移动时，将元素定位到鼠标移动的位置，减去鼠标与元素左上角的偏移量
        const left = dEvent.clientX - disX
        const top = dEvent.clientY - disY
        moveEl.style.left = left + 'px'
        moveEl.style.top = top + 'px'
      }
      document.onmouseup = (event) => {
        document.onmousemove = null
        document.onmouseup = null
        const box = moveEl.getBoundingClientRect()
        // 当鼠标up时判断当前元素位置是否满足隐藏条件
        let left = box.x
        let top = box.y
        if (vnode.context.hide) {
          left = left > width - moveEl.offsetWidth - vnode.context.hideMinMargin ? width - vnode.context.minShowWidth
            : left < -(moveEl.offsetWidth - vnode.context.minShowWidth) || left < vnode.context.hideMinMargin ? -(moveEl.offsetWidth - vnode.context.minShowWidth) : left
          // 在4个角落时，防止x和y轴同时隐藏，判断x轴隐藏了，y轴便固定为0，或着最底部
          top = left === width - vnode.context.minShowWidth || left === -(moveEl.offsetWidth - vnode.context.minShowWidth) ? (top < vnode.context.hideMinMargin ? 0
            : box.bottom > height - vnode.context.hideMinMargin ? height - box.height : top)
            : top < vnode.context.hideMinMargin ? -(box.height - vnode.context.minShowWidth)
              : box.bottom > height - vnode.context.hideMinMargin ? height - vnode.context.minShowWidth : top
        }
        moveEl.style.left = left + 'px'
        moveEl.style.top = top + 'px'
        // 触发拖拽结束事件
        vnode.context.$emit('drag-end', event)
      }
    }
  }
}

export default drag
