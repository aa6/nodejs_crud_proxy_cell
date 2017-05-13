var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function() // JUST IN CASE YOU KNOW
{
    it("must be configurable",function()
    {
        var cell = new crudproxycell()
        cell.$arguments = "ARGUMENTS"
        cell.$caller = "CALLER"
        cell.$prototype = "PROTOTYPE"
        cell.$length = "LENGTH"
        cell.$name = "NAME"

        expect(cell.$["arguments"]).toBe("ARGUMENTS")
        expect(cell.$["caller"]).toBe("CALLER")
        expect(cell.$["prototype"]).toBe("PROTOTYPE")
        expect(cell.$["length"]).toBe("LENGTH")
        expect(cell.$["name"]).toBe("NAME")
    })

})