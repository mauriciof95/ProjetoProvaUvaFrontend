import { cpf, telefone, validationMessages } from '@/config/validations.config'
import { http } from '@/services/http.services'
import useVuelidate from '@vuelidate/core'
import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators'
import { computed, reactive } from 'vue'
import { useAuth, type Token } from './auth'

export interface Cliente {
    nome: string
    email: string
    c_cpf: string
    telefone: string
    password: string
    password_confirmation: string
}

const apiValidacoes = reactive({
    email: { valido: true, mensagem: '' },
    cpf: { valido: true, mensagem: '' }
})

const regrasCadastro = computed(() => {
    return {
        nome: {
            required: helpers.withMessage(() => validationMessages.required(), required),
            minLength: helpers.withMessage(
                (...params) => validationMessages.minlength(params[0].$params.min),
                minLength(3)
            )
        },
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
            required: helpers.withMessage(() => validationMessages.required(), required),
            minLength: helpers.withMessage(
                (...params) => validationMessages.minlength(params[0].$params.min),
                minLength(8)
            )
        },
        password_confirmation: {
            required: helpers.withMessage(() => validationMessages.required(), required),
            sameAs: helpers.withMessage(
                validationMessages.confirmacaoSenha(),
                sameAs(cadastroForm.password)
            )
        },
        c_cpf: {
            cpf: helpers.withMessage(() => validationMessages.cpf(), cpf),
            minLength: helpers.withMessage(
                (...params) => validationMessages.minlength(params[0].$params.min),
                minLength(14)
            ),
            apiErrors: helpers.withMessage(
                () => apiValidacoes.cpf.mensagem,
                () => apiValidacoes.cpf.valido
            )
        },
        telefone: {
            telefone: helpers.withMessage(() => validationMessages.telefone(), telefone)
        }
    }
})

const cadastroForm = reactive<Cliente>({
    nome: '',
    email: '',
    c_cpf: '',
    telefone: '',
    password: '',
    password_confirmation: ''
})

const { salvarTokenLocalStorage, checkClienteLogado } = useAuth()

export function useCliente() {
    const v$ = useVuelidate(regrasCadastro, cadastroForm)

    async function realizarCadastro(callback = () => {}) {
        const result = await v$.value.$validate()
        if (!result && v$.value.$errors.some((e) => e.$validator != 'apiErrors')) return

        http()
            .post('/api/cliente/cadastrar', cadastroForm)
            .then((e) => {
                const token = e.data.data as Token
                salvarTokenLocalStorage(token)
                checkClienteLogado()

                cadastroForm.nome = ''
                cadastroForm.email = ''
                cadastroForm.c_cpf = ''
                cadastroForm.telefone = ''
                cadastroForm.password = ''
                cadastroForm.password_confirmation = ''

                v$.value.$reset()

                callback()
            })
            .catch((e) => {
                if (e.status == 422) {
                    const errors = e.response.data.errors

                    if (errors['email']) {
                        apiValidacoes.email = {
                            valido: false,
                            mensagem: errors['email'][0]
                        }
                    }

                    if (errors['c_cpf']) {
                        apiValidacoes.cpf = {
                            valido: false,
                            mensagem: errors['c_cpf'][0]
                        }
                    }
                }
            })
    }

    return {
        cadastroForm,
        v$,
        realizarCadastro
    }
}
