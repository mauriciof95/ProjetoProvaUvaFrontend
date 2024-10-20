<script setup lang="ts">
import PainelCliente from '@/components/layouts/PainelCliente.vue'
import { usePedido } from '@/composables/pedido'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { monetario } from '@/config/filter.config'

const route = useRoute()
const { buscarPedido, pedidoDetalhes } = usePedido()

onMounted(() => {
    const id = route.params.id

    buscarPedido(id)
})
</script>

<template>
    <PainelCliente>
        <div>
            <header>
                <p class="mb-4">
                    <RouterLink to="/pedido" class="underline text-blue-500"
                        >Listar todos os pedidos</RouterLink
                    >
                </p>

                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Detalhes do Pedido
                </h2>
            </header>

            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6">
                <header>
                    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Produtos</h2>
                </header>

                <table class="table mt-6">
                    <thead class="thead">
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                        <tr v-for="item in pedidoDetalhes.itens" :key="item.id">
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                        <div class="rounded-full bg-gray-200 max-w-14">
                                            <img :src="item.produto.imagem" class="aspect-auto" />
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">{{ item.produto.nome }}</div>
                                        <div class="text-sm opacity-50">
                                            {{ item.produto.categoria.nome }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ item.quantidade }}</td>
                            <td>{{ monetario(item.valor_unitario) }}</td>
                            <td>{{ monetario(item.valor_unitario * item.quantidade) }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="tfoot">
                        <tr v-if="pedidoDetalhes.cupom">
                            <th colspan="3">Cupom ( {{ pedidoDetalhes.cupom.identificacao }} )</th>
                            <th>{{ pedidoDetalhes.cupom.valor_desconto }}%</th>
                        </tr>

                        <tr>
                            <th colspan="3">Subtotal</th>
                            <th>
                                {{
                                    monetario(
                                        pedidoDetalhes.itens.reduce((total, item) => {
                                            return (
                                                total +
                                                item.quantidade * parseFloat(item.valor_unitario)
                                            )
                                        }, 0)
                                    )
                                }}
                            </th>
                        </tr>
                        <tr>
                            <th colspan="3">Total</th>
                            <th>{{ monetario(pedidoDetalhes.valor_total) }}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </PainelCliente>
</template>
