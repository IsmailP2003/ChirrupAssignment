import {createRouter, createWebHistory} from 'vue-router';

import Home from "../views/pages/Home.vue"
import Login from "../views/pages/Login.vue"
import SignUp from "../views/pages/SignUp.vue"
import SinglePost from "../views/components/SinglePost.vue"
import Profile from "../views/pages/Profile.vue"
import SingleUser from "../views/components/SingleUser.vue"

const ifAuthenticated = (to, from, next) => {
    const loggedIn = localStorage.getItem('session_token');
    if (loggedIn) {
        next()
        return
     }
     next('/login')
}

const routes = [
    { path: "/", component: Home},
    { path: "/login", component: Login},
    { path: "/signup", component: SignUp},
    { path: "/posts/:id", component: SinglePost},
    { path: "/profile", component: Profile, beforeEnter: ifAuthenticated},
    { path: "/users/:id", component: SingleUser},

    //{ path: "/:pathMatch(.*)*",component: NotFound}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router;
