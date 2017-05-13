var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("are accessible in handlers",function()
    {
        var cell = new crudproxycell()
        var old_values = []
        cell.on_change("test",function(ev)
        {
            old_values.push(ev.old_value)
        })
        cell.$test = "test"
        cell.$test = "test1"
        cell.$test = "test2"
        cell.$test = "test3"
        expect(old_values).toEqual([void(0),"test","test1","test2"])
    })
})