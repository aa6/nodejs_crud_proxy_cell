var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("creates a copy of initial data to prevent accidental data manipulating through the object",function()
    {
        var initial_data_1 = { name: "ONE" }
        var initial_data_2 = "TWO"
        var initial_data_3 = "SOMETHINGELSE"
        var initial_data =
        {
            one: initial_data_1,
            two: initial_data_2,
        }

        var cell = new crudproxycell(initial_data)
        initial_data.one = initial_data_3

        expect(cell.$one).toBe(initial_data_1)
        expect(cell.$two).toBe(initial_data_2)
        expect(cell.$one).not.toBe(initial_data_3)
    })

})