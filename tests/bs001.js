var crudproxycell = require('../index.js')
describe(__filename.slice(__dirname.length + 1) + ":",function()
{
    it("is a lie",function()
    {
        var data = {"9":{"id":9},"11":{"id":11},"12":{"id":12},"13":{"id":13},"20":{"id":20},"22":{"id":22},"23":{"id":23},"34":{"id":34},"36":{"id":36},"41":{"id":41},"42":{"id":42}}
        var mins = {"11":19,"9":84,"184":12,"188":24,"224":3,"285":3,"388":6,"407":9,"411":65,"412":65,"413":65,"414":62,"430":64,"432":72,"439":86,"447":72,"466":83,"472":83,"473":83,"477":85,"479":84,"480":86,"482":86,"491":86,"495":89}
        var tasks = new crudproxycell()
        for(task_id in data)
        {
            tasks.$[task_id] = crudproxycell(data[task_id])
        }
        tasks.sort(function(a,b)
        {
            a = mins[a.$id]
            b = mins[b.$id]
            result = a == null ? 1 : b == null ? -1 : a > b
            return result
        })

        expect(tasks._keys).toEqual([ '11', '9', '22', '42', '41', '36', '34', '23', '12', '20', '13' ])
    })

})