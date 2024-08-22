<template>
  <NavBar />
  <div class="card card-body">
    <h1>Update Task</h1>
    <form @submit.prevent="updateTask">
      <div class="form-group">
        <input class="form-control" type="text" v-model="selectedTask.title" placeholder="Enter Title" required />
      </div>
      <div class="form-group">
        <input class="form-control" type="text" v-model="selectedTask.description" placeholder="Enter Description" required />
      </div>
      <div class="form-group">
        <input class="form-control" type="date" v-model="selectedTask.dueDate" required />
      </div>
      <div class="form-group">
        <select class="form-select" v-model="selectedTask.priority" required>
          <option disabled value="">Select Priority</option>
          <option>Medium</option>
          <option>Low</option>
          <option>High</option>
        </select>
      </div>
      <button class="btn btn-main" type="submit" :disabled="loading">Update</button>
      <div v-if="loading" class="spinner"></div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue';
import { getTask, updateTask as firebaseUpdateTask } from '@/firebase';
import { useRoute, useRouter } from 'vue-router';
import NavBar from './NavBar.vue';

export default {
  components: {
    NavBar,
  },
  setup() {
    const selectedTask = ref({ title: '', description: '', dueDate: '', priority: '' });
    const loading = ref(false);
    const error = ref('');
    const route = useRoute();
    const router = useRouter();
    
    const loadTask = async () => {
      loading.value = true;
      error.value = '';
      try {
        const task = await getTask(route.params.id);
        if (task) {
          selectedTask.value = { id: route.params.id, ...task };
        } else {
          error.value = 'Task not found.';
          router.push('/');
        }
      } catch (err) {
        error.value = 'Error loading task data.';
        console.error('Error loading task:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadTask);
    
    watchEffect(() => {
      if (route.params.id) {
        loadTask();
      }
    });

    const updateTask = async () => {
      loading.value = true;
      error.value = '';
      try {
        await firebaseUpdateTask(selectedTask.value.id, {
          title: selectedTask.value.title,
          description: selectedTask.value.description,
          dueDate: selectedTask.value.dueDate,
          priority: selectedTask.value.priority
        });
        router.push('/');
      } catch (err) {
        error.value = 'Error updating task.';
        console.error('Error updating task:', err);
      } finally {
        loading.value = false;
      }
    };

    return { selectedTask, updateTask, loading, error };
  }
};

</script>

<style scoped>

  h1 {
      text-align: center;
      margin-bottom: 30px;
      font-weight: bolder;
      color: #FF4E81;
      cursor: pointer;
      position: relative;
      padding-bottom: 6px;
  }

  h1::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 3px;
      background-color: rgb(17, 186, 233);
      transition: width 0.3s;
  }

  h1:hover::after {
      width: 100%;
  }

  .card-body {
    width: 50%;
    margin: 0 auto;
    margin-top: 4%;
  }

  .form-group {
      margin-bottom: 20px;
    }

  button {
    width: 100%;
    font-weight: bolder;
  }

  .card-body {
    background-color: #d1ecf1;
    filter: drop-shadow(2px 4px 8px rgb(18, 164, 205));
    padding: 1rem;
    border-radius: 8px;
  }

  .btn-main {
    background-color: #FF8C9E;
  }

  .btn-main:hover {
    border: 1px solid #FF8225;
    color: #FF8225;
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

</style>