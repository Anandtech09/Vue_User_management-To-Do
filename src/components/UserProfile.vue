<template>
  <NavBar />
  <div class="prof-container">
    <div class="rotating-border">
      <div v-if="profile" class="profile-card">
        <img :src="profile.photoURL || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg&ga=GA1.1.449258928.1712415393&semt=ais_hybrid'" alt="Profile Photo" class="profile-photo" />
        <h2>{{ profile.name }}</h2>
        <p>{{ profile.address }}</p>
        <p>{{ profile.phoneNo }}</p>
        <button class="btn btn-main" @click="editProfile">Edit Profile</button>
      </div>
      <div v-else>
        <p class="load">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, watch } from 'vue';
  import { getUserProfile } from '@/firebase';
  import { useRouter, useRoute } from 'vue-router';
  import NavBar from './NavBar.vue';

  export default {
    components: {
      NavBar,
    },
    setup() {
      const profile = ref(null);
      const displayName = ref(sessionStorage.getItem('displayName') || '');
      const profileImage = ref(sessionStorage.getItem('profileImage') || null);
      const router = useRouter();
      const route = useRoute();

      const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          sessionStorage.setItem('displayName', userProfile.name || displayName.value);
          sessionStorage.setItem('profileImage', userProfile.photoURL || profileImage.value);
          profile.value = userProfile;
          router.replace({ query: { refreshed: true } });
        } else {
          router.push('/add-user-details');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

      const editProfile = () => {
        router.push('/edit-profile');
      };

      onMounted(loadProfile);

      watch(() => route.query.refreshed, (newVal) => {
        if (newVal) {
          loadProfile();
        }
      });

      return {
        profile,
        editProfile,
      };
    },
  };
</script>

<style scoped>
  .prof-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rotating-border {
    padding: 20px;
    width: 30%;
    background-color: #f3f4f6;
    border-radius: 15px;
    border: 4px solid transparent;
    background: linear-gradient(45deg, #FF4E88, #FF8225, #11BAE9, #FF4E88);
    background-size: 300% 300%;
    animation: gradient-rotate 4s linear infinite;
  }

  @keyframes gradient-rotate {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .profile-card {
    position: relative;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    overflow: hidden;
  }

  .profile-photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 3px solid #FF4E88;
  }

  .btn-main {
    border: 2px solid #FF4E88;
    color: #FF4E88;
    font-weight: bolder;
    background: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-main:hover {
    color: white;
    background-color: #FF4E88;
    border: 2px solid #FF4E88;
    filter: drop-shadow(2px 4px 8px grey)
  }

  h2 {
    color: #FF4E88;
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    color: #555;
    font-size: 16px;
    margin-bottom: 5px;
  }

  .load {
    font-weight: bolder;
    color: white;
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }

</style>
