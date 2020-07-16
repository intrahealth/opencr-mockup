import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Client from "../views/Client.vue";
import Review from "../views/Review.vue";
import Resolve from "../views/Resolve.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/client/:clientId/:sourceId?",
    name: "client",
    component: Client
  },
  {
    path: "/review",
    name: "review",
    component: Review
  },
  {
    path: "/resolve/:clientId?",
    name: "resolve",
    component: Resolve
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
