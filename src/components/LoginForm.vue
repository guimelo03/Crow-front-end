<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Acesso à Plataforma</h1>
      <form @submit.prevent="login" class="login-form">
        <input v-model="email" type="email" placeholder="E-mail" required class="login-input" />
        <input v-model="password" type="password" placeholder="Senha" required class="login-input" />
        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? 'Carregando...' : 'Entrar' }}
        </button>
        <p class="signup-link-container">
          Não tem uma conta? <router-link to="/signup" class="signup-link">Cadastre-se</router-link>
        </p>
      </form>
      <div v-if="error" class="login-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const login = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('http://localhost:3000/api/v1/login', {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('token', response.data.token);
    router.push('/dashboard');
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.error || 'Erro ao tentar fazer login.';
    } else {
      error.value = 'Erro de rede ou servidor. Tente novamente.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.login-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.login-input {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}
.login-input:focus {
  outline: none;
  border-color: #6A0DAD;
}
.login-button {
  padding: 1rem;
  background-color: #6A0DAD;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.login-button:hover:not(:disabled) {
  background-color: #9370DB;
}
.login-button:disabled {
  background-color: #a0c9ef;
  cursor: not-allowed;
}
.login-error {
  color: #d9534f;
  margin-top: 1rem;
  font-size: 0.9rem;
}
.signup-link-container {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}
.signup-link {
  color: #28a745;
  text-decoration: none;
}
</style>