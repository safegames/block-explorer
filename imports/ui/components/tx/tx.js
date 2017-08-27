import './tx.html'
import '../../stylesheets/overrides.css'

Template.tx.onCreated(() => {
  Session.set('txhash', {})
  Session.set('qrl', 0)
  const txId = FlowRouter.getParam('txId')
  Meteor.call('txhash', txId, (err, res) => {
    if (err) {
      Session.set('txhash', { error: err, id: txId })
    } else {
      Session.set('txhash', res)
    }
  })
  Meteor.call('qrl-value', (err, res) => {
    if (err) {
      Session.set('qrl', 'Error getting value from API')
    } else {
      Session.set('qrl', res)
    }
  })
})

Template.tx.helpers({
  txhash() {
    return Session.get('txhash')
  },
  qrl() {
    const txhash = Session.get('txhash')
    try {
      const value = txhash.amount
      const x = Session.get('qrl')
      return Math.round((x * value) * 100) / 100
    } catch (e) {
      return 0
    }
  },
  ts() {
    const x = moment.unix(this.timestamp)
    return moment(x).format('HH:mm D MMM YYYY')
  },
})

Template.tx.events({
  'click .close': () => {
    $('.message').hide()
  },
})

Template.tx.onRendered(() => {
  this.$('.value').popup()
})
