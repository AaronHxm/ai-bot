import { ref } from 'vue';

// 创建一个简单的事件总线
export const eventBus = ref({
    onNewSession: null
});