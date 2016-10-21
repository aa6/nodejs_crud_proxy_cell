var is_valid_numeric_key = function(num) 
    { return /^(0|[1-9]\d*)$/.test(num) }
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

var interface_prototype = 
{
    after_insert: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.after_insert[key] == "undefined")
            { this.context.event_handlers.after_insert[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.after_insert[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    after_update: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.after_update[key] == "undefined")
            { this.context.event_handlers.after_update[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.after_update[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    after_delete: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.after_delete[key] == "undefined")
            { this.context.event_handlers.after_delete[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.after_delete[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    after_change: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.after_change[key] == "undefined")
            { this.context.event_handlers.after_change[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.after_change[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    before_insert: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.before_insert[key] == "undefined")
            { this.context.event_handlers.before_insert[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.before_insert[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    before_update: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.before_update[key] == "undefined")
            { this.context.event_handlers.before_update[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.before_update[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    before_delete: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.before_delete[key] == "undefined")
            { this.context.event_handlers.before_delete[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.before_delete[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    before_change: function(key, fn)
    {
        if(typeof key == "function") 
            { fn = key; key = ""; }
        if(typeof this.context.event_handlers.before_change[key] == "undefined")
            { this.context.event_handlers.before_change[key] = [] }
        this.context.handlers_counter++
        this.context.event_handlers.before_change[key].push({ hd: this.context.handlers_counter, fn: fn })
        return this.context.handlers_counter
    },
    off: function(fn_or_hd)
    {
        switch(typeof fn_or_hd)
        {
            case "function":
                for(type in this.context.event_handlers)
                {
                    for(key in this.context.event_handlers[type])
                    {
                        for(var i = this.context.event_handlers[type][key].length; i < 0 ; i--)
                        {
                            if(this.context.event_handlers[type][key][i].fn === fn_or_hd)
                            {
                                this.context.event_handlers[type][key].splice(i,1)
                            }
                        }
                    }
                }
                break
            case "string":
                fn_or_hd = parseInt(fn_or_hd)
            case "number":
                for(type in this.context.event_handlers[type])
                {
                    for(key in this.context.event_handlers[type])
                    {
                        for(var i = this.context.event_handlers[type][key].length; i < 0 ; i--)
                        {
                            if(this.context.event_handlers[type][key][i].hd === fn_or_hd)
                            {
                                this.context.event_handlers[type][key].splice(i,1)
                            }
                        }
                    }
                }
                break
        }
    },
    toObject: function()
    {
        var obj = {}
        for(var key in this.context.target) { obj[key] = this.context.target[key] }
        return obj
    },
    push: function(item)
    {
        this.context.crudproxycell[++this.context.max_numeric_key] = item
    },
}

module.exports = function(initial_data)
{
    var target = function() { return interface }
    var interface
    var crudproxycell
    var context = 
    {
        event_handlers:
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
        target: target,
        crudproxycell: crudproxycell,
        max_numeric_key: -1,
        handlers_counter: 0,
    }
    var interface_constructor = function(target) { this.context = context }
    interface_constructor.prototype = interface_prototype

    if(typeof initial_data != "undefined")
        { for(var key in initial_data) { target[key] = initial_data[key] } }

    var proxy_handler = 
    {
        ownKeys: function(target)
        {
            return Object.getOwnPropertyNames(target)
        },
        get: function(target, target_property_name, receiver)
        {
            if(target_property_name == "toObject" && !target.hasOwnProperty(target_property_name))
            {
                var obj = {}
                for(var key in target) { obj[key] = target[key] }
                return function(){ return Object(obj) }
            }
            if(target_property_name == "toString" && !target.hasOwnProperty(target_property_name))
            {
                return function(){ return "Browser is broken so you need to use .toObject to debug" }
            }
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
                    var before_handlers = context.event_handlers.before_insert[""].concat(context.event_handlers.before_change[""])
                    if(context.event_handlers.before_insert[target_property_name]) 
                        { before_handlers = before_handlers.concat(context.event_handlers.before_insert[target_property_name]) }
                    if(context.event_handlers.before_change[target_property_name]) 
                        { before_handlers = before_handlers.concat(context.event_handlers.before_change[target_property_name]) }
                    var after_handlers = context.event_handlers.after_insert[""].concat(context.event_handlers.after_change[""])
                    if(context.event_handlers.after_insert[target_property_name]) 
                        { after_handlers = after_handlers.concat(context.event_handlers.after_insert[target_property_name]) }
                    if(context.event_handlers.after_change[target_property_name]) 
                        { after_handlers = after_handlers.concat(context.event_handlers.after_change[target_property_name]) }
                    thunk_queue(
                        before_handlers,
                        event,
                        function(operation_permitted)
                        {
                            if(operation_permitted)
                            {
                                if(is_valid_numeric_key(target_property_name))
                                {
                                    var target_property_name_parsed = parseInt(target_property_name)
                                    if(target_property_name_parsed > context.max_numeric_key)
                                    {
                                        context.max_numeric_key = target_property_name_parsed
                                    }
                                }
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
                    var before_handlers = context.event_handlers.before_delete[""].concat(context.event_handlers.before_change[""])
                    if(context.event_handlers.before_delete[target_property_name]) 
                        { before_handlers = before_handlers.concat(context.event_handlers.before_delete[target_property_name]) }
                    if(context.event_handlers.before_change[target_property_name]) 
                        { before_handlers = before_handlers.concat(context.event_handlers.before_change[target_property_name]) }
                    var after_handlers = context.event_handlers.after_delete[""].concat(context.event_handlers.after_change[""])
                    if(context.event_handlers.after_delete[target_property_name]) 
                        { after_handlers = after_handlers.concat(context.event_handlers.after_delete[target_property_name]) }
                    if(context.event_handlers.after_change[target_property_name]) 
                        { after_handlers = after_handlers.concat(context.event_handlers.after_change[target_property_name]) }
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
                    var before_handlers = context.event_handlers.before_update[""].concat(context.event_handlers.before_change[""])
                    if(context.event_handlers.before_update[target_property_name]) 
                        { before_handlers = before_handlers.concat(context.event_handlers.before_update[target_property_name]) }
                    if(context.event_handlers.before_change[target_property_name]) 
                        { before_handlers = before_handlers.concat(context.event_handlers.before_change[target_property_name]) }
                    var after_handlers = context.event_handlers.after_update[""].concat(context.event_handlers.after_change[""])
                    if(context.event_handlers.after_update[target_property_name]) 
                        { after_handlers = after_handlers.concat(context.event_handlers.after_update[target_property_name]) }
                    if(context.event_handlers.after_change[target_property_name]) 
                        { after_handlers = after_handlers.concat(context.event_handlers.after_change[target_property_name]) }
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
                target: crudproxycell,
                new_val: void(0),
                old_val: target[target_property_name],
                new_value: void(0),
                old_value: target[target_property_name],
            }
            var before_handlers = context.event_handlers.before_delete[""].concat(context.event_handlers.before_change[""])
            if(context.event_handlers.before_delete[target_property_name]) 
                { before_handlers = before_handlers.concat(context.event_handlers.before_delete[target_property_name]) }
            if(context.event_handlers.before_change[target_property_name]) 
                { before_handlers = before_handlers.concat(context.event_handlers.before_change[target_property_name]) }
            var after_handlers = context.event_handlers.after_delete[""].concat(context.event_handlers.after_change[""])
            if(context.event_handlers.after_delete[target_property_name]) 
                { after_handlers = after_handlers.concat(context.event_handlers.after_delete[target_property_name]) }
            if(context.event_handlers.after_change[target_property_name]) 
                { after_handlers = after_handlers.concat(context.event_handlers.after_change[target_property_name]) }
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

    interface = new interface_constructor(target)
    crudproxycell = new Proxy(target, proxy_handler)
    return context.crudproxycell = crudproxycell
}