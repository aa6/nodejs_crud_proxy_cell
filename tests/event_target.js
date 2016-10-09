var crudproxycell = require('../index.js')
describe("Event target",function()
{
    it("should exist",function()
    {
        var cpc = new crudproxycell({a:"aaa",b:"bbb"})
        cpc().after_change(function(event)
        {
            expect(event.target).toBe(cpc)
        })
        cpc.a = "AAA"
        delete cpc.b
    })

})