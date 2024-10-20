import { reactive, ref } from 'vue'
import { http, apiUrl } from '@/services/http.services'

export interface Categoria {
    id: number
    nome: string
}

export interface Produto {
    id: number | string
    nome: string
    valor_venda: number
    descricao?: string
    categoria_id: number
    categoria?: Categoria
    quantidade_estoque: number
    imagem: string
}

export function useProduto() {
    const produtos = reactive<Produto[]>([])
    const timeout = ref(null)
    const paginacao = reactive({
        pesquisa: '',
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalRows: 0
    })

    function listarProdutos(numeroPagina: number | null = null) {
        http()
            .get('/api/produto', {
                params: {
                    page: numeroPagina || paginacao.currentPage,
                    pesquisa: paginacao.pesquisa,
                    perPage: paginacao.perPage
                }
            })
            .then((data) => {
                const resultado = data.data.data
                produtos.splice(0)
                resultado.data.map((c: Produto) => {
                    produtos.push(c)
                })
                paginacao.currentPage = resultado.current_page
                paginacao.totalRows = resultado.total
                paginacao.totalPages = resultado.last_page
            })
    }

    function buscar(pesquisa: string) {
        clearTimeout(timeout.value)
        timeout.value = setTimeout(() => {
            paginacao.pesquisa = pesquisa
            listarProdutos(1)
        }, 1000)
    }

    function mudarPagina(numeroPagina: number) {
        listarProdutos(numeroPagina)
    }

    return {
        produtos,
        paginacao,
        listarProdutos,
        mudarPagina,
        buscar
    }
}
