import { h, render } from 'vue'

export function createComponent(component, props, parentContainer) {
    const vNode = h(component, props)
    const container = document.createElement('div')
    parentContainer.appendChild(container)
    render(vNode, container)

    return vNode.component
}
