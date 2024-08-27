<template>
  <NavBar />
  <div class="card card-body">
    <h1>Edit Profile</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <input class="form-control" type="text" v-model="name" placeholder="Enter Name" required />
      </div>
      <div class="form-group">
        <input class="form-control" type="text" v-model="address" placeholder="Enter Address" required />
      </div>
      <div class="form-group">
        <input class="form-control" type="tel" v-model="phoneNo" placeholder="Phone No" pattern="[0-9]{10}" required />
      </div>
      <div class="form-group">
        <input class="form-control" type="file" @change="onFileChange" />
      </div>
      <button class="btn btn-main" type="submit" :disabled="loading">Save</button>
      <div v-if="loading" class="spinner"></div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { updateUserProfile, uploadProfilePhoto, getUserProfile } from '@/firebase';
import { useRouter } from 'vue-router';
import NavBar from './NavBar.vue';

export default {
  components: {
    NavBar,
  },
  setup() {
    const name = ref('');
    const address = ref('');
    const phoneNo = ref('');
    const loading = ref(false);
    const error = ref('');
    const auth = getAuth();
    const router = useRouter();

    onMounted(async () => {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        name.value = profile.name || '';
        address.value = profile.address || '';
        phoneNo.value = profile.phoneNo || '';
      } catch (error) {
        console.error('Error fetching profile:', error);
        error.value = 'Error fetching profile data.';
      }
    });

    const onSubmit = async () => {
      loading.value = true;
      try {
        await updateUserProfile({
          name: name.value,
          address: address.value,
          phoneNo: phoneNo.value
        });

        router.push('/profile');
      } catch (error) {
        error.value = 'Error updating profile';
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    };

    const onFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const photoURL = await uploadProfilePhoto(file);
          await updateUserProfile({ photoURL });
        } catch (error) {
          error.value = 'Error uploading photo';
          console.error('Error:', error);
        }
      }
    };

    return { name, address, phoneNo, onSubmit, loading, error, onFileChange };
  },
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
  