var crudproxycell = require('../index.js')
describe("Cycle dependencies",function()
{
    it("must have a way to be resolved",function()
    {
        var dates = new crudproxycell()
        
        dates.on_change("date1",function(event)
        {
            if(event.new_value.value)
            {
                event.new_value = event.new_value.value
            }
            else
            {
                dates.$date2 = { value: event.new_value + 10 }
            }
        })

        dates.on_change("date2",function(event)
        {
            if(event.new_value.value)
            {
                event.new_value = event.new_value.value
            }
            else
            {
                dates.$date1 = { value: event.new_value - 10 }
            }
        })

        dates.$date1 = 1
        expect(dates.$date2).toBe(11)
        dates.$date2 = 22
        expect(dates.$date1).toBe(12)
    })
})