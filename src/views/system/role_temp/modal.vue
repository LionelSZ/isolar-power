<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="dialogVisible"
      :title="title"
      width="50%"
      :before-close="cancel"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        :inline="true"
        label-width="120px"
        class="dialog_container"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            clearable
            autocomplete="off"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleKey">
          <el-input
            v-model="form.roleKey"
            clearable
            autocomplete="off"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="功能权限" prop="menuIds">
          <div class="tree-wrap">
            <div>
              <el-checkbox
                v-model="menuExpand"
                @change="handleCheckedTreeExpand"
                >展开/折叠</el-checkbox
              >
              <el-checkbox
                v-model="menuNodeAll"
                @change="handleCheckedTreeNodeAll"
                >全选/全不选</el-checkbox
              >
              <el-checkbox
                v-model="form.menuCheckStrictly"
                @change="handleCheckedTreeConnect"
                >父子联动</el-checkbox
              >
            </div>
            <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menuRef"
              node-key="id"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
            ></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="角色用户" prop="roleUser">
          <div class="edit_user_wrap">
            <el-button type="primary" size="small" @click="editUser"
              >编辑用户</el-button
            >
            <div class="user_list">
              <div class="user_list_content">
                <div v-for="item in form.roleUser" :key="item.value">
                  <el-tag closable @close="handleClose(item)">{{
                    item.label + "-" + item.phone
                  }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <model-user ref="modelUserRef" @userValue="getUserValue" />
  </div>
</template>

<script setup>
import {
  ref,
  defineExpose,
  reactive,
  getCurrentInstance,
  defineEmits,
  defineProps,
} from "vue";
import { deepClone } from "@/utils";
import { addRole, updateRole } from "@/api/system/role";
import modelUser from "./modalUser.vue";
import {
  roleMenuTreeselect,
  treeselect as menuTreeselect,
} from "@/api/system/menu";

const { proxy } = getCurrentInstance();
const dialogVisible = ref(false);
const dictList = reactive({
  blockList: [],
});
const operationType = ref("add");
const initForm = {
  roleName: "",
  roleKey: "",
  menuCheckStrictly: true,
  menuIds: [],
  roleUser: [
    {
      label: "张三",
      phone: "18679228888",
      value: "admin",
    },
    {
      label: "李四",
      phone: "18679228888",
      value: "common",
    },
    {
      label: "王二",
      phone: "18679228888",
      value: "test",
    },
  ],
};

const menuOptions = ref([]);
const menuRef = ref(null);
const form = ref(JSON.parse(JSON.stringify(initForm)));
const title = ref("新增配置");

const rules = reactive({
  name: [{ required: true, message: "网关名称不能为空", trigger: "blur" }],
});

const menuExpand = ref(false);
const menuNodeAll = ref(false);

const show = (row) => {
  title.value = row.title;
  operationType.value = "add";
  getMenuTreeselect();
  if (row.data) {
    let data = deepClone(row.data);
    operationType.value = "edit";
    // const roleId = row.roleId || ids.value;
    // const roleMenu = getRoleMenuTreeselect(roleId);

    form.value = JSON.parse(JSON.stringify(data));
  } else {
  }
  loadDicList();
  dialogVisible.value = true;
};

const cancel = () => {
  dialogVisible.value = false;
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  proxy.$refs.formRef.resetFields();
  form.value = JSON.parse(JSON.stringify(initForm));
};

const emits = defineEmits(["refresh"]);

const confirm = () => {
  proxy.$refs.formRef.validate((valid) => {
    if (valid) {
      let params = deepClone(form.value);

      // return console.log(operationType.value);
      if (operationType.value == "add") {
        addRole(params).then((res) => {
          proxy.$modal.msgSuccess("新增成功");
          dialogVisible.value = false;
          cancel();
          emits("refresh");
        });
      } else {
        updateRole(params).then((res) => {
          proxy.$modal.msgSuccess("修改成功");
          dialogVisible.value = false;
          cancel();
          emits("refresh");
        });
      }
    }
  });
};

const loadDicList = async () => {};

function editUser() {
  proxy.$refs.modelUserRef.show();
}
/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(roleId) {
  return roleMenuTreeselect(roleId).then((response) => {
    menuOptions.value = response.menus;
    return response;
  });
}
function getUserValue(value) {
  form.value.roleUser = value;
}
function handleClose(item) {
  let index = form.value.roleUser.findIndex((v) => v.value == item.value);
  form.value.roleUser.splice(index, 1);
}

/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then((response) => {
    menuOptions.value = response.data;
  });
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = menuOptions.value;
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
  }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
}

/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  form.value.menuCheckStrictly = value ? true : false;
}

defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.dialog_container {
  :deep(.el-select) {
    width: 100%;
  }

  // :deep(.el-select .el-input) {
  //   max-width: 200px !important;
  // }

  .el-input {
    width: 300px;
  }
  $tree-height: 400px;
  .tree-wrap {
    .el-checkbox {
      margin-right: 10px;
    }
    .tree-border {
      border: 2px solid #ebeef5;
      border-radius: 4px;
      padding: 10px;
      height: $tree-height;
      width: 220px;
      overflow: auto;
    }
  }
  .edit_user_wrap {
    width: 200px;
    .user_list {
      height: $tree-height;
      border: 2px solid #ebeef5;
      margin-top: 8px;
      overflow: auto;
      .user_list_content {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        box-sizing: border-box;
        > div {
          .el-tag {
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  :deep(.el-form-item) {
    margin-top: 10px;
  }

  .upload-disable {
    :deep(.el-upload--picture-card) {
      display: none;
    }
  }
}
</style>
