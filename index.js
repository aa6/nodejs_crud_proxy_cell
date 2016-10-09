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

var data_interface_prototype = 
{
    after_insert: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.after_insert[key] == "undefined")
            { this.event_handlers.after_insert[key] = [] }
        this.handlers_counter++
        this.event_handlers.after_insert[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    after_update: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.after_update[key] == "undefined")
            { this.event_handlers.after_update[key] = [] }
        this.handlers_counter++
        this.event_handlers.after_update[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    after_delete: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.after_delete[key] == "undefined")
            { this.event_handlers.after_delete[key] = [] }
        this.handlers_counter++
        this.event_handlers.after_delete[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    after_change: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.after_change[key] == "undefined")
            { this.event_handlers.after_change[key] = [] }
        this.handlers_counter++
        this.event_handlers.after_change[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_insert: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.before_insert[key] == "undefined")
            { this.event_handlers.before_insert[key] = [] }
        this.handlers_counter++
        this.event_handlers.before_insert[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_update: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.before_update[key] == "undefined")
            { this.event_handlers.before_update[key] = [] }
        this.handlers_counter++
        this.event_handlers.before_update[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_delete: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.before_delete[key] == "undefined")
            { this.event_handlers.before_delete[key] = [] }
        this.handlers_counter++
        this.event_handlers.before_delete[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    before_change: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.event_handlers.before_change[key] == "undefined")
            { this.event_handlers.before_change[key] = [] }
        this.handlers_counter++
        this.event_handlers.before_change[key].push({ hd: this.handlers_counter, fn: fn })
        return this.handlers_counter
    },
    off: function(fn_or_hd)
    {
        switch(typeof fn_or_hd)
        {
            case "function":
                for(type in this.event_handlers)
                {
                    for(key in this.event_handlers[type])
                    {
                        for(var i = this.event_handlers[type][key].length; i < 0 ; i--)
                        {
                            if(this.event_handlers[type][key][i].fn === fn_or_hd)
                            {
                                this.event_handlers[type][key].splice(i,1)
                            }
                        }
                    }
                }
                break
            case "string":
                fn_or_hd = parseInt(fn_or_hd)
            case "number":
                for(type in this.event_handlers[type])
                {
                    for(key in this.event_handlers[type])
                    {
                        for(var i = this.event_handlers[type][key].length; i < 0 ; i--)
                        {
                            if(this.event_handlers[type][key][i].hd === fn_or_hd)
                            {
                                this.event_handlers[type][key].splice(i,1)
                            }
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
    var crud_proxy_cell
    var target = function() { return interface }
    var event_handlers = 
    {
        after_insert: { "": [] }, 
        after_update: { "": [] }, 
        after_delete: { "": [] }, 
        after_change: { "": [] },
        before_insert: { "": [] }, 
        before_update: { "": [] }, 
        before_delete: { "": [] }, 
        before_change: { "": [] },
    }
    if(typeof initial_data != "undefined")
    {
        for(var k in initial_data)
        {
            target[k] = initial_data[k]
        }
    }

    var data_interface = function(target)
    {
        this.event_handlers = event_handlers
        this.handler_counter = 0
    }

    data_interface.prototype = data_interface_prototype

    var proxy_handler = 
    {
        ownKeys: function(target)
        {
            return Object.getOwnPropertyNames(target)
        },
        get: function(target, target_property_name, receiver)
        {
            return target[target_property_name]
        },
        set: function(target, target_property_name, value, receiver)
        {
            var operation_permitted = true
            var event = 
            {
                key: target_property_name,
                target: receiver,
                new_val: value,
                old_val: target[target_property_name],
                new_value: value,
                old_value: target[target_property_name],
            }
            switch(true)
            {
                case typeof target[target_property_name] === "undefined":
                    event.name = "insert"
                    var before_handlers = event_handlers.before_insert[""].concat(event_handlers.before_change[""])
                    if(event_handlers.before_insert[target_property_name]) 
                        { before_handlers = before_handlers.concat(event_handlers.before_insert[target_property_name]) }
                    if(event_handlers.before_change[target_property_name]) 
                        { before_handlers = before_handlers.concat(event_handlers.before_change[target_property_name]) }
                    var after_handlers = event_handlers.after_insert[""].concat(event_handlers.after_change[""])
                    if(event_handlers.after_insert[target_property_name]) 
                        { after_handlers = after_handlers.concat(event_handlers.after_insert[target_property_name]) }
                    if(event_handlers.after_change[target_property_name]) 
                        { after_handlers = after_handlers.concat(event_handlers.after_change[target_property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            { 
                                target[target_property_name] = value 
                                for(var i = 0; i < after_handlers.length; i++)
                                {
                                    after_handlers[i].fn(event)
                                }
                            }
                        }
                    )
                    break
                case typeof value === "undefined":
                    event.name = "delete"
                    var before_handlers = event_handlers.before_delete[""].concat(event_handlers.before_change[""])
                    if(event_handlers.before_delete[target_property_name]) 
                        { before_handlers = before_handlers.concat(event_handlers.before_delete[target_property_name]) }
                    if(event_handlers.before_change[target_property_name]) 
                        { before_handlers = before_handlers.concat(event_handlers.before_change[target_property_name]) }
                    var after_handlers = event_handlers.after_delete[""].concat(event_handlers.after_change[""])
                    if(event_handlers.after_delete[target_property_name]) 
                        { after_handlers = after_handlers.concat(event_handlers.after_delete[target_property_name]) }
                    if(event_handlers.after_change[target_property_name]) 
                        { after_handlers = after_handlers.concat(event_handlers.after_change[target_property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            { 
                                target[target_property_name] = value 
                                for(var i = 0; i < after_handlers.length; i++)
                                {
                                    after_handlers[i].fn(event)
                                }
                            }
                        }
                    )
                    break
                default:
                    event.name = "update"
                    var before_handlers = event_handlers.before_update[""].concat(event_handlers.before_change[""])
                    if(event_handlers.before_update[target_property_name]) 
                        { before_handlers = before_handlers.concat(event_handlers.before_update[target_property_name]) }
                    if(event_handlers.before_change[target_property_name]) 
                        { before_handlers = before_handlers.concat(event_handlers.before_change[target_property_name]) }
                    var after_handlers = event_handlers.after_update[""].concat(event_handlers.after_change[""])
                    if(event_handlers.after_update[target_property_name]) 
                        { after_handlers = after_handlers.concat(event_handlers.after_update[target_property_name]) }
                    if(event_handlers.after_change[target_property_name]) 
                        { after_handlers = after_handlers.concat(event_handlers.after_change[target_property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            { 
                                target[target_property_name] = value 
                                if(operation_permitted)
                                { 
                                    target[target_property_name] = value 
                                    for(var i = 0; i < after_handlers.length; i++)
                                    {
                                        after_handlers[i].fn(event)
                                    }
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
            var event = 
            {
                key: target_property_name,
                name: "delete",
                target: crud_proxy_cell,
                new_val: void(0),
                old_val: target[target_property_name],
                new_value: void(0),
                old_value: target[target_property_name],
            }
            var before_handlers = event_handlers.before_delete[""].concat(event_handlers.before_change[""])
            if(event_handlers.before_delete[target_property_name]) 
                { before_handlers = before_handlers.concat(event_handlers.before_delete[target_property_name]) }
            if(event_handlers.before_change[target_property_name]) 
                { before_handlers = before_handlers.concat(event_handlers.before_change[target_property_name]) }
            var after_handlers = event_handlers.after_delete[""].concat(event_handlers.after_change[""])
            if(event_handlers.after_delete[target_property_name]) 
                { after_handlers = after_handlers.concat(event_handlers.after_delete[target_property_name]) }
            if(event_handlers.after_change[target_property_name]) 
                { after_handlers = after_handlers.concat(event_handlers.after_change[target_property_name]) }
            thunk_queue(
                before_handlers,
                event,
                function(operation_permitted)
                {
                    if(operation_permitted)
                    { 
                        delete target[target_property_name]
                        for(var i = 0; i < after_handlers.length; i++)
                        {
                            after_handlers[i].fn(event)
                        }
                    }
                }
            )
        },
    }

    interface = new data_interface(target)
    crud_proxy_cell = new Proxy(target, proxy_handler)
    return crud_proxy_cell
}