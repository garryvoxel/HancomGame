var fv = {
    Uri: {
        getCurrentUri: function(args) {
            var queryString = fv.Uri.toQueryString(
                    fv.Uri.getQuery(args)
                );
            
            return window.location.protocol + '//'
                + window.location.host
                + window.location.pathname
                + (queryString ? '?' + queryString : '');
        },
    
        getQuery: function(args) {
            var
                items = {},
                queries = {};
    
            args = args || {};
    
            if (window.location.search) {
                items = window.location.search.substr(1).split('&');
            }
    
            for (var key in items) {
                var fragments = items[key].split('=');
                queries[fragments[0]] = fragments[1];
            }
    
            for (var key in args) {
                queries[key] = args[key];
            }
    
            return queries;
        },

        toQueryString: function(query) {
            var array = [];

            query = query || {};

            for (var key in query) {
                array.push(
                    encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
                );
            }

            return array.join('&');
        }
    },

    Cookie: {
        setCookie: function(cname, cvalue, days) {
            var expireAt = new Date();
            expireAt.setTime(expireAt.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "expires="+ expireAt.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },

        getCookie: function(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }

            return "";
        }
    }
}