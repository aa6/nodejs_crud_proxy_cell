var crudproxycell = require('../index.js')
describe("Crud proxy data",function()
{
    it("return values with an $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            "": "EMPTY",
            one: "ONE",
            two: "TWO",
        })
        expect(cell.$["one"]).toBe("ONE")
        expect(cell.$["two"]).toBe("TWO")
        expect(cell.$[""]).toBe("EMPTY")
    })

    it("sets values with an $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
        })
        cell.$two = "TWO"
        cell.$[""] = "EMPTY"
        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBe("TWO")
        expect(cell.$[""]).toBe("EMPTY")
    })

    it("deletes values with an $ symbol",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        delete cell.$["two"]
        expect(cell.$one).toBe("ONE")
        expect(cell.$two).toBeUndefined()
        delete cell.$["one"]
        expect(cell.$one).toBeUndefined()
    })
})