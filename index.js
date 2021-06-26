function createApp(rootCompoent) {
    return {
        mount(selector) {
            const container = document.querySelector(selector)
            let isMounted = false
            let oldVNode = null

            watchEffet(function() {
                if (!isMounted) {
                    oldVNode = rootCompoent.render()
                    mount(oldVNode, container)
                    isMounted = true
                } else {
                    const newVNode = rootCompoent.render()
                    patch(oldVNode, newVNode)
                    oldVNode = newVNode
                }
            })
        }
    }
}