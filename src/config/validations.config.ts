export const validationMessages = {
    required: () => 'Esse campo é obrigatorio',
    minlength: (par: number) => `Esse campo precisa ter no minimo ${par} caracteres.`,
    min: (par: number) => `O valor minimo é ${par}`,
    max: (par: number) => `O valor maximo é ${par}`,
    maxlength: (par: number) => `Esse campo precisa ter no maximo ${par} caracteres.`,
    email: () => 'Formato invalido de email.',
    atLeastOne: () => 'Preencha pelo menos um dos campos.',
    minDate: (par: string) => `A data minima é ${par}`,
    maxDate: (par: string) => `A data maxima é ${par}`,
    cpf: () => `CPF Inválido.`,
    telefone: () => `Telefone Inválido.`,
    confirmacaoSenha: () => `As senhas estão diferentes.`
}

export const telefone = (telefone) => {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/
    return regex.test(telefone)
}

export const cpf = (cpf: String | Number) => {
    let Soma = 0
    let Resto

    const strCPF = String(cpf).replace(/[^\d]/g, '')

    if (strCPF.length !== 11) return false

    if (
        [
            '00000000000',
            '11111111111',
            '22222222222',
            '33333333333',
            '44444444444',
            '55555555555',
            '66666666666',
            '77777777777',
            '88888888888',
            '99999999999'
        ].indexOf(strCPF) !== -1
    )
        return false

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)

    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0

    if (Resto != parseInt(strCPF.substring(9, 10))) return false

    Soma = 0

    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)

    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0

    if (Resto != parseInt(strCPF.substring(10, 11))) return false

    return true
}
