var crudproxycell = require('../index.js')
describe("TypeError: 'ownKeys' on proxy: trap result did not include 'arguments'",function()
{
    it("must never happen",function()
    {
        var cpc = new crudproxycell({a:"aaa",b:"bbb",c:"ccc"})
        for(var key in cpc)
        {
            // No actions required.
        }
    })

})