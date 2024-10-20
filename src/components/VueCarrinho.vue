<script setup lang="ts">
import useHeroicons from '@/composables/heroicons'
import { CupomStatus, usePedido, type Cupom } from '@/composables/pedido'
import { monetario } from '@/config/filter.config'
import VueInput from './form/VueInput.vue'
import VueButton from './form/VueButton.vue'
import { http } from '@/services/http.services'
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/auth'
import { useRouter } from 'vue-router'

const emit = defineEmits(['abrirModalAuth', 'finalizarPedido', 'fecharCarrinho'])
const { XMarkIcon, PlusCircleIcon, MinusCircleIcon, TrashIcon } = useHeroicons()
const { pedidoItens, pedido, enviandoPedido, removerProduto, enviarPedido } = usePedido()
const { clienteLogado } = useAuth()
const router = useRouter()

function calcularSubTotal() {
    return pedidoItens.reduce((total, item) => {
        return total + item.produto.valor_venda * item.quantidade
    }, 0)
}

function calcularTotal() {
    const total = pedidoItens.reduce((total, item) => {
        return total + item.produto.valor_venda * item.quantidade
    }, 0)

    if (pedido.cupom != null) {
        return total - (pedido.cupom.valor_desconto / 100) * total
    }

    return total
}

const identificacaoCupom = ref('')
const cupomStatus = reactive({
    status: CupomStatus.NaoAplicado
})

function buscarCupom() {
    if (identificacaoCupom.value == '') return

    pedido.cupom = null
    pedido.identificacao_cupom = ''
    cupomStatus.status = CupomStatus.NaoAplicado

    http()
        .get('/api/cupom/' + identificacaoCupom.value)
        .then((data) => {
            const cupom = data.data.data as Cupom

            if (cupom != null) {
                pedido.cupom = cupom
                pedido.identificacao_cupom = cupom.identificacao
                cupomStatus.status = CupomStatus.Valido
            } else {
                cupomStatus.status = CupomStatus.Invalido
            }
        })
}

function pedidoRealizadoComSucesso() {
    router.push('/pedido-enviado')
}

function finalizarPedido() {
    if (pedidoItens.length < 1) return

    if (clienteLogado.value) {
        if (enviandoPedido.value) return
        enviarPedido(pedidoRealizadoComSucesso)
        return
    }

    emit('abrirModalAuth', 'Antes de finalizar o pedido, faça o login ou cadastre-se.')
}
</script>

<template>
    <div
        class="fixed right-0 top-0 max-w-xs w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300 z-50"
    >
        <div class="flex items-center justify-between">
            <h3 class="text-2xl font-medium text-gray-700">Carrinho ({{ pedidoItens.length }})</h3>
            <button @click="$emit('fecharCarrinho')" class="text-gray-600 focus:outline-none">
                <XMarkIcon class="size-5" />
            </button>
        </div>
        <hr class="my-3" />

        <div v-for="item in pedidoItens" :key="item.produto_id" class="flex justify-between mt-6">
            <div class="flex">
                <img class="h-20 w-20 object-cover rounded" :src="item.produto.imagem" />
                <div class="mx-3">
                    <h3 class="text-sm text-gray-600">{{ item.produto.nome }}</h3>
                    <div class="flex items-center mt-2">
                        <button
                            :disabled="enviandoPedido"
                            @click="item.quantidade++"
                            class="text-gray-500 focus:outline-none focus:text-gray-600"
                        >
                            <PlusCircleIcon class="size-5" />
                        </button>
                        <span class="text-gray-700 mx-2">{{ item.quantidade }}</span>
                        <button
                            :disabled="enviandoPedido"
                            @click="item.quantidade > 1 ? item.quantidade-- : null"
                            class="text-gray-500 focus:outline-none focus:text-gray-600"
                        >
                            <MinusCircleIcon class="size-5" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col">
                <span class="self-end mb-2">
                    <button
                        :disabled="enviandoPedido"
                        class="text-red-500 cursor-pointer"
                        @click="removerProduto(item.produto_id)"
                    >
                        <TrashIcon class="size-4" />
                    </button>
                </span>
                <span class="text-gray-600 font-medium self-end">{{
                    monetario(item.produto.valor_venda)
                }}</span>
                <span v-if="item.quantidade > 1" class="text-gray-400 self-end">
                    {{ monetario(item.produto.valor_venda * item.quantidade) }}
                </span>
            </div>
        </div>

        <div class="mt-8 mb-3 bg-gray-100 py-5 px-1">
            <form class="flex items-center justify-between">
                <VueInput
                    placeholder="Adicionar cupom"
                    v-model="identificacaoCupom"
                    :class="{
                        'border-red-500 focus:outline-red-500':
                            cupomStatus.status == CupomStatus.Invalido,
                        'border-green-500 focus:outline-green-500':
                            cupomStatus.status == CupomStatus.Valido
                    }"
                />
                <VueButton :disabled="enviandoPedido" @click="buscarCupom()"> Aplicar </VueButton>
            </form>
            <span
                v-if="cupomStatus.status == CupomStatus.Invalido"
                class="px-1 text-xs text-red-500"
            >
                Cupom Inválido
            </span>
            <span
                v-if="cupomStatus.status == CupomStatus.Valido"
                class="px-1 text-xs text-green-500"
            >
                Cupom Aplicado
            </span>
        </div>

        <div class="border-b border-gray-200 mb-5 flex justify-between">
            <span class="text-sm font-light">Subtotal</span>
            <span class="text-sm font-medium">{{ monetario(calcularSubTotal(), true) }}</span>
        </div>

        <div class="border-b border-gray-200 mb-3 flex justify-between">
            <span class="text-sm">Total</span>
            <span class="text-sm font-medium">{{ monetario(calcularTotal(), true) }}</span>
        </div>

        <VueButton :disabled="enviandoPedido" @click="finalizarPedido()" class="w-full">
            {{ enviandoPedido ? 'Enviando Seu Pedido...' : 'Finalizar Pedido' }}
        </VueButton>
    </div>
</template>
