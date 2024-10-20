<script lang="ts" setup>
import useHeroicons from '@/composables/heroicons'
import { computed, onMounted, ref } from 'vue'
import VueCarrinho from '../VueCarrinho.vue'
import { usePedido } from '@/composables/pedido'
import VueModalAuth from '../VueModalAuth.vue'
import { useAuth } from '@/composables/auth'
const { ShoppingCartIcon, Bars3Icon, MagnifyingGlassIcon } = useHeroicons()
const { pegarNome, realizarLogout, clienteLogado, checkClienteLogado } = useAuth()
const menuAberto = ref(false)
const carrinhoAberto = ref(false)
const modalAuthAberto = ref(false)
const { pedidoItens } = usePedido()

onMounted(() => {
    checkClienteLogado()
})

const authModalMessage = ref('')
</script>

<template>
    <div>
        <header>
            <div class="container mx-auto px-6 py-3 border-b">
                <div class="flex items-center justify-between">
                    <div class="hidden w-full text-gray-600 lg:flex lg:items-center"></div>
                    <div class="w-full text-gray-700 lg:text-center text-2xl font-semibold">
                        VendasExpress
                    </div>
                    <div class="flex items-center justify-end w-full space-x-5">
                        <div v-if="clienteLogado" class="flex flex-col items-end">
                            <span>Bem Vindo, {{ pegarNome() }} </span>
                            <RouterLink to="/pedido" class="text-blue-500 hover:underline"
                                >Meus Pedidos</RouterLink
                            >
                            <a
                                @click="realizarLogout()"
                                href="#"
                                class="text-blue-500 hover:underline"
                                >Sair</a
                            >
                        </div>
                        <button
                            v-else
                            class="text-gray-600 focus:outline-none mx-4 sm:mx-0"
                            @click="modalAuthAberto = !modalAuthAberto"
                        >
                            Login / Cria Conta
                        </button>

                        <button
                            @click="carrinhoAberto = !carrinhoAberto"
                            class="text-gray-600 focus:outline-none mx-4 sm:mx-0 relative"
                        >
                            <div
                                v-if="pedidoItens.length > 0"
                                class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-4 -end-5 dark:border-gray-900"
                            >
                                {{ pedidoItens.length }}
                            </div>
                            <ShoppingCartIcon class="size-5" />
                        </button>
                    </div>
                </div>
                <nav
                    :class="menuAberto ? '' : 'hidden'"
                    class="sm:flex sm:justify-center sm:items-center mt-4"
                ></nav>
            </div>
        </header>
        <VueCarrinho
            v-show="carrinhoAberto"
            @fecharCarrinho="
                () => {
                    authModalMessage = ''
                    carrinhoAberto = false
                }
            "
            @abrirModalAuth="
                (mensagem) => {
                    authModalMessage = mensagem
                    modalAuthAberto = true
                }
            "
        />
        <VueModalAuth
            v-show="modalAuthAberto"
            @fecharModalAuth="modalAuthAberto = false"
            :modalAberto="modalAuthAberto"
            :mensagem="authModalMessage"
        />
        <main class="my-8">
            <slot />
        </main>

        <footer class="bg-gray-200">
            <div class="container mx-auto px-6 py-3 flex justify-between items-center">
                <RouterLink :to="'/'" class="text-xl font-bold text-gray-500 hover:text-gray-400">
                    VendasExpress
                </RouterLink>
                <p class="py-2 text-gray-500 sm:py-0">Todos os direitos reservados</p>
            </div>
        </footer>
    </div>
</template>
