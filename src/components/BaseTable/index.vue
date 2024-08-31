<template>
  <div class="base-table">
    <slot name="header"></slot>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      border
      style="width: 100%; overflow-y: auto"
      @selection-change="changeSelection"
      @select="handleSelectionChange"
      highlight-current-row
      ref="table"
      :height="tableHeight"
    >
      <!-- prop="date" label="Date" sortable width="180"  -->
      <el-table-column
        type="selection"
        width="55"
        v-if="isSelection"
        :selectable="selectable"
      />
      <el-table-column
        type="index"
        width="80"
        v-if="isNo"
        label="序号"
        align="center"
      />
      <template v-for="(item, index) in tableOption">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :min-width="item.minWidth"
          :key="index"
          v-if="!item.hidden"
          :show-overflow-tooltip="true"
          :align="item.align ? item.align : 'center'"
          header-align="center"
        >
          <!-- <template #header v-if="item.isTotal">
					<div>
						<div class="money">
							<el-form label-width="100px" label-position="right">
								<el-form-item label="总资金:">{{ item.render().split('-')[0] }}元</el-form-item>
								<el-form-item label="剩余资金:">{{ item.render().split('-')[1] }}元</el-form-item>
							</el-form>
						</div>
					</div>
          </template>-->

          <template #default="scope">
            <div v-if="item.btn">
              <div v-if="item.drop" class="drop">
                <el-dropdown>
                  <el-button
                    link
                    type="primary"
                    style="font-weight: 700; font-size: 20px"
                    >...</el-button
                  >
                  <template #dropdown>
                    <el-dropdown-menu>
                      <div
                        class="drop-btn-item"
                        v-for="(menu, idx) in item.btn"
                        :key="idx"
                        v-hasPermi="[menu.hasPermi]"
                        style="width: 70px; text-align: center"
                      >
                        <el-button
                          link
                          type="primary"
                          @click="menu.func(scope.row)"
                          >{{ menu.name }}</el-button
                        >
                      </div>
                      <!-- v-hasPermi="[menu.hasPermi]" -->
                      <!-- <el-dropdown-item
											
                      ></el-dropdown-item>-->
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div v-else style="display: flex; justify-content: center">
                <div
                  v-for="(k, index) in typeof item.btn == 'function'
                    ? item.btn(scope.row)
                    : item.btn"
                  :key="index"
                >
                  <div v-if="k.hasPermi">
                    <el-button
                      link
                      type="primary"
                      v-if="
                        k.show && typeof k.show == 'function'
                          ? k.show(scope.row)
                          : true
                      "
                      v-hasPermi="[k.hasPermi]"
                      @click="k.func(scope.row)"
                      :style="{ color: k.color, marginRight: '8px' }"
                    >
                      {{ k.name }}
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button
                      link
                      type="primary"
                      v-if="
                        k.show && typeof k.show == 'function'
                          ? k.show(scope.row)
                          : true
                      "
                      @click="k.func(scope.row)"
                      :style="{ color: k.color, marginRight: '8px' }"
                    >
                      {{ k.name }}
                    </el-button>
                  </div>
                </div>
                <!-- <el-button
                  v-for="(k, index) in typeof item.btn == 'function'
                  ? item.btn(scope.row)
                  : item.btn"
                  :key="index"
                  link type="primary"
                  v-hasPermi="[k.hasPermi]"
                  v-if="k.show && typeof k.show == 'function' ? k.show(scope.row) : true"
                  @click="k.func(scope.row)"
                  :style="{ color: k.color }"
                >{{ k.name }}</el-button> -->
              </div>
            </div>
            <div v-else-if="item.isInput">
              <el-input v-model="scope.row[item.prop]" style="width: 100%" />
            </div>
            <div v-else>
              <div v-if="item.color">
                <div v-if="item.render">
                  <span :style="{ color: item.color(scope.row) }">{{
                    item.render(scope.row)
                  }}</span>
                </div>
                <span
                  v-else
                  @click="item.click(scope.row)"
                  :style="{ color: item.color(scope.row), cursor: 'pointer' }"
                  >{{ scope.row[item.prop] }}</span
                >
              </div>
              <div v-else-if="item.isProgress">
                <el-progress
                  type="circle"
                  color="#2077da"
                  :percentage="
                    parseInt(item.render(scope.row)) > 100
                      ? 100
                      : parseInt(item.render(scope.row))
                  "
                  v-if="!isNaN(parseInt(item.render(scope.row)))"
                >
                  <!-- <template #default="{ percentage }">
                  <span class="percentage-label" v-if="percentage == 0"
                    >完成</span
                  >
                  </template>-->
                </el-progress>
                <!-- <el-progress v-else type="circle" :percentage="0" /> -->
              </div>
              <div v-else-if="item.render">
                <span>{{ item.render(scope.row) }}</span>
              </div>
              <div v-else-if="item.tagRender">
                <span v-if="item.multiple">
                  <el-tag
                    v-for="(multiple, mIndex) in item.tagRender(scope.row)"
                    :key="mIndex"
                  >
                    {{ multiple }}</el-tag
                  >
                </span>
                <span v-else>
                  <el-tag>{{ item.tagRender(scope.row) }}</el-tag>
                </span>
              </div>
              <div v-else-if="item.isImg">
                <!-- <p>--{{ scope.row[item.prop] }}--</p> -->
                <el-image
                  :src="item.imgrender(scope.row)"
                  alt
                  style="
                    width: 80px;
                    height: 38px;
                    display: block;
                    margin: auto;
                  "
                  :preview-src-list="[item.imgrender(scope.row)]"
                  :initial-index="0"
                  preview-teleported
                />
              </div>
              <div v-else-if="item.isSwitch">
                <el-switch
                  v-model="scope.row[item.prop]"
                  :inactive-value="0"
                  :active-value="1"
                  class="ml-2"
                  @change="($event) => changeSwitch($event, scope.row)"
                />
                <!-- <el-switch :model-value="scope.row[item.prop]" @change="changeSwitch(scope.row)" :active-value="1"
                  :inactive-value="0"></el-switch> -->
              </div>
              <div v-else-if="item.isLink">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="downloaded(item.linkrender(scope.row))"
                >
                  <el-icon>
                    <Link /> </el-icon
                  >下载
                </el-link>
              </div>
              <div v-else-if="item.isPoint">
                <el-tag type="danger" v-if="item.isPoint(scope.row)"
                  >重点</el-tag
                >
                <span>{{ scope.row[item.prop] }}</span>
              </div>
              <div v-else-if="item.isCopy">
                <span
                  style="cursor: pointer"
                  @click="handleCopy(scope.row[item.prop])"
                  >{{ scope.row[item.prop] }}</span
                >
              </div>
              <div v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :pagerCount="5"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      @pagination="getList"
      :layout="layout"
    ></pagination>
  </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  selectable: {
    type: Function,
    default: () => {
      return true;
    },
  },
  tableHeight: {
    type: Number,
    default: 540,
  },
  tableData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  tableOption: {
    type: Array,
    default: () => {
      return [];
    },
  },
  page: {
    type: Object,
    default: () => {
      return {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      };
    },
  },
  total: {
    type: Number,
    default: 0,
  },

  isSelection: {
    type: Boolean,
    default: false,
  },
  isNo: {
    type: Boolean,
    default: true,
  },
  tableLoading: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  pagerCount: {
    type: Number,
    default: 7,
  },
});

const {
  tableData,
  tableOption,
  page,
  total,
  isSelection,
  tableHeight,
  tableLoading,
} = toRefs(props);

const { proxy } = getCurrentInstance();

// const total = ref(1);

const emit = defineEmits([
  "changePage",
  "handleSelectionChange",
  "changeSwitch",
  "changeSelection",
]);

const getList = (row) => {
  emit("changePage", row);
};

const handleSelectionChange = (selection, row) => {
  emit("handleSelectionChange", row);
};
const changeSelection = (selection) => {
  emit("changeSelection", selection);
};

const clearSelection = () => {
  proxy.$refs.table.clearSelection();
};

const toggleRowSelection = (row, selected = true) => {
  // debugger
  proxy.$refs.table.toggleRowSelection(row, selected);
};

const changeSwitch = (val, row) => {
  emit("changeSwitch", val, row);
};

function downloaded(params) {
  if (!params) return;
  // download(encodeURI(params), "", "application/pdf");
  window.open(params);

  // const a = document.createElement("a");
  // const url = window.URL.createObjectURL(blob);
  // a.href = params;
  // a.download = params;
  // a.click();
  // window.URL.revokeObjectURL(url);
}
function handleCopy(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      proxy.$message.success("复制成功");
    })
    .catch((err) => {
      proxy.$message.error("复制失败");
    });
}

defineExpose({
  clearSelection,
  toggleRowSelection,
});
</script>

<style lang="scss" scoped>
.base-table {
  .el-progress-circle {
    width: 34px !important;
    height: 34px !important;
  }

  .el-progress__text {
    min-width: 34px;

    span {
      font-size: 10px;
    }
  }

  .drop {
    .el-button--text:focus,
    .el-button--text:hover {
      color: #165dff;
    }

    .el-button--text {
      color: #000000;
    }
  }

  .money {
    :deep(.el-form-item--default) {
      margin: 0;
    }
  }
}

.pagination-container {
  position: relative !important;
}

.el-tag {
  margin-right: 10px;
}
</style>
