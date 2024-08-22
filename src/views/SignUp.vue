<template>
    <div class="card card-body">
      <h1>Sign Up</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input class="form-control" type="email" v-model="email" placeholder="Enter Email" required />
        </div>
        <div class="form-group">
          <input class="form-control" type="password" v-model="password" placeholder="Enter Password" required />
        </div>
        <div class="btn-flex">
        <button class="btn btn-main" type="submit" :disabled="loading">Sign Up</button>
        <button class="btn btn-login"  @click="goToLogin">Already have Account</button>
        </div>
        <div v-if="loading" class="spinner"></div>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </template>
  
  <script>
    import { ref } from 'vue';
    import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
    import { useRouter } from 'vue-router';
    
    export default {
        setup() {
        const email = ref('');
        const password = ref('');
        const loading = ref(false);
        const error = ref('');
        const router = useRouter();
        
        const onSubmit = async () => {
            loading.value = true;
            try {
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            router.push('/');
            } catch (err) {
            error.value = err;
            //console.error('Error:', err);
            } finally {
            loading.value = false;
            }
        };
        const goToLogin = () => {
            router.push('/login');
        };
        
        return { email, password, onSubmit, loading, error, goToLogin };
        }
    };

  </script>
  
  <style scoped>

      .card-body {
        margin: 30%;
        margin-top: 5%;
        margin-bottom: 50px;
      }
      
      h1 {
        text-align: center;
        font-weight: bolder;
        font-size: 40px;
        color: #FF4E81;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      button {
        width: 100%;
        font-weight: bolder;
      }

      .btn-main {
        background-color: #FF8C9E;
      }
      
      .card-body {
        background-color: #B4D6CD;
        filter: drop-shadow(2px 4px 8px #FF4E88);
        transition: background-color 0.3s ease, filter 0.3s ease;
        padding: 1rem;
        border-radius: 8px;
      }
      

      .btn-main:hover {
        border: 1px solid #FF4E88;
        color: #FF4E88;
        font-weight: bolder;
      }
      
      .spinner {
        margin: 20px auto;
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid #007bff;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .error {
        color: red;
        font-weight: bolder;
        text-align: center;
        margin-top: 10px;
      }

      .form-control:hover {
        filter: drop-shadow(2px 4px 8px grey)
      }

      .btn-flex {
        display: flex;
        justify-content: space-between;
        gap:10px
      }

      .btn-login {
        border: 2px solid grey;
      }

      .btn-login:hover {
        border: 2px solid black;
      }

    </style>