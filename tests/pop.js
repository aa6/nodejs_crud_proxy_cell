var crudproxycell = require('../index.js')
describe("Pop() function",function()
{
    it("works",function()
    {
        var cell = new crudproxycell()
        cell.$test = "TEST"
        cell.push("FIRST")
        cell.$2 = "SECOND"
        expect(cell.pop()).toBe("SECOND")
        expect(cell.$2).toBeUndefined()
    })
})