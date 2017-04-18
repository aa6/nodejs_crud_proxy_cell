var crudproxycell = require('../index.js')
describe("CRUD events",function()
{
    it("should prevent change",function()
    {
        var cell = new crudproxycell({
            a:"aaa",
            b:"bbb",
        })
        var events_handled = []
        cell.on_change("a",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            return false
        })
        cell.$a = "AAA"
        expect(cell.$.a).toBe("aaa")
        cell.$c = "CCC"
        expect(cell.$.c).toBe("CCC")
        delete cell.$b
        expect(cell.$.b).toBeUndefined()
        cell.$a = void(0)
        expect(cell.$.a).toBe("aaa")
        
        expect(events_handled).toEqual(["update","delete"])
    })

    it("should prevent insert",function()
    {
        var cell = new crudproxycell({
            a:"aaa",
            b:"bbb",
        })
        var events_handled = []
        cell.on_insert("c",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            return false
        })
        cell.$a = "AAA"
        expect(cell.$.a).toBe("AAA")
        cell.$c = "CCC"
        expect(cell.$.c).toBeUndefined()
        delete cell.$b
        expect(cell.$.b).toBeUndefined()
        cell.$a = void(0)
        expect(cell.$.a).toBeUndefined()
        
        expect(events_handled).toEqual(["insert"])
    })

    it("should prevent update",function()
    {
        var cell = new crudproxycell({
            a:"aaa",
            b:"bbb",
        })
        var events_handled = []
        cell.on_update("a",function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            return false
        })
        cell.$a = "AAA"
        expect(cell.$.a).toBe("aaa") // Unchanged!
        cell.$c = "CCC"
        expect(cell.$.c).toBe("CCC")
        delete cell.$b
        expect(cell.$.b).toBeUndefined()
        cell.$a = void(0)
        expect(cell.$.a).toBeUndefined()
        
        expect(events_handled).toEqual(["update"])
    })

    it("should prevent delete",function()
    {
        var cell = new crudproxycell({
            a:"aaa",
            b:"bbb",
        })
        var events_handled = []
        cell.on_delete(function(event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            return false
        })
        cell.$a = "AAA"
        expect(cell.$.a).toBe("AAA")
        cell.$c = "CCC"
        expect(cell.$.c).toBe("CCC")
        delete cell.$b
        expect(cell.$.b).toBe("bbb")
        cell.$a = void(0)
        expect(cell.$.a).toBe("AAA")
        
        expect(events_handled).toEqual(["delete","delete"])
    })
})