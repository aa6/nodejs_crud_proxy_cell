var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
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