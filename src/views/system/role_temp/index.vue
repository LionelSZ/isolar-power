<template>
  <div class="app_container">
    <div class="table_info">
      <el-form
        :model="queryParams"
        ref="queryRef"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="角色名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
            maxlength="255"
            @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item class="aligin_right">
          <el-button type="primary" icon="Search" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleInsert"
            >新增</el-button
          >
        </el-col>
        <right-toolbar
          v-model:showSearch="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <base-table
        :total="total"
        :tableLoading="loading"
        :tableData="tableData"
        :tableOption="tableOption"
        :page="queryParams"
        @changePage="changePage"
      ></base-table>
    </div>
    <modal ref="addRef" @refresh="getList"></modal>
  </div>
</template>

<script setup name="RoleTemp">
import { delRole, listRole } from "@/api/system/role";
import modal from "./modal.vue";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const tableData = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

const tableOption = [
  {
    prop: "roleName",
    label: "角色名称",
  },
  {
    prop: "roleKey",
    label: "描述",
  },
  {
    prop: "createTime",
    label: "创建时间",
  },
  {
    prop: "createTime",
    label: "修改时间",
  },
  {
    prop: "_action",
    label: "操作",
    btn: [
      {
        name: "编辑",
        func: (row) => {
          handleEdit(row);
        },
        hasPermi: "system:role_temp:edit",
      },

      {
        name: "删除",
        color: "#ff0000",
        func: (row) => {
          handleRemoveRow(row);
        },
        hasPermi: "system:role_temp:remove",
      },
    ],
  },
];

/** 查询列表 */
function getList() {
  loading.value = true;
  tableData.value = [{ companyAddress: "123" }, {}];
  listRole(queryParams.value)
    .then((res) => {
      loading.value = false;
      tableData.value = res.rows;
      total.value = res.total;
    })
    .catch((err) => {
      loading.value = false;
    });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
const handleInsert = () => {
  proxy.$refs.addRef.show({ title: "新增" });
};
const handleEdit = (row) => {
  proxy.$refs.addRef.show({ title: "编辑", data: row });
};
const handleRemoveRow = (row) => {
  proxy.$modal
    .confirm("确定要删除吗？")
    .then(() => {
      return delRole(row.id);
    })
    .then(() => {
      proxy.$modal.msgSuccess("操作成功");
      getList();
    });
};
const changePage = (params) => {
  queryParams.value.pageNum = params.page;
  queryParams.value.pageSize = params.limit;
  getList();
};

getList();
</script>


<style lang='scss' scoped>
.app_container {
  // min-height: calc(100vh - 84px);
  // overflow: hidden;
  // background-color: #f2f3f5;
  padding: 20px;
  box-sizing: border-box;


  .table_info {
    // padding: 20px;
    width: 100%;
    background-color: white;
    // margin: 20px 0px;
    position: relative;

    .mb8 {
      margin-bottom: 12px;
    }

    .el-link {
      margin-right: 12px;
    }
  }

  :deep(.el-drawer__header) {
    margin-bottom: 20px;
  }

  :deep(.el-drawer__body) {
    border-top: 2px #e5e6eb solid;
  }
}
</style>
