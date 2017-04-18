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
var is_valid_numeric_key = function(num) { return /^[+-]?0|[1-9]\d*$/.test(num) }
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
        on_insert: function()
        {
            var key, priority, fn
            switch(arguments.length)
            {
                case 1:
                    fn = arguments[0]
                    break
                case 2:
                    key = arguments[0]
                    fn = arguments[1]
                    break
                default:
                    priority = arguments[1]
                    key = arguments[0]
                    fn = arguments[2]
            }
            target._on("insert", key, priority, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        on_update: function()
        {
            var key, priority, fn
            switch(arguments.length)
            {
                case 1:
                    fn = arguments[0]
                    break
                case 2:
                    key = arguments[0]
                    fn = arguments[1]
                    break
                default:
                    priority = arguments[1]
                    key = arguments[0]
                    fn = arguments[2]
            }
            target._on("update", key, priority, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        on_delete: function()
        {
            var key, priority, fn
            switch(arguments.length)
            {
                case 1:
                    fn = arguments[0]
                    break
                case 2:
                    key = arguments[0]
                    fn = arguments[1]
                    break
                default:
                    priority = arguments[1]
                    key = arguments[0]
                    fn = arguments[2]
            }
            target._on("delete", key, priority, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        on_change: function()
        {
            var key, priority, fn, handler_descriptor
            switch(arguments.length)
            {
                case 1:
                    fn = arguments[0]
                    break
                case 2:
                    key = arguments[0]
                    fn = arguments[1]
                    break
                default:
                    priority = arguments[1]
                    key = arguments[0]
                    fn = arguments[2]
            }
            handler_descriptor = ++target._handlers_counter
            target._on("insert", key, priority, fn, handler_descriptor)
            target._on("update", key, priority, fn, handler_descriptor)
            target._on("delete", key, priority, fn, handler_descriptor)
            return handler_descriptor
        },
        _trigger: function(event)
        {
            var priority, fns
            var order = [].concat(target._event_handlers[event.name].common.order)
            if(target._event_handlers[event.name].key_specific[event.key])
            {
                order = order.concat(target._event_handlers[event.name].key_specific[event.key].order)
            }
            order = order.sort().filter(function(el,key){ return order.indexOf(el) === key }) // unique and sorted
            result = { allowed: true }
            for(order_index in order)
            {
                priority = order[order_index]
                fns = []
                if(target._event_handlers[event.name].common.fns[priority])
                {
                    fns = fns.concat(target._event_handlers[event.name].common.fns[priority])
                }
                if(target._event_handlers[event.name].key_specific[event.key]
                && target._event_handlers[event.name].key_specific[event.key].fns[priority])
                {
                    fns = fns.concat(target._event_handlers[event.name].key_specific[event.key].fns[priority])
                }
                for(fn_index in fns)
                {
                    result.allowed = (fns[fn_index].fn(event) != false)
                    if(!result.allowed)
                    {
                        return result
                    }
                }
            }
            return result
        },
        _on: function(event_name, property_name, priority, handler, handler_descriptor)
        {
            if(typeof priority != "number")
            {
                priority = isNaN(priority = parseInt(priority)) ? 0 : priority
            }
            if(property_name == null)
            {
                if(target._event_handlers[event_name].common.order.indexOf(priority) == -1)
                {
                    target._event_handlers[event_name].common.order.push(priority)
                    target._event_handlers[event_name].common.order.sort()
                    target._event_handlers[event_name].common.fns[priority] = []
                }
                target._event_handlers[event_name].common.fns[priority].push(
                { 
                    hd: handler_descriptor, 
                    fn: handler 
                })
            }
            else
            {
                if(target._event_handlers[event_name].key_specific[property_name] == null)
                {
                    target._event_handlers[event_name].key_specific[property_name] = { order: [], fns: {} }
                }
                if(target._event_handlers[event_name].key_specific[property_name].order.indexOf(priority) == -1)
                {
                    target._event_handlers[event_name].key_specific[property_name].order.push(priority)
                    target._event_handlers[event_name].key_specific[property_name].order.sort()
                    target._event_handlers[event_name].key_specific[property_name].fns[priority] = []
                }
                target._event_handlers[event_name].key_specific[property_name].fns[priority].push(
                { 
                    hd: handler_descriptor, 
                    fn: handler 
                })
            }
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
            insert: { common: { order: [], fns: {} }, key_specific: {} },
            update: { common: { order: [], fns: {} }, key_specific: {} },
            delete: { common: { order: [], fns: {} }, key_specific: {} },
            change: { common: { order: [], fns: {} }, key_specific: {} },
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
                new_value: value,
                old_value: target._data[property_name],
            }
            // Setting (changing) a property generates events.
            if(typeof target._data[property_name] === "undefined")
            {
                event.name = "insert"
                if(target._trigger(event).allowed === true)
                {
                    if(is_valid_numeric_key(property_name))
                    {
                        var property_name_parsed = parseInt(property_name)
                        if(property_name_parsed > target._max_numeric_key)
                        {
                            target._max_numeric_key = property_name_parsed
                        }
                    }
                    target._data[property_name] = event.new_value
                }
            }
            else
            {
                event.name = (typeof value === "undefined") ? "delete" : "update"
                if(target._trigger(event).allowed === true)
                {
                    target._data[property_name] = event.new_value
                }
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
                new_value: void(0),
                old_value: target._data[property_name],
            }
            if(target._trigger(event).allowed === true)
            {
                delete target._data[property_name]
            }
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