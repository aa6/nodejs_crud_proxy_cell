var proxy_handler = 
{
    ownKeys: function(target)
    {
        return target._keys.map(function(key){return "$" + key}).concat(Object.keys(target))
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
            case property_name === "length":
                return target._keys.length
            case property_name === "$":
                return target.$
            case typeof property_name == "string" && property_name.charAt(0) == "$":
                return target.$[property_name.substr(1)]
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
        pop: function()
        {
            var last_key = this._keys[this._keys.length - 1]
            var value = target.$[last_key]
            delete target.$[last_key]
            return value
        },
        on_insert: function()
        {
            var key, priority, preventive, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    preventive = arguments[0].preventive
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("insert", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        on_update: function()
        {
            var key, priority, preventive, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    preventive = arguments[0].preventive
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("update", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        on_delete: function()
        {
            var key, priority, preventive, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    preventive = arguments[0].preventive
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("delete", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        on_change: function()
        {
            var key, priority, preventive, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    preventive = arguments[0].preventive
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            handler_descriptor = ++target._handlers_counter
            target._on("insert", key, priority, preventive, fn, handler_descriptor)
            target._on("update", key, priority, preventive, fn, handler_descriptor)
            target._on("delete", key, priority, preventive, fn, handler_descriptor)
            return handler_descriptor
        },
        before_insert: function()
        {
            var key, priority, preventive = true, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("insert", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        before_update: function()
        {
            var key, priority, preventive = true, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("update", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        before_delete: function()
        {
            var key, priority, preventive = true, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("delete", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        before_change: function()
        {
            var key, priority, preventive = true, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            handler_descriptor = ++target._handlers_counter
            target._on("insert", key, priority, preventive, fn, handler_descriptor)
            target._on("update", key, priority, preventive, fn, handler_descriptor)
            target._on("delete", key, priority, preventive, fn, handler_descriptor)
            return handler_descriptor
        },
        after_insert: function()
        {
            var key, priority, preventive = false, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("insert", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        after_update: function()
        {
            var key, priority, preventive = false, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("update", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        after_delete: function()
        {
            var key, priority, preventive = false, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            target._on("delete", key, priority, preventive, fn, ++target._handlers_counter)
            return target._handlers_counter
        },
        after_change: function()
        {
            var key, priority, preventive = false, fn
            switch(typeof arguments[0])
            {
                case "function":
                    fn = arguments[0]
                    break
                case "object":
                    key = arguments[0].key
                    priority = arguments[0].priority
                    fn = arguments[1]
                    break
                default:
                    key = arguments[0]
                    fn = arguments[1]
            }
            handler_descriptor = ++target._handlers_counter
            target._on("insert", key, priority, preventive, fn, handler_descriptor)
            target._on("update", key, priority, preventive, fn, handler_descriptor)
            target._on("delete", key, priority, preventive, fn, handler_descriptor)
            return handler_descriptor
        },
        _trigger: function(event,preventive)
        {
            var priority, fns
            var order = [].concat(target._event_handlers[event.name].common.order)
            if(target._event_handlers[event.name].key_specific[event.key])
            {
                order = order.concat(target._event_handlers[event.name].key_specific[event.key].order)
            }
            order = order.sort().filter(function(el,key){ return order.indexOf(el) === key }) // unique and sorted
            var result = { allowed: true }
            event.preventive = preventive
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
                if(preventive)
                {
                    for(fn_index in fns)
                    {
                        if(fns[fn_index].preventive)
                        {

                            result.allowed = (fns[fn_index].fn(event) != false)
                            if(!result.allowed)
                            {
                                return result
                            }
                        }
                    }
                }
                else
                {
                    for(fn_index in fns)
                    {
                        if(fns[fn_index].preventive !== true)
                        {
                            fns[fn_index].fn(event)
                        }
                    }
                }
            }
            return result
        },
        _on: function(event_name, property_name, priority, preventive, handler, handler_descriptor)
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
                    fn: handler,
                    preventive: preventive,
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
                    fn: handler,
                    preventive: preventive,
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
        ksort: function(fn)
        {
            this._keys.sort(fn)
        },
        sort: function(fn)
        {
            if(fn == null)
            {
                fn = function(a,b) 
                {
                    a = a.toString()
                    b = b.toString()
                    return (a > b) ? 1 : (a < b ? -1 : 0)
                }
            }
            var that = this
            this._keys.sort(function(a,b)
            {
                return fn(that.$[a],that.$[b])
            })
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
        _keys: [],
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
            return target._keys
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
            if(property_name === Symbol.iterator)
            {
                var i = 0
                return function*() 
                {
                    while(i < target._keys.length)
                    {
                        yield target._data[target._keys[i++]]
                    }
                }
            }
            return target._data[property_name]
        },
        set: function(target, property_name, value, receiver)
        {
            var event = 
            {
                key: property_name,
                target: crudproxycell_instance,
                new_value: value,
                old_value: target._data[property_name],
            }
            // Setting (changing) a property generates events.
            if(typeof target._data[property_name] === "undefined" && typeof value != "undefined")
            {
                event.name = "insert"
                if(target._trigger(event,true).allowed === true)
                {
                    if(is_valid_numeric_key(property_name))
                    {
                        var property_name_parsed = parseInt(property_name)
                        if(property_name_parsed > target._max_numeric_key)
                        {
                            target._max_numeric_key = property_name_parsed
                        }
                    }
                    target._keys.push(property_name)
                    target._data[property_name] = event.new_value
                    target._trigger(event)
                }
            }
            else
            {
                event.name = (typeof value === "undefined") ? "delete" : "update"
                if(target._trigger(event,true).allowed === true)
                {
                    if(event.name == "delete" && typeof event.new_value == "undefined")
                    {
                        target._keys.splice(target._keys.indexOf(property_name),1)
                    }
                    target._data[property_name] = event.new_value
                    target._trigger(event)
                }
            }
        },
        deleteProperty: function(target, property_name)
        {
            var event = 
            {
                key: property_name,
                name: "delete",
                target: crudproxycell_instance,
                new_value: void(0),
                old_value: target._data[property_name],
            }
            if(target._trigger(event,true).allowed === true)
            {
                delete target._data[property_name]
                target._keys.splice(target._keys.indexOf(property_name),1)
                target._trigger(event)
            }
        },
    }
    target.$ = new Proxy(target, dollar_proxy)
    if(initial_data != null)
    {
        for(key in initial_data)
        {
            target._keys.push(key)
            target._data[key] = initial_data[key]
        }
    }
    crudproxycell_instance = new Proxy(target, proxy_handler)
    return crudproxycell_instance
}



module.exports = crudproxycell