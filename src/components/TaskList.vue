<template>
  <div class="task-list">
    <NavBar />
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5">Loading...</td>
        </tr>
        <tr v-else-if="tasks.length === 0">
          <td colspan="5">No tasks found.</td>
        </tr>
        <tr v-else v-for="task in tasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.dueDate }}</td>
          <td>{{ task.priority }}</td>
          <td class="nocolor">
            <button class="btn" @click="editTask(task.id)">Edit</button>
            <button class="btn btnlog" style="margin-left:5px" @click="deleteTask(task.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useLoadTasks, deleteTask as firebaseDeleteTask } from '@/firebase';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar,
  },
  setup() {
    const tasks = ref([]);
    const loading = ref(true);
    const router = useRouter();

    const loadTasks = async () => {
      try {
        tasks.value = await useLoadTasks();
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadTasks);

    const editTask = (id) => {
      router.push(`/update/${id}`);
    };

    const deleteTask = async (id) => {
      try {
        tasks.value = tasks.value.filter(task => task.id !== id);
        await firebaseDeleteTask(id);
      } catch (error) {
        console.error('Error deleting task:', error);
        await loadTasks();
      }
    };

    return { tasks, loading, editTask, deleteTask };
  },
};
</script>

<style scoped>

    th, td {
        padding: 0.5rem;
        border: 3px solid #FF4E88;
    }

    table {
      margin: 0 auto;
      margin-top: 50px;
      width: 90%;
      border-collapse: collapse;
    }

    td:hover{
      background-color: #d1ecf1;
    }

    .btn {
        border: 1px solid rgb(17, 186, 233);
        color: rgb(17, 186, 233);
        font-weight: bolder;
    }

    .btn:hover {
        background-color: rgb(17, 186, 233);
        color: white;
    }

    .btnlog {
        border: 1px solid red;
        color: red;
    }

    .btnlog:hover {
        background-color: red;
        color: white;
    }

    .nocolor:hover {
      background-color: white;
    }

</style>
