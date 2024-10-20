<script setup lang="ts">
import { useAuth } from '@/composables/auth'

const { pegarNome, realizarLogout, clienteLogado, checkClienteLogado } = useAuth()
</script>
<template>
    <div class="">
        <div class="container mx-auto px-6 py-3 border-b">
            <div class="flex items-center justify-between">
                <div class="hidden w-full text-gray-600 lg:flex lg:items-center"></div>
                <div class="w-full text-gray-700 lg:text-center text-2xl font-semibold">
                    VendasExpress
                </div>
                <div class="flex items-center justify-end w-full space-x-5">
                    <div class="flex flex-col items-end">
                        <span>Bem Vindo, {{ pegarNome() }} </span>
                        <RouterLink to="/" class="text-blue-500 hover:underline"
                            >Voltar para a loja</RouterLink
                        >
                        <a @click="realizarLogout()" href="#" class="text-blue-500 hover:underline"
                            >Sair</a
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <main class="my-8">
                <slot />
            </main>
        </div>
    </div>
</template>
