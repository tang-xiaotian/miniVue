class Dep {
    constructor() {
        this.subscribers = new Set()
    }
    depend() {
        if (activeEffet) {
            this.subscribers.add(activeEffet)
        }
    }
    notify() {
        this.subscribers.forEach(effet => {
            effet()
        })
    }
}





let activeEffet = null

function watchEffet(effet) {
    activeEffet = effet
    effet()
    activeEffet = null
}




const targetMap = new WeakMap()

function getDep(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }
    return dep
}

//vue2 对raw 进行数据劫持
// function reactive(raw) {
//     Object.keys(raw).forEach(key => {
//         const dep = getDep(raw, key)
//         let value = raw[key]
//         Object.defineProperty(raw, key, {
//             get() {
//                 dep.depend()
//                 return value
//             },
//             set(newValue) {
//                 if (value !== newValue) {
//                     value = newValue
//                     dep.notify()
//                 }
//             }
//         })
//     })
//     return raw
// }

//vue3 对raw 进行数据劫持
function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const dep = getDep(target, key)
            dep.depend()
            return target[key]
        },
        set(target, key, newValue) {
            const dep = getDep(target, key)
            if (target[key] !== newValue) {
                target[key] = newValue
                dep.notify()
            }
        }
    })
}

//测试代码

// const info = reactive({ counter: 100, name: "txt" })
// const foo = reactive({ height: 180 })

// const dep = new Dep()


// watchEffet(function() {
//     console.log("11111111", info.counter * 2, info.name)
// })

// watchEffet(function() {
//     console.log("222222", info.counter * info.counter)
// })

// watchEffet(function() {
//     console.log("3333", info.counter + 10)
// })


// info.counter++
//     info.name = "hc"