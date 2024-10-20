<script lang="ts" setup>
import useHeroicons from '@/composables/heroicons'
import { computed, reactive, ref, watch } from 'vue'
import VueInput from './form/VueInput.vue'
import VueButton from './form/VueButton.vue'
import { useAuth } from '@/composables/auth'
import { useCliente } from '@/composables/cliente'
const { XMarkIcon } = useHeroicons()
const { v$, loginForm, realizarLogin, clienteLogado } = useAuth()
const { v$: cliente_validation, cadastroForm, realizarCadastro } = useCliente()

const props = defineProps({
    modalAberto: { type: Boolean, required: true },
    mensagem: { type: String, required: false, default: '' }
})

const emit = defineEmits(['fecharModalAuth'])

const formTipoAuth = ref(true)

function trocarForm() {
    formTipoAuth.value = !formTipoAuth.value
}

function fecharModalAuth() {
    emit('fecharModalAuth')
}

function login() {
    realizarLogin(fecharModalAuth)
}

function cadastrar() {
    realizarCadastro(fecharModalAuth)
}

watch(
    () => props.modalAberto,
    (e: Boolean) => {
        if (e) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
)
</script>

<template>
    <div
        id="authentication-modal"
        tabindex="-1"
        aria-hidden="true"
        class="backdrop-blur-sm flex justify-center items-center overflow-y-auto overflow-x-hidden bg-slate-800 bg-opacity-35 z-50 absolute left-0 top-0 bottom-0 right-0"
    >
        <div
            class="relative p-4 w-full max-h-min"
            :class="{ 'max-w-md': formTipoAuth, 'max-w-lg': !!formTipoAuth }"
        >
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
                >
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ formTipoAuth ? 'Faça login em nosso site' : 'Criar Conta' }}
                    </h3>
                    <button
                        @click="fecharModalAuth()"
                        type="button"
                        class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <XMarkIcon class="size-5" />
                    </button>
                </div>
                <!-- Modal body -->

                <div
                    v-if="props.mensagem"
                    class="p-4 mb-4 text-sm text-center text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                    role="alert"
                >
                    {{ props.mensagem }}
                </div>

                <div v-if="formTipoAuth" class="p-4 md:p-5">
                    <form class="space-y-4" action="#">
                        <div>
                            <VueInput
                                v-model="loginForm.email"
                                label="Seu Email"
                                placeholder="meu_email@email.com"
                                name="email"
                                :vuelidate="v$"
                            />
                        </div>
                        <div>
                            <VueInput
                                v-model="loginForm.password"
                                label="Sua Senha"
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                :vuelidate="v$"
                            />
                        </div>

                        <VueButton @click="login()"> Login </VueButton>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Não tem uma conta?
                            <a
                                @click="trocarForm()"
                                href="#"
                                class="text-blue-700 hover:underline dark:text-blue-500"
                                >Criar Conta</a
                            >
                        </div>
                    </form>
                </div>

                <div v-else class="p-4 md:p-5">
                    <form class="space-y-4">
                        <div class="grid gap-4 mb-4 grid-cols-2">
                            <div class="col-span-2">
                                <VueInput
                                    v-model="cadastroForm.nome"
                                    label="Seu Nome"
                                    placeholder="Insira seu nome"
                                    name="nome"
                                    :vuelidate="cliente_validation"
                                />
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <VueInput
                                    v-model="cadastroForm.password"
                                    label="Sua Senha"
                                    type="password"
                                    placeholder="••••••••"
                                    name="password"
                                    :vuelidate="cliente_validation"
                                />
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <VueInput
                                    v-model="cadastroForm.password_confirmation"
                                    label="Repita a Senha"
                                    type="password"
                                    placeholder="••••••••"
                                    name="password_confirmation"
                                    :vuelidate="cliente_validation"
                                />
                            </div>
                            <div class="col-span-2">
                                <VueInput
                                    v-model="cadastroForm.email"
                                    label="Seu Email"
                                    type="email"
                                    placeholder="meu_email@email.com"
                                    name="email"
                                    :vuelidate="cliente_validation"
                                />
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <VueInput
                                    v-model="cadastroForm.c_cpf"
                                    label="Seu CPF"
                                    placeholder="000.000.000-00"
                                    name="c_cpf"
                                    :vuelidate="cliente_validation"
                                    mask="###.###.###-##"
                                />
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <VueInput
                                    v-model="cadastroForm.telefone"
                                    label="Seu Telefone"
                                    placeholder="(99) 9 0000-0000"
                                    name="telefone"
                                    :vuelidate="cliente_validation"
                                    mask="(##) #####-####"
                                />
                            </div>
                        </div>
                        <VueButton @click="cadastrar()"> Criar minha conta </VueButton>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Já tem uma conta?
                            <a
                                @click="trocarForm()"
                                href="#"
                                class="text-blue-700 hover:underline dark:text-blue-500"
                                >Fazer Login</a
                            >
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
