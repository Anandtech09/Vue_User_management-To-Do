<template>
  <div class="nav-bar">
    <div class="head-content">
      <img src="@/assets/images/logo.png" alt="logo" />
      <h1>Welcome</h1> <span>{{ displayName }}</span>
    </div>
    <div class="but-nav">
      <button class="btn" @click="gotoHome">Home</button>
      <button class="btn" @click="goToCreate">Create Task</button>
      <button class="btn" @click="goToProfile">Profile</button>
      <button class="btn btnlog" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { getUserProfile } from '@/firebase';

export default {
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const displayName = ref(sessionStorage.getItem('displayName') || '');

    const fetchUserProfile = async () => {
  if (!displayName.value) {
    const user = auth.currentUser;
    if (user) {
      try {
        const profile = await getUserProfile();
        displayName.value = profile?.name ? profile.name : user.email;
        sessionStorage.setItem('displayName', displayName.value);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        displayName.value = user.email;
        sessionStorage.setItem('displayName', displayName.value);
      }
    } else {
      displayName.value = 'Guest';
    }
  }
};


    onMounted(() => {
      fetchUserProfile();
    });

    const goToCreate = () => {
      router.push('/create');
    };

    const gotoHome = () => {
      router.push('/');
    };

    const goToProfile = () => {
      router.push('/profile');
    };

    const logout = async () => {
      try {
        await signOut(auth);
        sessionStorage.removeItem('displayName');
        router.push('/login');
      } catch (err) {
        console.error('Error logging out:', err);
      }
    };

    return { goToCreate, goToProfile, gotoHome, logout, displayName };
  },
};
</script>

<style scoped>

.head-content {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

h1 {
    color: #FF4E81;
    font-weight: bolder;
    margin: 0px;
}

span {
    color: rgb(17, 186, 233);
    font-size: 34px;
    font-weight: bold;
}

.nav-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
}

.but-nav {
    display: flex;
    gap: 10px;
    height: 40px;
}

.btn {
    color: rgb(17, 186, 233);
    font-weight: bolder;
}

.btn:hover {
    border: 1px solid #FF8225;
    color: #FF8225;
    font-weight: bolder;
    filter: drop-shadow(0px 0px 8px #FF4E88);
}

.btnlog {
    border: 1px solid red;
    color: red;
}

img {
    width: 70px;
    height: 60px;
}

@media only screen and (max-width: 660px) {
    .head-content {
      flex-direction: column;
      gap: 3px;
    }

    span {
      font-size: 12px;
    }

    .but-nav{
      gap: 2px;
      padding: 0px;
    }
  }

</style>
