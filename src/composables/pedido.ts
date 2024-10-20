import { reactive, ref } from 'vue'
import type { Produto } from './produto'
import { http } from '@/services/http.services'
import { useAuth } from './auth'

export interface Pedido {
    id?: string
    cupom: Cupom | null
    identificacao_cupom: string
    itens: PedidoItem[]
    valor_total: number
    data_venda?: string
    status?: string
}

export interface PedidoItem {
    produto: Produto
    produto_id: number
    quantidade: number
    valor_unitario?: number
}

export interface Cupom {
    id: number
    identificacao: string
    data_validade: string
    valor_desconto: number
    aplicado: boolean
}

export enum CupomStatus {
    NaoAplicado = 0,
    Invalido = 1,
    Valido = 2
}

export const pedido = reactive<Pedido>({
    cupom: null,
    identificacao_cupom: '',
    itens: [],
    valor_total: 0
})

export const pedidoItens = reactive<PedidoItem[]>([])

const { pegarToken } = useAuth()

export function usePedido() {
    const enviandoPedido = ref(false)
    const pedidos = reactive<Pedido[]>([])
    const pedidoDetalhes = reactive<Pedido>({
        id: '',
        cupom: null,
        identificacao_cupom: '',
        itens: [],
        valor_total: 0,
        data_venda: '',
        status: ''
    })
    const paginacao = reactive({
        pesquisa: '',
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalRows: 0
    })

    function listarPedidos(numeroPagina: number | null = null) {
        http({ Authorization: pegarToken() })
            .get('/api/pedido', {
                params: {
                    page: numeroPagina || paginacao.currentPage,
                    pesquisa: paginacao.pesquisa,
                    perPage: paginacao.perPage
                }
            })
            .then((data) => {
                const resultado = data.data.data
                pedidos.splice(0)

                resultado.data.map((pedido: any) => {
                    pedidos.push({
                        cupom: pedido.cupom
                            ? {
                                  id: pedido.cupom.id,
                                  identificacao: pedido.cupom.identificacao,
                                  data_validade: pedido.cupom.data_validade,
                                  valor_desconto: parseFloat(pedido.cupom.valor_desconto),
                                  aplicado: pedido.cupom.aplicado
                              }
                            : null,
                        id: pedido.id,
                        identificacao_cupom: pedido.cupom ? pedido.cupom.identificacao : '',
                        valor_total: parseFloat(pedido.valor_total),
                        data_venda: pedido.data_venda,
                        status: pedido.status,
                        itens: []
                    })
                })
                paginacao.currentPage = resultado.current_page
                paginacao.totalRows = resultado.total
                paginacao.totalPages = resultado.last_page
            })
    }

    function buscarPedido(id: string | number, numeroPagina: number | null = null) {
        http({ Authorization: pegarToken() })
            .get('/api/pedido/detalhes/' + id)
            .then((data) => {
                const resultado = data.data.data

                pedidoDetalhes.cupom = resultado.cupom as Cupom
                pedidoDetalhes.identificacao_cupom = ''
                pedidoDetalhes.valor_total = resultado.valor_total
                pedidoDetalhes.itens = resultado.pedido_itens.map((item: any) => ({
                    produto: item.produto as Produto,
                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario
                }))
            })
    }

    function adicionarProduto(produto: Produto) {
        if (produto.quantidade_estoque <= 0) return

        const itemExistente = pedidoItens.find((item) => item.produto_id === produto.id)

        if (itemExistente) {
            itemExistente.quantidade += 1
        } else {
            pedidoItens.push({
                produto: produto,
                produto_id: produto.id as number,
                quantidade: 1
            })
        }
    }

    function removerProduto(produto_id: number) {
        const index = pedidoItens.map((x) => x.produto_id).indexOf(produto_id)
        if (index > -1) {
            pedidoItens.splice(index, 1)
        }
    }

    function enviarPedido(callback = () => {}) {
        if (pedidoItens.length < 1) return

        enviandoPedido.value = true
        pedido.itens = pedidoItens
        http({ Authorization: pegarToken() })
            .post('/api/pedido', pedido)
            .then(() => {
                pedidoItens.splice(0)
                pedido.cupom = null
                pedido.identificacao_cupom = ''
                pedido.itens = []
                pedido.valor_total = 0
                callback()
            })
            .catch((e) => {
                console.log(e)
            })
            .finally(() => (enviandoPedido.value = false))
    }

    return {
        pedido,
        pedidos,
        pedidoItens,
        enviandoPedido,
        pedidoDetalhes,
        enviarPedido,
        adicionarProduto,
        removerProduto,
        listarPedidos,
        buscarPedido
    }
}
