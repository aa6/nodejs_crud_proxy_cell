var crudproxycell = require('../index.js')
describe("Cycle dependencies",function()
{
    fit("must have a way to be resolved",function()
    {
        var dates = new crudproxycell()
        dates.on_change("date1",function({new_value})
        {
            if(new_value.value)
            {
                new_value = new_value.value
            }
            else
            {
                dates.$date2 = { value: new_value + 10 }
            }
        })

        dates.on_change("date2",function({new_value})
        {
            if(new_value.value)
            {
                new_value = new_value.value
            }
            else
            {
                dates.$date1 = { value: new_value - 10 }
            }
        })

        dates.$date1 = 1
        expect(dates.$date2).toBe(11)
    })
})