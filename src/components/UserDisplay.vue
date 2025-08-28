<template>
  <div v-if="user" class="user-display">
    <div class="user-info">
      <span class="user-name">{{ user.name }}</span>
      <span class="user-email">{{ user.email }}</span>
    </div>
  </div>
  <div v-else>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'; 

interface User {
  name: string;
  email: string;
}

const user = ref<User | null>(null);
const route = useRoute(); 

const fetchUserData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    user.value = null;
    return;
  }
  try {
    const response = await axios.get('http://localhost:3000/api/v1/user_data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data && response.data.user) {
      user.value = response.data.user;
    } else {
      user.value = response.data;
    }
  } catch (err) {
    console.error('Erro ao buscar dados do usuário:', err);
    localStorage.removeItem('token');
    user.value = null; 
  }
};

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    fetchUserData();
  }
);

onMounted(fetchUserData);
</script>

<style scoped>
.user-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-weight: bold;
}
.user-email {
  font-size: 0.8em;
  color: #555;
}
body.dark-mode .user-display {
  background-color: #2d3748;
}

body.dark-mode .user-name,
body.dark-mode .user-email {
  color: #a0aec0;
}
</style>