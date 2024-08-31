<template>
  <div class="app_container">
    <div class="cssanimation leSnake">
      <span v-for="(item, index) in title" :key="index">{{ item }}</span>
    </div>

  </div>
</template>
<script setup>
// const store = computed(() => useStore());
const title = ref('欢迎回来');
// onMounted(() => {
//   title.value  = `欢迎${store.value.getters.name}进入数字志愿者总帐台`;
// });

</script>

<style lang="scss" scoped>
.app_container {
  height: calc(100vh - 84px);
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Arial', sans-serif;
  overflow: hidden;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leSnake {
  position: relative;
  font-size: 34px;
  letter-spacing: 8px;
  display: flex;

  span {
    display: block;
    font-size: 36px;
    animation: wave 0.8s ease-in-out alternate infinite;
    transform: translateY(-20%);
  }
}

@for $i from 1 through 4 {
  .leSnake span:nth-child(#{$i}) {
    animation-delay: 0.1s * $i;
  }
}

@keyframes wave {
  from {
    transform: translateY(-20%);
  }

  to {
    transform: translateY(20%);
  }
}
</style>
