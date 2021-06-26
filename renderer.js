//h函数  创建vnode对象
const h = (tag, props, children) => {
    //vnode => javascript对象
    return {
        tag,
        props,
        children
    }
}


// vnode 对象挂载到 el
const mount = (vnode, container) => {
    //vnode => element
    //1.创建出真实元素
    const el = vnode.el = document.createElement(vnode.tag)

    //2.处理props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else { el.setAttribute(key, value) }
        }
    }

    //3.处理children
    if (vnode.children) {
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else {
            vnode.children.forEach(element => {
                mount(element, el)
            });
        }
    }

    //4 将el挂载到container
    container.appendChild(el)
}


const patch = (n1, n2) => {
    if (n1.tag !== n2.tag) {
        const n1ElParent = n1.el.parentElement
        n1ElParent.removeChild(n1.el)
        mount(n2, n1ElParent)
    } else {
        //1.取出element对象，并在n2中保存
        const el = n2.el = n1.el

        //2.处理props
        const oldProps = n1.props || []
        const newProps = n2.props || []
            //2.1 获取所有newProps 添加到el
        for (const key in newProps) {
            const oldValue = oldProps[key]
            const newValue = newProps[key]
            if (newValue !== oldValue) {
                if (key.startsWith('on')) {
                    el.addEventListener(key.slice(2).toLowerCase(), newValue)
                } else { el.setAttribute(key, newValue) }
            }
        }
        //2.2 删除旧的props
        for (const key in oldProps) {
            if (!key in newProps) {
                if (key.startsWith('on')) {
                    const value = oldProps[key]
                    el.removeEventListener(key.slice(2).toLowerCase(), value)
                } else { el.removeAttribute(key) }
            }
        }

        //3.处理children
        const oldChilren = n1.children || []
        const newChilren = n2.children || []
        if (typeof newChilren === "string") {
            //边界判断 edge case
            if (typeof oldChilren === "string") { //情况一：newChildren是一个字符串
                if (newChilren !== oldChilren) {
                    el.textContent = newChilren
                }
            } else {
                el.innerHTML = newChilren
            }
        } else { //情况二:newChildren是一个数组
            if (typeof oldChilren === "string") {
                el.innerHTML = ""
                newChilren.forEach(item => {
                    mount(item, el)
                })
            } else {
                //[v1,v2,v3]
                //[v1,v5,v6,v7,v2]
                const commonLength = Math.min(oldChilren.length, newChilren.length)
                for (let i = 0; i < commonLength; i++) {
                    patch(oldChilren[i], newChilren[i])
                }

                if (newChilren.length > commonLength) {
                    newChilren.slice(commonLength).forEach(item => {
                        mount(item, el)
                    })
                }

                if (oldChilren.length > commonLength) {
                    oldChilren.slice(commonLength).forEach(item => {
                        el.removeChild(item.el)
                    })
                }
            }
        }
    }
}