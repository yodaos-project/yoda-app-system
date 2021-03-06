var mm = require('@yodaos/mm')
var mock = require('@yodaos/mm/mock')
var system = require('@yoda/system')
var AudioFocus = require('@yodaos/application').AudioFocus

mock.proxyMethod(require('@yoda/manifest'), 'get', {
  after: (ret, self, args) => {
    if (args[0] === 'capabilities.battery') {
      return false
    }
    return ret
  }
})

var test = mm.test
test = mm.beforeEach(test, t => {
  t.suite = mm.bootstrap()
  t.end()
})
test = mm.afterEach(test, t => {
  t.suite.teardown()
  t.end()
})

test('should speak text', t => {
  t.plan(2)

  t.suite.audioFocus
    .on('gain', focus => {
      t.strictEqual(focus.type, AudioFocus.Type.TRANSIENT)
    })
    .on('loss', focus => {
      t.strictEqual(focus.type, AudioFocus.Type.TRANSIENT)
      t.end()
    })

  t.suite.openUrl('yoda-app://system/shutdown')
})

test('should enter recovery mode', t => {
  t.plan(2)

  mock.mockReturns(system, 'setRecoveryMode', () => {
    t.assert(true)
  })
  mock.mockReturns(system, 'reboot', reason => {
    t.strictEqual(reason, 'recovery')
    t.end()
  })
  t.suite.openUrl('yoda-app://system/recovery')
})

