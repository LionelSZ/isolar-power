<template>
  <div class="container">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-model="dialogVisible"
      :title="title"
      width="40%"
      :before-close="cancel"
    >
      <div class="transfer_container">
        <el-transfer
          v-model="userValue"
          :data="userData"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="关键字搜索用户名称"
          :titles="['未选择用户', '已选择用户']"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emits = defineEmits(["userValue"]);

const title = ref("设计角色用户");
const dialogVisible = ref(false);
const userValue = ref([]);
const userData = ref([]);
const show = (row) => {
  dialogVisible.value = true;
  const data = generateData();
  userData.value = data;
};
const generateData = () => {
  const data = [];
  for (let i = 1; i <= 5; i++) {
    data.push({
      key: i,
      value: i,
      phone: "18679228888",
      label: `Option ${i}`,
    });
  }
  return data;
};
const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase());
};
const cancel = () => {
  dialogVisible.value = false;
};
const confirm = () => {
  const newData = userData.value.filter((item) =>
    userValue.value.includes(item.value)
  );
  emits("userValue", newData);
  dialogVisible.value = false;
};
defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.dialog_container {
  padding: 20px;
  .transfer_container {
  }
}
:deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
}
</style>
