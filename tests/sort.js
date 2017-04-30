var crudproxycell = require('../index.js')
describe("Sort functions",function()
{
    it("ksort",function()
    {
        var cell = new crudproxycell()
        cell.$4 = "FOUR"
        cell.$2 = "TWO"
        cell.push("FIVE")
        unsorted = []
        for(key in cell.$)
        {
            unsorted.push([key,cell.$[key]])
        }

        cell.ksort()

        sorted = []
        for(key in cell.$)
        {
            sorted.push([key,cell.$[key]])
        }
        expect(unsorted).toEqual([ [ '4', 'FOUR' ], [ '2', 'TWO' ], [ '5', 'FIVE' ] ])
        expect(sorted).toEqual([ [ '2', 'TWO' ], [ '4', 'FOUR' ], [ '5', 'FIVE' ] ])
    })

    it("sort",function()
    {
        var cell = new crudproxycell()
        cell.$4 = "FOUR"
        cell.$2 = "TWO"
        cell.push("FIVE")
        unsorted = []
        for(key in cell.$)
        {
            unsorted.push([key,cell.$[key]])
        }

        cell.sort()

        sorted = []
        for(key in cell.$)
        {
            sorted.push([key,cell.$[key]])
        }
        expect(unsorted).toEqual([ [ '4', 'FOUR' ], [ '2', 'TWO' ], [ '5', 'FIVE' ] ])
        expect(sorted).toEqual([ [ '5', 'FIVE' ], [ '4', 'FOUR' ], [ '2', 'TWO' ] ])
    })

    it("sort(fn)",function()
    {
        var cell = new crudproxycell()
        cell.$4 = "FOUR"
        cell.$2 = "TWO"
        cell.push("FIVE")
        unsorted = []
        for(key in cell.$)
        {
            unsorted.push([key,cell.$[key]])
        }

        cell.sort(function(a,b)
        {
            return a.toString() < b.toString()
        })

        sorted = []
        for(key in cell.$)
        {
            sorted.push([key,cell.$[key]])
        }
        expect(unsorted).toEqual([ [ '4', 'FOUR' ], [ '2', 'TWO' ], [ '5', 'FIVE' ] ])
        expect(sorted).toEqual([ [ '2', 'TWO' ], [ '4', 'FOUR' ], [ '5', 'FIVE' ] ])
    })

})