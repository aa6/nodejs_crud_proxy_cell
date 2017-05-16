var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("is a lie",function()
    {
        var tasks = new crudproxycell()
        tasks.before_change(function(ev)
        {
            if(ev.new_value != null && ev.key == "10000")
            {
                delete tasks.$[10000]
                return false
            }
        })
        tasks.$[10000] = "LIE"
        expect(tasks.$[10000]).toBeUndefined()
    })

})