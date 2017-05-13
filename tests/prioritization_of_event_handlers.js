var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("can be specified",function()
    {
        var cell = new crudproxycell()
        var execution_order = []
        cell.on_insert({priority:15},function()
        {
            execution_order.push(15)
        })
        cell.on_insert({priority:-10},function()
        {
            execution_order.push(-10)
        })
        cell.on_insert(function()
        {
            execution_order.push(0)
        })
        cell.$a = "a"
        expect(execution_order).toEqual([-10,0,15])
    })

    it("can be specified for property names",function()
    {
        var cell = new crudproxycell()
        var execution_order = []
        cell.on_change({key:"b",priority:150},function()
        {
            execution_order.push(150)
        })
        cell.on_change({key:"b",priority:-100},function()
        {
            execution_order.push(-100)
        })
        cell.on_change({key:"b"},function()
        {
            execution_order.push(0)
        })
        cell.$a = "a"
        cell.$b = "b"
        expect(execution_order).toEqual([-100,0,150])
    })

    it("can be used in combine with changes prevention",function()
    {
        var cell = new crudproxycell()
        var execution_order = []
        cell.before_change({key:"b",priority:150},function()
        {
            execution_order.push(150)
        })
        cell.before_change({key:"b",priority:-100},function()
        {
            execution_order.push(-100)
        })
        cell.before_change({key:"b"},function(event)
        {
            execution_order.push(0)
            if(event.new_value == "stop") { return false }
        })
        cell.$a = "a"
        cell.$b = "stop"
        expect(execution_order).toEqual([-100,0])
    })
})