<template>
  <div>
    <el-table
      border
      :style="tableStyle"
      :cell-class-name="cellNameFilter"
      :header-cell-class-name="headerNameFilter"
      :data="data"
      :height="height"
      :row-key="rowKey"
      :span-method="mergeRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="columnList.filter(column => column.type === 'expand').length > 0"
        type="expand"
        :width="
          columnList.filter(column => column.type === 'expand')[0].width || 55
        "
      >
        <template slot-scope="scope">
          <slot name="expand" :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          columnList.filter(column => column.type === 'checkbox').length > 0
        "
        type="selection"
        :reserve-selection="reserveSelection"
        :width="
          columnList.filter(column => column.type === 'checkbox')[0].width || 55
        "
      />
      <el-table-column
        v-if="columnList.filter(column => column.type === 'index').length > 0"
        type="index"
        :width="
          columnList.filter(column => column.type === 'index')[0].width || 55
        "
      />
      <el-table-column
        v-for="column in columnList.filter(
          column => !['checkbox', 'expand', 'index'].includes(column.type)
        )"
        :key="column.prop || null"
        :prop="column.prop || null"
        :label="column.label || null"
        :width="column.width"
        :header-align="column.headerAlign || 'center'"
        :align="column.align || 'center'"
      >
        <template slot-scope="scope">
          <slot name="cell" :row="scope.row" :prop="column.prop">
            <el-radio
              v-if="column.type === 'radio'"
              v-model="selectedRadio"
              :label="JSON.stringify(scope.row)"
              @change="updateSelectedRadio(scope.row)"
            >
              {{ "" }}
            </el-radio>
            <el-tooltip
              effect="light"
              :open-delay="poperDelay"
              popper-class="common-cus-popper"
              :disabled="disableToolTip"
              :content="
                column.render
                  ? column.render(scope.row)
                  : column.filter
                  ? $parent.$options.filters[column.filter](
                      scope.row,
                      column.filterParams
                    )
                  : scope.row[column.prop] + ''
              "
            >
              <span
                v-if="!column.type || column.type === 'normal'"
                :ref="column.prop + scope.$index"
                :class="{ 'common-table-span': showPoper }"
                @mouseenter="checkSpanWidth(column, column.prop, scope.$index)"
                @click="clickTableCell(column, scope.row)"
                v-html="
                  column.render
                    ? column.render(scope.row)
                    : column.filter
                    ? $parent.$options.filters[column.filter](
                        scope.row,
                        column.filterParams
                      )
                    : scope.row[column.prop] + ''
                "
              >
                {{
                  column.render
                    ? column.render(scope.row)
                    : column.filter
                    ? $parent.$options.filters[column.filter](
                        scope.row,
                        column.filterParams
                      )
                    : scope.row[column.prop] + ""
                }}
              </span>
              <span v-else-if="column.type === 'dict'">
                {{ getDictNameByCode(scope.row[column.prop]) }}
              </span>
              <span v-else-if="column.type === 'money'">
                {{ formatMoney(scope.row[column.prop]) }}
              </span>
            </el-tooltip>
            <!-- 操作按钮列的单元格渲染 -->
            <span
              v-if="
                column.type === 'operation' ||
                  (column.operations && column.operations.length > 0)
              "
            >
              <span
                v-for="(operation, index) in column.operations"
                :key="index"
                class="table-button"
              >
                <el-button
                  v-if="
                    operation.type !== 'more' &&
                      checkShowButton(operation, scope.row)
                  "
                  type="text"
                  :class="
                    operation.type
                      ? 'text-button-' + operation.type
                      : 'text-button-primary'
                  "
                  size="mini"
                  :icon="operation.buttonIcon"
                  @click="handleButton(operation.key, scope.row)"
                >
                  {{ operation.label }}
                </el-button>
                <el-dropdown
                  v-else-if="
                    operation.type === 'more' &&
                      checkShowButton(operation, scope.row)
                  "
                  :trigger="operation.trigger || 'hover'"
                  @command="handleMoreButton"
                >
                  <span class="el-dropdown-link">
                    {{ operation.label
                    }}<i class="el-icon-more el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <span
                      v-for="childOperation in operation.childOperations"
                      :key="childOperation.key"
                    >
                      <el-dropdown-item
                        v-if="
                          childOperation.type !== 'more' &&
                            checkShowButton(childOperation, scope.row)
                        "
                        :icon="childOperation.buttonIcon"
                        :class="
                          childOperation.type
                            ? 'text-button-' + childOperation.type
                            : 'text-button-primary'
                        "
                        :command="{
                          key: childOperation.key,
                          row: scope.row,
                          type: childOperation.type
                        }"
                      >
                        {{ childOperation.label }}
                      </el-dropdown-item>
                    </span>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 允许用户直接自定义完整的table，不使用组件渲染的组件 -->
    <slot name="tableSlot" />
    <!-- 分页 -->
    <el-pagination
      v-if="pageable !== null"
      background
      small
      :current-page="pageable.page || 1"
      :page-sizes="pageSizes"
      :page-size="pageable.size || 20"
      :total="pageable.total || 0"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleChangePageSize"
      @current-change="handleChangeCurrentPage"
    />
  </div>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { filterDictNameByCode, formatMoneyStr } from "@/commonJs/common.js";
type Pageable = {
  page: number;
  size: number;
  total: number;
};
type KeyRow = {
  key: string;
  row: any;
};
type ElementTableCell = {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
};
type ValueProp = {
  value: Array<string> | string;
  prop: string;
};
type Operation = {
  type: string;
  label: string;
  key: string;
  notShow:
    | ValueProp
    | Array<ValueProp | boolean | Function>
    | boolean
    | Function;
  notShowJoinType: string;
  buttonIcon: string;
  trigger: string;
  childOperations: Array<Operation>;
};
type ColumnList = {
  prop: string;
  label: string;
  width: string | number;
  headerAlign: string;
  align: string;
  type: string;
  clickEvent: Function;
  operations: Array<Operation>;
  render: Function;
  filter: Vue;
  filterParams: Map<string, object>;
};

@Component
export default class MyTable extends Vue {
  @Prop({
    required: true
  })
  private data!: Array<any>;

  @Prop({
    default: null
  })
  private rowKey: Function | string | undefined;

  @Prop({
    required: true
  })
  private columnList!: Array<ColumnList>;

  @Prop({
    type: Object,
    default: () => {
      return {
        page: 1,
        size: 20
      };
    }
  })
  private pageable!: Pageable;

  @Prop({
    type: [String, Number],
    required: false
  })
  private height: string | number | undefined;

  @Prop() private showPoper: boolean | undefined;

  @Prop({ default: true }) private reserveSelection: boolean | undefined;

  @Prop({ default: 500 }) private poperDelay: number | undefined;
  @Prop() private cellClassName: Function | string | undefined;
  @Prop() private headerCellClassName: string | Function | undefined;
  @Prop({
    default: () => {
      return [];
    }
  })
  private dictList!: Array<object>;
  @Prop() private tableStyle: string | undefined;
  @Prop({
    default: () => {
      return [];
    }
  })
  private mergeRowKeys!: Array<string>;
  @Prop() private mergeColIndex!: Array<number>;

  private pageSizes = [10, 20, 30, 40, 80];
  private disableToolTip = true;
  private selectedRadio = null;
  private multiColumnCount: object = {};

  @Watch("data")
  onDataChange() {
    this.initMergeRow();
  }

  private created() {
    if (this.pageable) {
      this.changeInitSize();
    }
    this.initMergeRow();
  }
  private changeInitSize() {
    if (!this.pageSizes.includes(this.pageable.size)) {
      this.pageSizes.push(this.pageable.size);
      this.pageSizes.sort();
    }
  }

  private handleChangePageSize(val: number) {
    const pageTemp = JSON.parse(JSON.stringify(this.pageable));
    pageTemp.size = val;
    this.updatePageable(pageTemp);
    this.changePageSize(val);
  }

  @Emit()
  private updatePageable(pageTemp: Pageable) {
    return pageTemp;
  }

  @Emit()
  private changePageSize(val: number) {
    return val;
  }

  private handleChangeCurrentPage(val: number) {
    const pageTemp = JSON.parse(JSON.stringify(this.pageable));
    pageTemp.page = val;
    if (!this.reserveSelection) {
      this.selectedRadio = null;
      this.selectionChange([]);
    }
    this.updatePageable(pageTemp);
    this.changeCurrentPage(val);
  }

  @Emit()
  private changeCurrentPage(val: number) {
    return val;
  }

  @Emit()
  private selectionChange(res: Array<object>) {
    return res;
  }
  private handleMoreButton({ key, row }: KeyRow) {
    this.handleButton(key, row);
  }
  private handleButton(key: string, row: object) {
    this.$emit("handle-button", { key, row });
  }
  // 校验内容是否查过单元格宽度
  private checkSpanWidth(prop: string, index: number) {
    if (!this.showPoper) {
      return;
    }
    if ((this.$refs[prop + index] as Element[])[0]) {
      this.disableToolTip =
        (this.$refs[prop + index] as Element[])[0].scrollWidth ===
        (this.$refs[prop + index] as Element[])[0].clientWidth;
    }
  }
  // 点击表格单元格时触发函数
  private clickTableCell(col: ColumnList, row: object) {
    if (col.clickEvent) {
      col.clickEvent(row);
    }
  }
  private handleSelectionChange(selections: Array<object>) {
    this.selectionChange(selections);
  }
  private updateSelectedRadio(value: string) {
    const selectedList = this.data.filter(
      row => JSON.stringify(row) === JSON.stringify(value)
    );
    this.selectionChange(selectedList);
  }

  // 单元格类拼接
  private cellNameFilter({
    row,
    column,
    rowIndex,
    columnIndex
  }: ElementTableCell) {
    const cellName = "common-table-cell";
    if (this.cellClassName) {
      return cellName + typeof this.cellClassName === "function"
        ? "" +
            (this.cellClassName as Function)({
              row,
              column,
              rowIndex,
              columnIndex
            })
        : "" + this.cellClassName;
    }
    return cellName;
  }
  // 表头单元格类拼接
  private headerNameFilter({
    row,
    column,
    rowIndex,
    columnIndex
  }: ElementTableCell) {
    const headerClass = "common-table-cell common-header-cell";
    if (this.headerCellClassName) {
      return headerClass + typeof this.headerCellClassName === "function"
        ? "" +
            (this.headerCellClassName as Function)({
              row,
              column,
              rowIndex,
              columnIndex
            })
        : "" + this.headerCellClassName;
    }
    return headerClass;
  }
  // 初始化需要合并的单元格
  private initMergeRow() {
    if (this.mergeRowKeys.length === 0) {
      return;
    }
    this.mergeRowKeys.forEach(key => {
      const rowAndColumn = [];
      let pos = 0;
      for (let i = 0; i < this.data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          rowAndColumn.push(1);
          pos = 0;
        } else {
          if (this.data[i][key] === this.data[i - 1][key]) {
            // 如果属性值相等就累加，并且push 0
            rowAndColumn[pos] += 1;
            rowAndColumn.push(0);
          } else {
            // 不相等push 1
            rowAndColumn.push(1);
            pos = i;
          }
        }
      }
      this.multiColumnCount[key] = rowAndColumn;
    });
  }
  // 合并单元格函数
  private mergeRow({ row, column, rowIndex, columnIndex }: ElementTableCell) {
    // 行合并
    if (this.mergeRowKeys.includes(column.property)) {
      if (this.multiColumnCount[column.property][rowIndex]) {
        const rowNum = this.multiColumnCount[column.property][rowIndex];
        return {
          rowspan: rowNum,
          colspan: rowNum > 0 ? 1 : 0
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
    // 列合并
    if (this.mergeColIndex && this.mergeColIndex.length > 0) {
      let num = 1;
      // 当前列的index在columnList中对应的index值，如果表格还需要展示复选框，则需要将index 再 减去1
      const notOperationIndex =
        this.columnList[this.columnList.length - 1].operations &&
        this.columnList[this.columnList.length - 1].operations.length > 0
          ? this.columnList.length - 2
          : this.columnList.length - 1;
      const endIndex =
        this.mergeColIndex.length > 1
          ? this.mergeColIndex[1]
          : notOperationIndex;
      // 如果当前列不在columnList中或者当前列超出了需合并列的index，则不进行任何操作
      if (columnIndex < 0 || columnIndex > endIndex) {
        return [1, 1];
      }
      // 如果当前列与前一列值相同，则进行合并，将单元格隐藏
      if (
        columnIndex > 0 &&
        row[this.columnList[columnIndex].prop] ===
          row[this.columnList[columnIndex - 1].prop]
      ) {
        return [0, 0];
      }
      for (let i = columnIndex + 1; i <= endIndex; i++) {
        // 若值与前一单元格值相等，则需合并单元格的值++
        if (row[this.columnList[i].prop] === row[this.columnList[i - 1].prop]) {
          num++;
        } else {
          // 如果值不相等则返回合并单元格范围
          return [1, num];
        }
      }
      return [1, num];
    }
  }
  // 根据字典code获取字典名称
  private getDictNameByCode(dictCode: string) {
    const dictList =
      this.dictList.length === 0
        ? (this as any).$store &&
          (this as any).$store.getters &&
          (this as any).$store.getters.dictList &&
          (this as any).$store.getters.dictList.length > 0
          ? (this as any).$store.getters.dictList
          : []
        : this.dictList;
    return filterDictNameByCode(dictCode, dictList);
  }
  // 格式化金额
  private formatMoney(money: string) {
    return formatMoneyStr(money ? money + "" : "", 2);
  }
  // 校验按钮是否展示
  private checkShowButton(operation: Operation, row: any) {
    const notShowType = Object.prototype.toString
      .call(operation.notShow)
      .slice(8, -1);
    if (notShowType === "Boolean") {
      return !operation.notShow;
    }
    if (!operation.notShow) {
      return true;
    }
    (operation.notShow as Array<ValueProp | boolean | Function>) =
      notShowType === "Object"
        ? [operation.notShow as ValueProp | boolean | Function]
        : (operation.notShow as Array<ValueProp | boolean | Function>);
    if (notShowType === "Function") {
      return !(operation.notShow as Function)();
    }
    let show = false;
    if (
      operation.notShowJoinType &&
      operation.notShowJoinType.toLowerCase() === "or"
    ) {
      (operation.notShow as Array<ValueProp | boolean | Function>).forEach(
        filter => {
          const filterType = Object.prototype.toString
            .call(filter)
            .slice(8, -1);
          if (filterType === "Boolean") {
            show = show === null ? !filter : show || !filter;
          } else if (filterType === "Function") {
            show =
              show === null
                ? !(filter as Function)()
                : show || !(filter as Function)();
          } else {
            if (
              (filter as ValueProp).value.includes(
                row[(filter as ValueProp).prop]
              )
            ) {
              show = false;
            }
          }
          if (!show) {
            return;
          }
        }
      );
    } else {
      (operation.notShow as Array<ValueProp | boolean | Function>).forEach(
        filter => {
          const filterType = Object.prototype.toString
            .call(filter)
            .slice(8, -1);
          if (filterType === "Boolean") {
            show = show === null ? !filter : show && !filter;
          } else if (filterType === "Function") {
            show = show === null ? !filter : show && !(filter as Function)();
          } else {
            if (
              !(filter as ValueProp).value.includes(
                row[(filter as ValueProp).prop]
              )
            ) {
              show = true;
            }
          }
          if (show) {
            return;
          }
        }
      );
    }
    return show;
  }
}
</script>
