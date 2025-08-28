import { ref, onMounted, watch } from 'vue';

const theme = ref('light');

export function useTheme() {
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      theme.value = savedTheme;
    }
  });

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-mode' : '';
  }, { immediate: true });

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  return {
    theme,
    toggleTheme,
  };
}