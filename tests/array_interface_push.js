var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("items can be pushed with .push()",function()
    {
        var cpc = new crudproxycell()
        cpc.push("one")
        cpc.push("two")
        cpc.push("three")
        expect(cpc.$[0]).toBe("one")
        expect(cpc.$[1]).toBe("two")
        expect(cpc.$[2]).toBe("three")
    })

    it("items can be pushed with .push() and it will count in max numeric index",function()
    {
        var cpc = new crudproxycell()
        cpc.push("one")
        cpc.push("two")
        cpc.push("three")
        cpc.$[48] = "fourty eight"
        cpc.push("fourty nine")
        expect(cpc.$[0]).toBe("one")
        expect(cpc.$[1]).toBe("two")
        expect(cpc.$[2]).toBe("three")
        expect(cpc.$[3]).toBeUndefined()
        expect(cpc.$[48]).toBe("fourty eight")
        expect(cpc.$["49"]).toBe("fourty nine")
    })
})