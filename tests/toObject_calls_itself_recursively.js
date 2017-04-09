var crudproxycell = require('../index.js')
describe(".toObject()",function()
{
    it("calls itself recursively on other crudproxycell instances",function()
    {
        var cell1 = new crudproxycell({ one: "ONE" })
        var cell2 = new crudproxycell({ two: "TWO" })
        var parent_cell = new crudproxycell(
        {
            zero: "ZERO",
            first: cell1,
            second: cell2,
        })
        result = parent_cell.toObject()
        expect(parent_cell.$first instanceof crudproxycell).toBe(true)
        expect(parent_cell.$second instanceof crudproxycell).toBe(true)
        expect(result.zero).toBe("ZERO")
        expect(result.first).toEqual({ one: "ONE" })
        expect(result.second).toEqual({ two: "TWO" })
        expect(result.first instanceof crudproxycell).toBe(false)
        expect(result.second instanceof crudproxycell).toBe(false)
    })

})