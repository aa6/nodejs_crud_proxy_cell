var crudproxycell = require('../index.js')
describe("CRUD events",function()
{
    it("should have target equal to a cell",function()
    {
        var cell = new crudproxycell(
        {
            a:"aaa",
            b:"bbb"
        })
        cell.on_change(function(event)
        {
            expect(event.target).toBe(cell)
        })
        cell.$a = "AAA"
        cell.$c = "CCC"
        delete cell.$b
    })

    it("should react on change",function()
    {
        var cell = new crudproxycell({
            a:"aaa",
            b:"bbb",
        })
        var events_handled = []
        cell.on_change(function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
        })
        cell.$a = "AAA"
        cell.$c = "CCC"
        delete cell.$b
        cell.$a = void(0)
        
        expect(events_handled).toEqual(["update","insert","delete","delete"])
    })

    it("should react on insert",function()
    {
        var cell = new crudproxycell()
        var event_handled = false
        cell.on_insert(function(event)
        {
            expect(event.name).toBe("insert")
            expect(event.target).toBe(cell)
            event_handled = true
        })
        cell.$a = "AAA"
        expect(event_handled).toBe(true)
    })

    it("should react on update",function()
    {
        var cell = new crudproxycell({a:"---"})
        var event_handled = false
        cell.on_update(function(event)
        {
            expect(event.name).toBe("update")
            expect(event.target).toBe(cell)
            event_handled = true
        })
        cell.$a = "AAA"
        expect(event_handled).toBe(true)
    })

    it("should react on delete",function()
    {
        var cell = new crudproxycell({a:"---"})
        var event_handled = false
        cell.on_delete(function(event)
        {
            expect(event.name).toBe("delete")
            expect(event.target).toBe(cell)
            event_handled = true
        })
        delete cell.$a
        expect(event_handled).toBe(true)
    })
})