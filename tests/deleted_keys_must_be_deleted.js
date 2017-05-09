var crudproxycell = require('../index.js')
describe("Deleted keys",function()
{
    it("must be deleted",function()
    {
        var cell = new crudproxycell()
        cell.$A = "AAA"
        cell.$B = "BBB"
        cell.$C = "CCC"
        expect(Object.keys(cell.$)).toEqual(["A","B","C"])
        delete cell.$B
        expect(Object.keys(cell.$)).toEqual(["A","C"])
    })
})