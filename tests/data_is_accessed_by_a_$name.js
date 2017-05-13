var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("return values with an $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBe("TWO")
    })

    it("sets values with an $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
        })
        cell.$two = "TWO"
        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBe("TWO")
    })

    it("deletes values with an $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        delete cell.$two
        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBeUndefined()
        delete cell.$["one"]
        expect(cell.$one).toBeUndefined()
    })
})