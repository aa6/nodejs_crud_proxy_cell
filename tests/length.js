var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("exists",function()
    {
        var cell = new crudproxycell()
        var i
        cell.$test = "TEST"
        cell.push("FIRST")
        cell.$2 = "SECOND"
        expect(cell.length).toBe(3)
    })
})