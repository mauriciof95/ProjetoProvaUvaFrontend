import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Index.vue')
        },
        {
            path: '/pedido-enviado',
            name: 'pedido-enviado',
            component: () => import('../views/pedido/PedidoEnviado.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/pedido',
            component: () => import('../views/pedido/IndexPedido.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/pedido/detalhes/:id',
            component: () => import('../views/pedido/DetalhesPedido.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('autenticacao')
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router
