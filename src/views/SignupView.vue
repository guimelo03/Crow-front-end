<template>
  <div class="signup-container">
    <div class="signup-card">
      <h1 class="signup-title">Criar Conta</h1>
      <form @submit.prevent="signup" class="signup-form">
        <input v-model="name" type="text" placeholder="Nome" required class="signup-input" />
        <input v-model="email" type="email" placeholder="E-mail" required class="signup-input" />
        <input v-model="password" type="password" placeholder="Senha" required class="signup-input" />
        <input v-model="passwordConfirmation" type="password" placeholder="Confirme sua senha" required class="signup-input" />

        <div class="form-group">
          <label for="role" class="role-label">Como você irá usar a plataforma?</label>
          <select id="role" v-model="role" required class="signup-input role-select">
            <option value="student">Estudos (Apenas Cursos)</option>
            <option value="project_only">Projetos (Apenas Projetos)</option>
            <option value="user_full">Ambos (Cursos e Projetos)</option>
          </select>
        </div>

        <button type="submit" :disabled="loading" class="signup-button">
          {{ loading ? 'Carregando...' : 'Cadastrar' }}
        </button>
      </form>
      <div v-if="error" class="signup-error">{{ error }}</div>
      <p class="login-link-container">
        Já tem uma conta? <router-link to="/login" class="login-link">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref('')
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const role = ref('user_full');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const signup = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('http://localhost:3000/api/v1/users', {
      user: {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value, // Nome do parâmetro corrigido
        role: role.value,
      },
    });

    const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token);
      alert('Usuário cadastrado com sucesso! Redirecionando para o Dashboard.');
      router.push('/dashboard');
    } else {
      alert('Usuário cadastrado com sucesso! Por favor, faça o login.');
      router.push('/login');
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.errors?.[0] || 'Erro ao tentar fazer o cadastro.';
    } else {
      error.value = 'Erro de rede ou servidor. Tente novamente.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.signup-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.signup-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.signup-input {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}
.signup-input:focus {
  outline: none;
  border-color: #6A0DAD;
}
.signup-button {
  padding: 1rem;
  background-color: #6A0DAD;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.signup-button:hover:not(:disabled) {
  background-color: #9370DB;
}
.signup-button:disabled {
  background-color: #9cd4a7;
  cursor: not-allowed;
}
.signup-error {
  color: #d9534f;
  margin-top: 1rem;
  font-size: 0.9rem;
}
.login-link-container {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}
.login-link {
  color: #6A0DAD;
  text-decoration: none;
}
.form-group {
  text-align: left;
}
.role-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}
.role-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgba(0,0,0,0.5)" d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 1rem center;
}
</style>