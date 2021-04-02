<template>
  <div v-drag onselectstart="return false;" class="drag-inner" :style="{top: initTop, left: initLeft}">
    <slot />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dragDirective from './directives/DragDirective'
@Component({
  directives: {
    drag: dragDirective
  }
})
export default class TsUniDrag extends Vue {
  // 拖拽组件默认距离页面顶部高度， 默认50vh
  @Prop({
    default: '50vh'
  })
  private initTop!: string
  // 拖拽组件默认距离页面左侧的距离， 默认0
  @Prop({
    default: '0'
  })
  private initLeft!: string

  // 隐藏时展示的像素宽度
  @Prop({
    default: 20
  })
  private minShowWidth!: number
  // 距离边框多少像素时可以隐藏
  @Prop({
    default: 0
  })
  private hideMinMargin!: number
  // 是否开启自动隐藏
  @Prop({
    default: true
  })
  private hide!: boolean

  private timer = 0

  private mounted() {
    window.addEventListener('resize', this.windowResize)
    window.addEventListener('scroll', this.resizeDragContainer)
  }
  private beforeDestroy() {
    window.removeEventListener('resize', this.windowResize) // 通过有名函数 解除事件订阅
    window.removeEventListener('scroll', this.resizeDragContainer)
  }
  private windowResize() {
    // 当窗口被重新定义大小时重新设置父元素的大小
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => { // 只执行最后一个定时器的 结果
      this.resizeContainer()
    }, 300) // 推迟 300 ms 在执行resize 效果
  }
  private resizeDragContainer() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => { // 只执行最后一个定时器的 结果
      this.resizeContainer()
    }, 300)
  }
  private resizeContainer() {
    const element = document.querySelector('.drag-inner') as HTMLElement
    if (element.getBoundingClientRect().x > document.documentElement.clientWidth - this.hideMinMargin) {
      // 当前元素的x坐标比需要隐藏的x坐标大时，隐藏drag组件
      element.style.left = document.documentElement.clientWidth - this.minShowWidth + 'px'
    }
    if (element.getBoundingClientRect().bottom > document.documentElement.clientHeight - this.hideMinMargin) {
      // 如果当前元素的y坐标大于需要隐藏的y坐标时，隐藏drag组件
      element.style.top = document.documentElement.clientHeight - this.minShowWidth + 'px'
    }
  }
}
</script>
<style scoped>
.uni-drag {
  position: absolute;
  overflow: hidden;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  user-select: none;
}
.drag-inner {
  position: fixed;
}
</style>
