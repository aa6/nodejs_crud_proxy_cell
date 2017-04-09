var proxy_handler = 
{
    ownKeys: function(target)
    {
        var data_keys = Object.keys(target._data).map(function(item){ return "$" + item })
        return data_keys.concat(Object.keys(target))
    },
    getOwnPropertyDescriptor: function(target, property_name)
    {
        if(typeof property_name == "string" && property_name.charAt(0) == "$")
        {
            return Object.getOwnPropertyDescriptor(target.$, property_name.substr(1))
        }
        else
        {
            return { 
                value: target[property_name],
                writable: true,
                enumerable: true,
                configurable: true,
            }
        }
    },
    getPrototypeOf: function(target)
    {
        return crudproxycell.prototype
    },
    get: function(target, property_name, receiver)
    {
        switch(true)
        {
            case property_name === "$":
                return target.$
                break
            case typeof property_name == "string" && property_name.charAt(0) == "$":
                return target.$[property_name.substr(1)]
                break
            default:
                return target[property_name]
        }
    },
    set: function(target, property_name, value, receiver)
    {
        if(typeof property_name == "string" && property_name.charAt(0) == "$")
        {
            target.$[property_name.substr(1)] = value
        }
        else
        {
            target[property_name] = value
        }
    },
    deleteProperty: function(target, property_name)
    {
        if(typeof property_name == "string" && property_name.charAt(0) == "$")
        {
            delete target.$[property_name.substr(1)]
        }
        else
        {
            delete target[property_name]
        }
    },
}
// Thunk is a function that encapsulates asynchronous code inside.
var thunk_queue = function(array_of_thunks, data, final_fn)
{
    var final_result = true
    var pending_count = array_of_thunks.length
    var done = function(thunk_result)
    {
        final_result = final_result && thunk_result
        if(--pending_count == 0) { final_fn(final_result) }
    }
    if(array_of_thunks.length > 0)
        { for(var i = 0; i < array_of_thunks.length; i++) { array_of_thunks[i].fn(done, data) } }
    else
        { final_fn(final_result) }
}
var is_valid_numeric_key = function(num) { return /^(0|[1-9]\d*)$/.test(num) }
var crudproxycell = function(initial_data)
{
    var crudproxycell_instance
    var target =
    {
        $: null,
        push: function(item)
        {
            target.$[++target._max_numeric_key] = item
        },
        on_insert: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.after_insert[key] == "undefined")
                { target._event_handlers.after_insert[key] = [] }
            target._handlers_counter++
            target._event_handlers.after_insert[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        on_update: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.after_update[key] == "undefined")
                { target._event_handlers.after_update[key] = [] }
            target._handlers_counter++
            target._event_handlers.after_update[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        on_delete: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.after_delete[key] == "undefined")
                { target._event_handlers.after_delete[key] = [] }
            target._handlers_counter++
            target._event_handlers.after_delete[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        on_change: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.after_change[key] == "undefined")
                { target._event_handlers.after_change[key] = [] }
            target._handlers_counter++
            target._event_handlers.after_change[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        before_insert: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.before_insert[key] == "undefined")
                { target._event_handlers.before_insert[key] = [] }
            target._handlers_counter++
            target._event_handlers.before_insert[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        before_update: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.before_update[key] == "undefined")
                { target._event_handlers.before_update[key] = [] }
            target._handlers_counter++
            target._event_handlers.before_update[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        before_delete: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.before_delete[key] == "undefined")
                { target._event_handlers.before_delete[key] = [] }
            target._handlers_counter++
            target._event_handlers.before_delete[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        before_change: function(key, fn)
        {
            if(typeof key == "function") 
                { fn = key; key = ""; }
            if(typeof target._event_handlers.before_change[key] == "undefined")
                { target._event_handlers.before_change[key] = [] }
            target._handlers_counter++
            target._event_handlers.before_change[key].push({ hd: target._handlers_counter, fn: fn })
            return target._handlers_counter
        },
        off: function(fn_or_hd)
        {
            switch(typeof fn_or_hd)
            {
                case "function":
                    for(type in target._event_handlers)
                    {
                        for(key in target._event_handlers[type])
                        {
                            for(var i = target._event_handlers[type][key].length; i < 0 ; i--)
                            {
                                if(target._event_handlers[type][key][i].fn === fn_or_hd)
                                {
                                    target._event_handlers[type][key].splice(i,1)
                                }
                            }
                        }
                    }
                    break
                case "string":
                    fn_or_hd = parseInt(fn_or_hd)
                case "number":
                    for(type in target._event_handlers[type])
                    {
                        for(key in target._event_handlers[type])
                        {
                            for(var i = target._event_handlers[type][key].length; i < 0 ; i--)
                            {
                                if(target._event_handlers[type][key][i].hd === fn_or_hd)
                                {
                                    target._event_handlers[type][key].splice(i,1)
                                }
                            }
                        }
                    }
                    break
            }
        },
        toObject: function()
        {
            var result = {}
            for(key in this._data)
            {
                if(this._data[key] instanceof crudproxycell)
                {
                    result[key] = this._data[key].toObject()
                }
                else
                {
                    result[key] = this._data[key]
                }
            }
            return result
        },
        _data: {},
        _max_numeric_key: -1,
        _handlers_counter: 0,
        _event_handlers:
        {
            after_insert: { "": [] }, 
            after_update: { "": [] }, 
            after_delete: { "": [] }, 
            after_change: { "": [] },
            before_insert: { "": [] }, 
            before_update: { "": [] }, 
            before_delete: { "": [] }, 
            before_change: { "": [] },
        },
    }
    var dollar_proxy = 
    {
        ownKeys: function(target)
        {
            return Object.getOwnPropertyNames(target._data)
        },
        getOwnPropertyDescriptor: function(target, name)
        {
            return { 
                value: target._data[name],
                writable: true,
                enumerable: true,
                configurable: true,
            }
        },
        get: function(target, property_name, receiver)
        {
            return target._data[property_name]
        },
        set: function(target, property_name, value, receiver)
        {
            var operation_permitted = true
            var event = 
            {
                key: property_name,
                target: crudproxycell_instance,
                new_val: value,
                old_val: target._data[property_name],
                new_value: value,
                old_value: target._data[property_name],
                newval: value,
                oldval: target._data[property_name],
                newvalue: value,
                oldvalue: target._data[property_name],
            }
            // Setting (changing) a property generates events.
            switch(true) 
            {
                case typeof target._data[property_name] === "undefined":
                    event.name = "insert"
                    var before_handlers = target._event_handlers.before_insert[""].concat(target._event_handlers.before_change[""])
                    if(target._event_handlers.before_insert[property_name]) 
                        { before_handlers = before_handlers.concat(target._event_handlers.before_insert[property_name]) }
                    if(target._event_handlers.before_change[property_name]) 
                        { before_handlers = before_handlers.concat(target._event_handlers.before_change[property_name]) }
                    var after_handlers = target._event_handlers.after_insert[""].concat(target._event_handlers.after_change[""])
                    if(target._event_handlers.after_insert[property_name]) 
                        { after_handlers = after_handlers.concat(target._event_handlers.after_insert[property_name]) }
                    if(target._event_handlers.after_change[property_name]) 
                        { after_handlers = after_handlers.concat(target._event_handlers.after_change[property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            {
                                if(is_valid_numeric_key(property_name))
                                {
                                    var property_name_parsed = parseInt(property_name)
                                    if(property_name_parsed > target._max_numeric_key)
                                    {
                                        target._max_numeric_key = property_name_parsed
                                    }
                                }
                                target._data[property_name] = value
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
                    var before_handlers = target._event_handlers.before_delete[""].concat(target._event_handlers.before_change[""])
                    if(target._event_handlers.before_delete[property_name]) 
                        { before_handlers = before_handlers.concat(target._event_handlers.before_delete[property_name]) }
                    if(target._event_handlers.before_change[property_name]) 
                        { before_handlers = before_handlers.concat(target._event_handlers.before_change[property_name]) }
                    var after_handlers = target._event_handlers.after_delete[""].concat(target._event_handlers.after_change[""])
                    if(target._event_handlers.after_delete[property_name]) 
                        { after_handlers = after_handlers.concat(target._event_handlers.after_delete[property_name]) }
                    if(target._event_handlers.after_change[property_name]) 
                        { after_handlers = after_handlers.concat(target._event_handlers.after_change[property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            { 
                                target._data[property_name] = value
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
                    var before_handlers = target._event_handlers.before_update[""].concat(target._event_handlers.before_change[""])
                    if(target._event_handlers.before_update[property_name]) 
                        { before_handlers = before_handlers.concat(target._event_handlers.before_update[property_name]) }
                    if(target._event_handlers.before_change[property_name]) 
                        { before_handlers = before_handlers.concat(target._event_handlers.before_change[property_name]) }
                    var after_handlers = target._event_handlers.after_update[""].concat(target._event_handlers.after_change[""])
                    if(target._event_handlers.after_update[property_name]) 
                        { after_handlers = after_handlers.concat(target._event_handlers.after_update[property_name]) }
                    if(target._event_handlers.after_change[property_name]) 
                        { after_handlers = after_handlers.concat(target._event_handlers.after_change[property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            { 
                                if(operation_permitted)
                                { 
                                    target._data[property_name] = value
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
        deleteProperty: function(target, property_name)
        {
            var operation_permitted = true
            var event = 
            {
                key: property_name,
                name: "delete",
                target: crudproxycell_instance,
                new_val: void(0),
                old_val: target._data[property_name],
                new_value: void(0),
                old_value: target._data[property_name],
            }
            var before_handlers = target._event_handlers.before_delete[""].concat(target._event_handlers.before_change[""])
            if(target._event_handlers.before_delete[property_name]) 
                { before_handlers = before_handlers.concat(target._event_handlers.before_delete[property_name]) }
            if(target._event_handlers.before_change[property_name]) 
                { before_handlers = before_handlers.concat(target._event_handlers.before_change[property_name]) }
            var after_handlers = target._event_handlers.after_delete[""].concat(target._event_handlers.after_change[""])
            if(target._event_handlers.after_delete[property_name]) 
                { after_handlers = after_handlers.concat(target._event_handlers.after_delete[property_name]) }
            if(target._event_handlers.after_change[property_name]) 
                { after_handlers = after_handlers.concat(target._event_handlers.after_change[property_name]) }
            thunk_queue(
                before_handlers,
                event,
                function(operation_permitted)
                {
                    if(operation_permitted)
                    { 
                        delete target._data[property_name]
                        for(var i = 0; i < after_handlers.length; i++)
                        {
                            after_handlers[i].fn(event)
                        }
                    }
                }
            )
        },
    }
    target.$ = new Proxy(target, dollar_proxy)
    if(initial_data != null)
    {
        for(key in initial_data)
        {
            target._data[key] = initial_data[key]
        }
    }
    crudproxycell_instance = new Proxy(target, proxy_handler)
    return crudproxycell_instance
}



module.exports = crudproxycell