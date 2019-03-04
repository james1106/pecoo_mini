Component({
  properties: {
    extravagancesList: Array,
    marginValue: {
      type: String,
      value: '0 0 0 0'
    },
    url: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
      }
    }
  },
  methods: {
    clickHandle (e) {
      this.triggerEvent('clickEvent', e)
    }
  }
})