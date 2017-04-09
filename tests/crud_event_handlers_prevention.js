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
        cell.before_change(function(done,event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            done(false)
        })
        cell.$a = "AAA"
        expect(cell.$.a).toBe("aaa")
        cell.$c = "CCC"
        expect(cell.$.c).toBeUndefined()
        delete cell.$b
        expect(cell.$.b).toBe("bbb")
        cell.$a = void(0)
        expect(cell.$.a).toBe("aaa")
        
        expect(events_handled).toEqual(["update","insert","delete","delete"])
    })

    it("should prevent insert",function()
    {
        var cell = new crudproxycell({
            a:"aaa",
            b:"bbb",
        })
        var events_handled = []
        cell.before_insert(function(done,event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            done(false)
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
        cell.before_update(function(done,event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            done(false)
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
        cell.before_delete(function(done,event)
        {
            expect(event.target).toBe(cell)
            events_handled.push(event.name)
            done(false)
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