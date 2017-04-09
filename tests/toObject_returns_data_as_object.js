var crudproxycell = require('../index.js')
describe(".toObject()",function()
{
    it("returns data as object",function()
    {
        var initial_data_1 = { name: "ONE" }
        var initial_data_2 = "TWO"
        var initial_data_3 = 3
        var initial_data =
        {
            one: initial_data_1,
            two: initial_data_2,
            three: initial_data_3,
        }
        
        var cell = new crudproxycell(initial_data)
        toObject_call_result = cell.toObject()

        expect(toObject_call_result.one).toBe(cell.$one)
        expect(toObject_call_result.two).toBe(cell.$two)
        expect(toObject_call_result.three).toBe(cell.$three)
    })

})