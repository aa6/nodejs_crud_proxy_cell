var thunk_queue = function(thunks, data, afterfn)
{
    var pending = thunks.length
    var total = true
    var done = function(result)
    {
        total = total && result
        if(--pending == 0) { afterfn(total) }
    }
    if(thunks.length > 0)
    {
        for(var i = 0; i < thunks.length; i++) { thunks[i].fn(done, data) }
    }
    else
    {
        afterfn(total)
    }
}

var proxy_handler = 
{
    get: function(target, target_property_name, receiver)
    {
        return target.data[target_property_name]
    },
    set: function(target, target_property_name, value, receiver)
    {
        var operation_permitted = true
        var change_data = 
        {
            key: target_property_name,
            new_val: value,
            old_val: target.data[target_property_name],
            new_value: value,
            old_value: target.data[target_property_name],
        }
        switch(true)
        {
            case typeof target.data[target_property_name] === "undefined":
                change_data.event = "insert"
                thunk_queue(
                    target.event_handlers.before_insert.concat(target.event_handlers.before_change),
                    change_data,
                    function(operation_permitted)
                    {
                        if(operation_permitted)
                        { 
                            target.data[target_property_name] = value 
                            for(var i = 0; i < target.event_handlers.after_insert.length; i++)
                            {
                                target.event_handlers.after_insert[i].fn(change_data)
                            }
                            for(var i = 0; i < target.event_handlers.after_change.length; i++)
                            {
                                target.event_handlers.after_change[i].fn(change_data)
                            }
                        }
                    }
                )
                break
            case typeof value === "undefined":
                change_data.event = "delete"
                thunk_queue(
                    target.event_handlers.before_delete.concat(target.event_handlers.before_change),
                    change_data,
                    function(operation_permitted)
                    {
                        if(operation_permitted)
                        { 
                            target.data[target_property_name] = value 
                            for(var i = 0; i < target.event_handlers.after_delete.length; i++)
                            {
                                target.event_handlers.after_delete[i].fn(change_data)
                            }
                            for(var i = 0; i < target.event_handlers.after_change.length; i++)
                            {
                                target.event_handlers.after_change[i].fn(change_data)
                            }
                        }
                    }
                )
                break
            default:
                change_data.event = "update"
                thunk_queue(
                    target.event_handlers.before_update.concat(target.event_handlers.before_change),
                    change_data,
                    function(operation_permitted)
                    {
                        if(operation_permitted)
                        { 
                            target.data[target_property_name] = value 
                            for(var i = 0; i < target.event_handlers.after_update.length; i++)
                            {
                                target.event_handlers.after_update[i].fn(change_data)
                            }
                            for(var i = 0; i < target.event_handlers.after_change.length; i++)
                            {
                                target.event_handlers.after_change[i].fn(change_data)
                            }
                        }
                    }
                )
                break
        }
    },
    deleteProperty: function(target, target_property_name)
    {
        var operation_permitted = true
        var change_data = 
        {
            key: target_property_name,
            new_val: void(0),
            old_val: target.data[target_property_name],
            new_value: void(0),
            old_value: target.data[target_property_name],
        }
        change_data.event = "delete"
        thunk_queue(
            target.event_handlers.before_delete.concat(target.event_handlers.before_change),
            change_data,
            function(operation_permitted)
            {
                if(operation_permitted)
                { 
                    target.data[target_property_name] = void(0) 
                    for(var i = 0; i < target.event_handlers.after_delete.length; i++)
                    {
                        target.event_handlers.after_delete[i].fn(change_data)
                    }
                    for(var i = 0; i < target.event_handlers.after_change.length; i++)
                    {
                        target.event_handlers.after_change[i].fn(change_data)
                    }
                }
            }
        )
    },
}

var data_interface = function(target)
{
    this.event_handlers = target.event_handlers
    this.handler_counter = 0
}

data_interface.prototype =
{
    after_insert: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.after_insert.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    after_update: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.after_update.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    after_delete: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.after_delete.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    after_change: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.after_change.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_insert: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.before_insert.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_update: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.before_update.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_delete: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.before_delete.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_change: function(fn)
    {
        this.handlers_counter++
        this.event_handlers.before_change.push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    off: function(fn_or_hd)
    {
        switch(typeof fn_or_hd)
        {
            case "function":
                for(key in this.event_handlers)
                {
                    for(var i = this.event_handlers[key].length; i < 0 ; i--)
                    {
                        if(this.event_handlers[key][i].fn === fn_or_hd)
                        {
                            this.event_handlers[key].splice(i,1)
                        }
                    }
                }
                break
            case "string":
                fn_or_hd = parseInt(fn_or_hd)
            case "number":
                for(key in this.event_handlers)
                {
                    for(var i = this.event_handlers[key].length; i < 0 ; i--)
                    {
                        if(this.event_handlers[key][i].hd === fn_or_hd)
                        {
                            this.event_handlers[key].splice(i,1)
                        }
                    }
                }
                break
        }
    },
}

module.exports = function(initial_data)
{
    var interface
    var target = function() { return interface }
    target.event_handlers = 
    {
        after_insert: [], after_update: [], after_delete: [], after_change: [],
        before_insert: [], before_update: [], before_delete: [], before_change: [],
    }
    if(typeof initial_data == "undefined")
    {
        target.data = {}
    }
    else
    {
        target.data = initial_data
    }
    interface = new data_interface(target)
    return new Proxy(target, proxy_handler)
}