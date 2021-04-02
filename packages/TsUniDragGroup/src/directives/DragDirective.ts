import { DirectiveOptions } from 'vue'
const drag: DirectiveOptions = {
  bind: function(el, binding, vnode) {
    const moveEl = el
    moveEl.onmousedown = (event) => {
      moveEl.style.boxShadow = '#e6e6e6 0 0 10px 10px'
      moveEl.style.zIndex = '100';
      (vnode as any).context.$emit('drag-start', event)
      const disX = event.clientX
      const disY = event.clientY
      document.onmousemove = (dEvent) => {
        let x = dEvent.clientX - disX
        let y = dEvent.clientY - disY
        const { minX, maxX, minY, maxY } = (vnode.context as any).getRangeOfEl(moveEl)
        x = x < minX ? minX : (x > maxX ? maxX : x)
        y = y < minY ? minY : (y > maxY ? maxY : y)
        moveEl.style.left = x + 'px'
        moveEl.style.top = y + 'px'
      }
      document.onmouseup = (upEvent) => {
        document.onmousemove = null // 需要把事件监听取消
        document.onmouseup = null // 需要把事件监听取消
        moveEl.style.boxShadow = 'none';
        (vnode.context as any).changeBlock(moveEl);
        (vnode.context as any).$emit('drag-end', upEvent, (vnode.context as any).dragList)
      }
    }
  }
}
export default drag
