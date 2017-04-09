var crudproxycell = require('../index.js')
describe(".toObject()",function()
{
    it("returns data as copy to prevent accidental data manipulating through the object",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        toObject_call_result = cell.toObject()
        toObject_call_result.one = "FIVE"

        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBe("TWO")
        expect(toObject_call_result.one).toBe("FIVE")
        expect(toObject_call_result.two).toBe("TWO")
    })

})