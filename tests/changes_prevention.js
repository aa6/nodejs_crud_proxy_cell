var crudproxycell = require('../index.js')

describe("Changes prevention",function()
{

    it("Should work for before_insert", function()
    {
        var cpc = new crudproxycell()
        cpc().before_insert(function(done, data)
        {
            expect(typeof done).toBe("function")
            expect(data.event).toBe("insert")
            if(data.new_value == "preventme")
            {
                done(false)
            }
            else
            {
                done(true)
            }
        })
        cpc["thoushallpass"] = true
        cpc["thoushallnotpass"] = "preventme"
        expect(cpc["thoushallpass"]).toBe(true)
        expect(cpc["thoushallnotpass"]).toBe(void(0))
    })

    it("Should work for before_delete", function()
    {
        var cpc = new crudproxycell()
        cpc().before_delete(function(done, data)
        {
            expect(typeof done).toBe("function")
            expect(data.event).toBe("delete")
            if(data.key == "preventme")
            {
                done(false)
            }
            else
            {
                done(true)
            }
        })
        cpc["preventme"] = 12
        expect(cpc["preventme"]).toBe(12)
        cpc["preventmenot"] = 24
        expect(cpc["preventmenot"]).toBe(24)
        delete cpc["preventme"]
        delete cpc["preventmenot"]
        expect(cpc["preventme"]).toBe(12)
        expect(cpc["preventmenot"]).toBe(void(0))
    })

    it("Should work for before_update",function()
    {
        var cpc = new crudproxycell({ preventme: 12, preventmenot: 24})
        cpc().before_update(function(done, data)
        {
            expect(typeof done).toBe("function")
            expect(data.event).toBe("update")
            if(data.key == "preventme")
            {
                done(false)
            }
            else
            {
                done(true)
            }
        })
        expect(cpc["preventme"]).toBe(12)
        expect(cpc["preventmenot"]).toBe(24)
        cpc["preventme"] = 24
        cpc["preventmenot"] = 48
        expect(cpc["preventme"]).toBe(12)
        expect(cpc["preventmenot"]).toBe(48)
    })

    it("Should work for before_change",function()
    {
        var cpc = new crudproxycell({ updateme: 58, deleteme: 216, updatemenot: 158, deletemenot: 36  })
        cpc().before_change(function(done, data)
        {
            expect(typeof done).toBe("function")
            switch(true)
            {
                case data.event == "insert" && data.key == "insertmenot":
                case data.event == "delete" && data.key == "deletemenot":
                case data.event == "update" && data.key == "updatemenot":
                    done(false)
                    break
                default:
                    done(true)
            }
        })
        cpc["insertme"] = 1
        cpc["insertmenot"] = 2
        expect(cpc["insertme"]).toBe(1)
        expect(cpc["insertmenot"]).toBeUndefined()
        delete cpc["deleteme"]
        delete cpc["deletemenot"]
        expect(cpc["deleteme"]).toBeUndefined()
        expect(cpc["deletemenot"]).toBe(36)
        cpc["updateme"] = 3
        cpc["updatemenot"] = 4
        expect(cpc["updateme"]).toBe(3)
        expect(cpc["updatemenot"]).toBe(158)
    })

})