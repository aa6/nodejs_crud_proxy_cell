var crudproxycell = require('../index.js')
describe("CRUD events",function()
{
    it("should react on change",function()
    {
        var cell = new crudproxycell({
            b:"bbb",
        })
        var events_handled = []
        cell.on_change("a",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
        })
        cell.$a = "aaa"
        cell.$a = "AAA"
        cell.$c = "CCC"
        delete cell.$b
        cell.$a = void(0)
        
        expect(events_handled).toEqual(["insert","update","delete"])
    })

    it("should react on insert",function()
    {
        var cell = new crudproxycell({
            b:"bbb",
        })
        var events_handled = []
        cell.on_insert("a",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
        })
        cell.$a = "aaa"
        cell.$a = "AAA"
        cell.$c = "CCC"
        delete cell.$b
        cell.$a = void(0)
        
        expect(events_handled).toEqual(["insert"])
    })

    it("should react on update",function()
    {
        var cell = new crudproxycell({
            b:"bbb",
        })
        var events_handled = []
        cell.on_update("a",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
        })
        cell.$a = "aaa"
        cell.$a = "AAA"
        cell.$a = "AAAs"
        cell.$c = "CCC"
        delete cell.$b
        cell.$a = void(0)
        
        expect(events_handled).toEqual(["update","update"])
    })

    it("should react on delete",function()
    {
        var cell = new crudproxycell({
            b:"bbb",
        })
        var events_handled = []
        cell.on_delete("a",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
        })
        cell.$a = "aaa"
        cell.$a = "AAA"
        cell.$c = "CCC"
        delete cell.$b
        cell.$a = void(0)
        
        expect(events_handled).toEqual(["delete"])
    })
})