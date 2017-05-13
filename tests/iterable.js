var crudproxycell = require('../index.js')
describe("TypeError: cell.$ is not iterable",function()
{
    it("is a lie",function()
    {
        var cell = new crudproxycell()
        cell.$test = "TEST"
        cell.push("FIRST")
        cell.$2 = "SECOND"
        results = []
        for(item of cell.$)
        {
            results.push(item)
        }
        expect(results).toEqual(["TEST","FIRST","SECOND"])
    })
})