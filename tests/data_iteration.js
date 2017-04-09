var crudproxycell = require('../index.js')
describe("Data iteration",function()
{
    it("items can be iterated with $ property",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
            three: "THREE",
        })
        var for_in_keys = []
        for(key in cell.$)
        {
            for_in_keys.push(key)
        }

        expect(for_in_keys).toEqual(["one","two","three"])
        expect(Object.keys(cell.$)).toEqual(["one","two","three"])
    })

    it("items can be iterated through main object",function()
    {
        var cell = new crudproxycell(
        {
            one: "ONE",
            two: "TWO",
        })
        cell.$three = "THREE"

        var for_in_keys = []
        for(key in cell)
        {
            for_in_keys.push(key)
        }

        expect(for_in_keys.indexOf("$one")).toBe(0)
        expect(for_in_keys.indexOf("$two")).toBe(1)
        expect(for_in_keys.indexOf("$three")).toBe(2)

        expect(Object.keys(cell).indexOf("$one")).toBe(0)
        expect(Object.keys(cell).indexOf("$two")).toBe(1)
        expect(Object.keys(cell).indexOf("$three")).toBe(2)
    })
})