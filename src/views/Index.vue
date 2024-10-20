<script lang="ts" setup>
import VueButton from '@/components/form/VueButton.vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import VuePaginacao from '@/components/tool/VuePaginacao.vue'
import useHeroicons from '@/composables/heroicons'
import { usePedido } from '@/composables/pedido'
import { useProduto, type Produto } from '@/composables/produto'
import { monetario } from '@/config/filter.config'
import { onMounted } from 'vue'

const { ShoppingCartIcon, MagnifyingGlassIcon } = useHeroicons()
const { listarProdutos, produtos, paginacao, mudarPagina, buscar } = useProduto()
const { adicionarProduto } = usePedido()

onMounted(() => {
    listarProdutos()
})
</script>
<template>
    <MainLayout>
        <div>
            <div class="container mx-auto px-6">
                <div class="mb-6">
                    <div class="relative mt-6 max-w-lg mx-auto">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <MagnifyingGlassIcon class="size-5" />
                        </span>

                        <input
                            @input="(e) => buscar(e.target.value)"
                            class="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Pesquisar produto"
                        />
                    </div>
                </div>

                <div
                    class="h-64 rounded-md overflow-hidden bg-cover bg-center"
                    style="
                        background-image: url('https://sancagalpoes.com.br/wp-content/uploads/2017/12/Distribuicao-de-produtos-como-entregar-os-produtos-do-seu-ecommerce.jpg');
                    "
                >
                    <div class="bg-gray-900 bg-opacity-50 flex items-center h-full">
                        <div class="px-10 max-w-xl">
                            <h2 class="text-2xl text-white font-semibold">Promoções Imperdiveis</h2>
                            <p class="mt-2 text-gray-200">
                                Você não pode perder essa oportunidade! Está na hora de garantir os
                                melhores produtos com descontos incríveis!
                            </p>
                        </div>
                    </div>
                </div>
                <div class="md:flex mt-8 md:-mx-4">
                    <div
                        class="w-full h-64 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:w-1/2"
                        style="
                            background-image: url('https://blog.dolado.com.br/wp-content/uploads/2023/06/melhor-site-para-comprar-equipamentos-gamer.jpg');
                        "
                    >
                        <div class="bg-gray-900 bg-opacity-50 flex items-center h-full">
                            <div class="px-10 max-w-xl">
                                <h2 class="text-2xl text-white font-semibold">
                                    Precisando de perifericos para seu escritório?
                                </h2>
                                <p class="mt-2 text-gray-200">
                                    Venha conhecer nossos produtos, tudo o que você precisa em um só
                                    um lugar. Aproveite!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="w-full h-64 mt-8 md:mx-4 rounded-md overflow-hidden bg-cover bg-center md:mt-0 md:w-1/2"
                        style="
                            background-image: url('https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80');
                        "
                    >
                        <div class="bg-gray-900 bg-opacity-50 flex items-center h-full">
                            <div class="px-10 max-w-xl">
                                <h2 class="text-2xl text-white font-semibold">Games</h2>
                                <p class="mt-2 text-gray-200">
                                    Venha conhecer os novos lançamentos de
                                    {{ new Date().getFullYear() }}. Temos games desde os consoles
                                    retro até os de ultima geração.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-16">
                    <h3 class="text-gray-600 text-2xl font-medium">Produtos da Loja</h3>
                    <div
                        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
                    >
                        <div
                            v-for="item in produtos"
                            :key="item.id"
                            class="w-full max-w-sm mx-auto rounded-md border-gray-200 border overflow-hidden"
                        >
                            <div
                                class="flex items-end justify-end h-64 w-full bg-cover"
                                :style="{ backgroundImage: `url(${item.imagem})` }"
                            ></div>
                            <div class="px-5 py-3 flex flex-col">
                                <h3 class="text-gray-500 text-sm capitalize mb-6">
                                    {{ item.nome }}
                                </h3>
                                <span class="text-gray-900 font-medium mb-4">{{
                                    monetario(item.valor_venda)
                                }}</span>
                                <VueButton
                                    :disabled="item.quantidade_estoque <= 0"
                                    class="!rounded-full"
                                    @click="adicionarProduto(item)"
                                >
                                    <span v-if="item.quantidade_estoque > 0"
                                        >Adicionar ao carrinho</span
                                    >
                                    <span v-else>Esgotado</span>
                                </VueButton>
                            </div>
                        </div>
                    </div>

                    <div class="w-full flex justify-center pt-3">
                        <VuePaginacao
                            :total-page="paginacao.totalPages"
                            :total-rows="paginacao.totalRows"
                            :per-page="paginacao.perPage"
                            :current-page="paginacao.currentPage"
                            @page-change="mudarPagina"
                        />
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>
