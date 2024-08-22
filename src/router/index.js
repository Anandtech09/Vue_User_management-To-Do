import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import TaskList from '@/components/TaskList.vue';
import TaskCreate from '@/components/TaskCreate.vue';
import TaskUpdate from '@/components/TaskUpdate.vue';
import Login from '@/views/UserLogin.vue';
import SignUp from '@/views/SignUp.vue';
import ProfileEdit from '@/components/ProfileEdit.vue';
import UserProfile from '@/components/UserProfile.vue';
import AddUserDetails from '@/components/AddUserDetails.vue';

const routes = [
  { path: '/signup', component: SignUp, meta: { requiresAuth: false } },
  { path: '/', component: TaskList, meta: { requiresAuth: true } },
  { path: '/create', component: TaskCreate, meta: { requiresAuth: true } },
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  { path: '/update/:id', component: TaskUpdate, meta: { requiresAuth: true } },
  { path: '/profile', component: UserProfile,query: { refreshed: true } , meta: { requiresAuth: true } },
  { path: '/edit-profile',component: ProfileEdit, meta:{ requiresAuth: true}},
  { path: '/add-user-details', component: AddUserDetails, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/signup' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (to.meta.requiresAuth && !currentUser) {
    next('/signup');
  } else if (to.path === '/signup' && currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;
