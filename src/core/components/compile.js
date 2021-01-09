export default class Compile {
  constructor (el, vm) {
    this.$vm = vm
    this.$el = isNodeElement(el) ? el : document.querySelector(el)
    this.$el.innerHTML = this.$vm.$options.template()

    this.compile(this.$el)
  }

  compile (elements) {
    Array.prototype.forEach.call(elements.childNodes, (node) => {
      const regex = /\{\{(.*)\}\}/

      if (isNodeElement(node)) {
        this.compileElement(node)
      }
      if (isTextElement(node) && regex.test(node.textContent)) {
        const key = RegExp.$1.trim()
        updateText(node, this.getVal(key))
        this.bind(node, this.$vm, key, updateText(node, this.getVal(key)))
      }
      if (node.childNodes && node.childNodes.length > 0) this.compile(node)
    })
  }

  compileElement (node) {
    const attrs = node.attributes

    Array.prototype.forEach.call(attrs, (attr) => {
      const key = attr.value

      if (attrsEvent(attr)) {
        // Event handler
      }

      if (attr.name === 'model') {
        node.value = this.getVal(key)
        this.bind(node, this.$vm, key)
        node.addEventListener('input', (e) => {
          if (e.currentTarget.value === this.getVal(key)) return
          this.setVal(key, e.currentTarget.value)
        })
      }
    })
  }

  bind (node, vm, key) {
  }

  getVal (key) {
    return this.$vm[key]
  }

  setVal (key, val) {
    this.$vm[key] = val
  }
}


function updateText (node, value) {
  node.textContent = value
}

function isNodeElement (node) {
  return node.nodeType === 1
}

function isTextElement (node) {
  return node.nodeType === 3
}

function isCommentElement (node) {
  return node.nodeType === 8
}

function attrsEvent (attr) {
  const eventAttrs = ['click', 'change']
  return eventAttrs.indexOf(attr) !== -1
}