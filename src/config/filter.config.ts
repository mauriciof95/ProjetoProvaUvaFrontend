export function monetario(value: number | null, mostrarZeroSeNull = false) {
    if (!value && mostrarZeroSeNull) return 'R$ 0,00'
    if (!value && !mostrarZeroSeNull) return ''

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    return formatter.format(value!)
}

export function dateTimeBR(date) {
    const d = new Date(date)

    const day = ('0' + d.getDate()).slice(-2)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const year = d.getFullYear()

    const hours = ('0' + d.getHours()).slice(-2)
    const minutes = ('0' + d.getMinutes()).slice(-2)
    const seconds = ('0' + d.getSeconds()).slice(-2)

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
