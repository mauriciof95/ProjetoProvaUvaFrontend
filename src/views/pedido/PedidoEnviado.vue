<script setup lang="ts">
import VueButton from '@/components/form/VueButton.vue'
</script>

<template>
    <div class="flex h-full flex-col items-center">
        <!-- Cartão de sucesso -->
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <div class="flex justify-center mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-20 w-20 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h1 class="text-2xl font-semibold text-gray-800">Compra realizada com sucesso!</h1>
            <p class="mt-4 text-gray-600">
                Seu pedido foi processado e está sendo preparado para envio.
            </p>

            <div class="mt-8">
                <RouterLink to="/">
                    <VueButton> Voltar para a pagina principal </VueButton>
                </RouterLink>
            </div>
        </div>

        <!-- Rodapé -->
        <footer class="mt-12 text-gray-500">
            <p>Obrigado por comprar com a nossa loja!</p>
        </footer>
    </div>
</template>
