import { http } from '@/services/http.services'
import { computed, reactive, ref } from 'vue'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { validationMessages } from '@/config/validations.config'
import useVuelidate from '@vuelidate/core'
import { useRouter } from 'vue-router'

export interface Login {
    email: string
    password: string
}

export interface Token {
    token: string
    user_nome: string
    user_email: string
}

const apiValidacoes = reactive({
    email: { valido: true, mensagem: '' }
})

const regrasLogin = computed(() => {
    return {
        email: {
            required: helpers.withMessage(() => validationMessages.required(), required),
            minLength: helpers.withMessage(
                (...params) => validationMessages.minlength(params[0].$params.min),
                minLength(3)
            ),
            email: helpers.withMessage(() => validationMessages.email(), email),
            apiErrors: helpers.withMessage(
                () => apiValidacoes.email.mensagem,
                () => apiValidacoes.email.valido
            )
        },
        password: {
            required: helpers.withMessage(() => validationMessages.required(), required)
        }
    }
})

const router = useRouter()

export const clienteLogado = ref<Boolean>(false)

export function useAuth() {
    const loginForm = reactive<Login>({
        email: '',
        password: ''
    })
    const v$ = useVuelidate(regrasLogin, loginForm)

    async function realizarLogin(callback = () => {}) {
        const result = await v$.value.$validate()

        if (!result && v$.value.$errors.some((e) => e.$validator != 'apiErrors')) return

        http()
            .post('/api/cliente/login', loginForm)
            .then((e) => {
                const token = e.data.data as Token
                salvarTokenLocalStorage(token)
                checkClienteLogado()
                loginForm.email = ''
                loginForm.password = ''

                v$.value.$reset()
                callback()
            })
            .catch((e) => {
                if (e.status == 422) {
                    const data = e.response.data
                    apiValidacoes.email = {
                        valido: false,
                        mensagem: data.message
                    }
                }
            })
    }

    async function realizarLogout() {
        http({ Authorization: pegarToken() })
            .post('/api/cliente/logout')
            .then((e) => {
                checkClienteLogado()
            })
            .catch(() => {})
            .finally(() => {
                deletarTokenLocalStorage()
                router.push({ name: 'home' })
            })
    }

    function salvarTokenLocalStorage(token: Token) {
        token.token = 'Bearer ' + token.token
        localStorage.setItem('autenticacao', JSON.stringify(token))
    }

    function deletarTokenLocalStorage() {
        localStorage.removeItem('autenticacao')
    }

    function pegarToken() {
        const token = localStorage.getItem('autenticacao')
        if (token != null) return (JSON.parse(token) as Token).token
        return null
    }

    function pegarNome() {
        const token = localStorage.getItem('autenticacao')
        if (token != null) return (JSON.parse(token) as Token).user_nome
        return null
    }

    function pegarEmail() {
        const token = localStorage.getItem('autenticacao')
        if (token != null) return (JSON.parse(token) as Token).user_email
        return null
    }

    function checkClienteLogado() {
        clienteLogado.value = pegarToken() != null
    }

    return {
        v$,
        loginForm,
        realizarLogin,
        realizarLogout,
        pegarToken,
        pegarNome,
        pegarEmail,
        checkClienteLogado,
        salvarTokenLocalStorage,
        clienteLogado
    }
}
