<template>
  <div id="app">
    <div class="container">
    <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'App',
  setup() {
    const auth = getAuth();
    const router = useRouter();
    const isAuthenticated = ref(false);
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
        if (user) {
          router.push('/');
        } else {
          router.push('/signup');
        }
      });
    });

    return { isAuthenticated };
  }
};
</script>

<style scoped>
  .container {
    font-family: monospace;
    margin: 60px;
    margin-top: 40px;
    box-sizing: content-box;
    border: 1px solid grey;
    border-radius: 32px;
    margin-left: 80px;
    height: 600px;
    padding: 2%;
    overflow: nonel;
  }

  @media only screen and (max-width: 600px) {
    .container {
      margin-left: 0px;
    }
  }
  
</style>