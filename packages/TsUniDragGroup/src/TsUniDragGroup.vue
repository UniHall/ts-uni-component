<template>
  <div ref="dragContainer" class="uni-drag-group" :style="{ 'grid-template-areas': gridAreas }">
    <div v-for="(dragData, index) in dragList" :key="index" v-drag :style="{ 'grid-area': 'area-' + index }" class="drag-item" onselectstart="return false;">
      <slot :data="dragData"><div class="drag-data-div" >{{ dragData }}</div></slot>
    </div>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Prop } from 'vue-property-decorator'
import dragDirective from './directives/DragDirective'
import { RangeType } from '@/commonJs/type/DragGroupType'
@Component({
  directives: {
    drag: dragDirective
  }
})
export default class TsUniDragGroup extends Vue {
  // 拖拽列表数据
  @Prop({
    default: () => { return [] }
  })
  private dragDataList!: Array<any>
  // 列数
  @Prop({
    default: 1
  })
  private column!: number
  // 列宽
  @Prop({
    default: 'auto'
  })
  private columnWidth!: string
  // 行高
  @Prop({
    default: 'auto'
  })
  private rowHeight!: string
  // 拖拽类型：重排resort/替换replace
  @Prop({
    default: 'resort'
  })
  type!: string

  private gridAreas = ''
  private dragList = _.cloneDeep(this.dragDataList)

  private mounted() {
    (this.$refs.dragContainer as HTMLElement).style.setProperty('--columnWidth', this.columnWidth);
    (this.$refs.dragContainer as HTMLElement).style.setProperty('--rowHeight', this.rowHeight)
    this.joinGridArea()
  }
  // grid style拼接
  private joinGridArea() {
    const len = this.dragList.length
    let areaStr = ''
    for (let i = 0; i < len; i++) {
      if (i % this.column === 0) {
        areaStr += '"area-' + i + ' '
        if (this.column === 1) {
          areaStr += '"'
        }
      } else if (i % this.column === this.column - 1) {
        areaStr += 'area-' + i + '"'
      } else {
        areaStr += 'area-' + i + ' '
      }
    }
    if (len % this.column !== 0) {
      const emptyLength = this.column - (len % this.column)
      areaStr += new Array(emptyLength).fill('.').join(' ') + '"'
    }
    this.gridAreas = areaStr
  }
  // 计算当前元素可移动的区域
  private getRangeOfEl(moveEl: HTMLElement) {
    const index = parseInt(moveEl.style.gridArea.split(' / ')[0].split('-')[1])
    const res: RangeType = { }
    const currentColummn = index % this.column
    res.minX = -((moveEl.offsetWidth + 5) * currentColummn)
    res.maxX = (this.column - currentColummn - 1) * (moveEl.offsetWidth + 5)
    const allRow = Math.ceil(this.dragList.length / this.column)
    const currentRow = Math.floor(index / this.column)
    res.minY = -((moveEl.offsetHeight + 5) * currentRow)
    res.maxY = (allRow - currentRow - 1) * (moveEl.offsetHeight + 5)
    return res
  }
  private getIndexOfMoveEL(moveEl: HTMLElement) {
    const x = parseInt(moveEl.style.left.split('px')[0])
    const y = parseInt(moveEl.style.top.split('px')[0])
    const index = parseInt(moveEl.style.gridArea.split(' / ')[0].split('-')[1])
    let nowIndex = 0
    if (x < 0) {
      nowIndex = index - (Math.round(Math.abs(x) / moveEl.offsetWidth))
    } else {
      nowIndex = index + (Math.round(Math.abs(x) / moveEl.offsetWidth))
    }
    if (y < 0) {
      nowIndex = nowIndex - (Math.round(Math.abs(y) / moveEl.offsetHeight)) * this.column
    } else {
      nowIndex = nowIndex + (Math.round(Math.abs(y) / moveEl.offsetHeight)) * this.column
    }
    return { nowIndex, index }
  }
  // 拖拽结束时重排数据或者替换数
  private changeBlock(moveEl: HTMLElement) { // 将方块移入到对应的区域中
    const { nowIndex, index } = this.getIndexOfMoveEL(moveEl)
    if (this.type === 'replace') {
      const temp = this.dragList[index]
      this.dragList[index] = this.dragList[nowIndex]
      this.dragList[nowIndex] = temp
    } else {
      this.dragList.splice(index, 1)
      this.dragList.splice(nowIndex, 0, this.dragDataList[index])
    }
    moveEl.style.left = '0'
    moveEl.style.top = '0'
    this.$emit('update:drag-data-list', _.cloneDeep(this.dragList))
  }
}
</script>
<style lang="scss" scoped>
  .uni-drag-group {
    --columnWidth: 'auto';
    --rowHeight: 'auto';
    display: grid;
    gap: 5px 5px;
    justify-content: center;
    align-content: center;
    width: fit-content;
    position: relative;
    .drag-item {
      position: relative;
      width: var(--columnWidth);
      height: var(--rowHeight);
      line-height: var(--rowHeight);
      text-align: center;
      user-select: none;
    }
    .drag-data-div {
      background-color: green;
      color: #FFFFFF;
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
  }
</style>
