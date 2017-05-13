var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("accepts initial data",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: 2,
        })

        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBe(2)
    })

})