var crudproxycell = require('../index.js')
describe("Crud proxy data",function()
{
    it("can change value by $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        expect(cell.$.one).toBe("ONE")
        expect(cell.$.two).toBe("TWO")

        cell.$.two = "CHANGED-TWO"
        expect(cell.$.two).toBe("CHANGED-TWO")
    })
    it("can delete value by $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        expect(cell.$.one).toBe("ONE")
        expect(cell.$.two).toBe("TWO")

        cell.$.two = void(0)
        expect(cell.$.two).toBeUndefined()
    })
})