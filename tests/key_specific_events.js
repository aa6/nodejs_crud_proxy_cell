var crudproxycell = require('../index.js')
describe("Key-specific events",function()
{
    it("must work",function()
    {
        var triggered = []
        var cpc = new crudproxycell({trigger_on_me:"aaa",ignore_me:"bbb"})
        cpc().before_change("trigger_on_me",function(done, event)
        {
            expect(event.key).toBe("trigger_on_me")
            triggered.push(event.key)
            done(false)
        })
        cpc.ignore_me = "BBB"
        cpc.trigger_on_me = "AAA"
        expect(triggered.length).toBe(1)
        expect(cpc.ignore_me).toBe("BBB")
        expect(cpc.trigger_on_me).toBe("aaa")
    })

})