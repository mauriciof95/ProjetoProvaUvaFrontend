<script setup lang="ts">
import VueButton from '@/components/form/VueButton.vue'
import PainelCliente from '@/components/layouts/PainelCliente.vue'
import { usePedido } from '@/composables/pedido'
import { monetario, dateTimeBR } from '@/config/filter.config'
import { onMounted } from 'vue'

const { pedidos, listarPedidos } = usePedido()

onMounted(() => {
    listarPedidos()
})
</script>

<template>
    <PainelCliente>
        <div class="px-3">
            <header class="flex justify-between">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Meus Pedidos</h2>
            </header>

            <div class="bg-white mt-6">
                <div class="relative overflow-x-auto">
                    <table class="table">
                        <thead class="thead">
                            <tr>
                                <th>#</th>
                                <th>Data da Compra</th>
                                <th>Valor do Pedido</th>
                                <th>Valor do Desconto</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="tbody">
                            <tr v-for="item in pedidos" :key="item.id">
                                <th>
                                    {{ item.id }}
                                </th>
                                <th>
                                    {{ dateTimeBR(item.data_venda) }}
                                </th>
                                <th>
                                    {{ monetario(item.valor_total) }}
                                </th>
                                <th>
                                    {{ item.cupom ? item.cupom.valor_desconto + '%' : '' }}
                                </th>
                                <th>
                                    <span
                                        class="badge capitalize"
                                        :class="{
                                            'bg-indigo-100 text-indigo-800':
                                                item.status == 'recebido',
                                            'bg-blue-100 text-blue-800': item.status == 'enviado',
                                            'bg-green-100 text-green-800':
                                                item.status == 'finalizado',
                                            'bg-red-100 text-red-800': item.status == 'cancelado'
                                        }"
                                        >{{ item.status }}</span
                                    >
                                </th>
                                <td>
                                    <div class="inline-flex space-x-2">
                                        <RouterLink :to="'/pedido/detalhes/' + item.id">
                                            <VueButton>Detalhes do Pedido</VueButton>
                                        </RouterLink>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="pedidos.length == 0">
                                <td colspan="5" class="px-6 py-4 text-center italic font-light">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="my-2 p-2"></div>
            </div>
        </div>
    </PainelCliente>
</template>
