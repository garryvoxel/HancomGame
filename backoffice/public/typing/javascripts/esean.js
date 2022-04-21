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

        toQueryString(query) {
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
};

$(document).ready(function() {

    /* Login */
    var $login = $('#es-login');
    if ($login.length) {
        var rememberedUsername = fv.Cookie.getCookie('username');
        if (rememberedUsername) {
            $login.find('input[name="remember_username"]').prop('checked', true);
            $login.find('input[name="username"]').val(rememberedUsername);
        } else {
            $login.find('input[name="remember_username"]').prop('checked', false);
            $login.find('input[name="username"]').val('');
        }

        $login
            .find('#es-login-form')
            .submit(function(e) {
                var
                    $this = $(this),
                    url = $this.attr('action'),
                    args = {},
                    $username = $login.find('input[name="username"]'),
                    $password = $login.find('input[name="password"]'),  
                    username = $username.val(),
                    password = $password.val();

                if (! username || ! username.length) {
                    alert('아이디를 입력해주세요.');
                    $username.focus();
                    return false;
                }

                if (! password || ! password.length) {
                    alert('비밀번호를 입력해주세요.');
                    $password.focus();
                    return false;
                }

                if ($('input[name="remember_username"]').prop('checked')) {
                    fv.Cookie.setCookie('username', username, 7);
                } else {
                    fv.Cookie.setCookie('username', '', 0);
                }

                args.username = username;
                args.password = password;

                setDisabled(true);

                $.post(url, args, function(data) {
                    setDisabled(false);

                    if (! data || data.status != 'ok') {
                        alert('아이디나 비밀번호를 확인해주세요.');
                        return;
                    }

                    window.location.href = $('input[name="redirect_uri"]').val() || '/managers';
                }, 'jsonp')
                .fail(function(jqXHR, textStatus, errorThrown) {
                    setDisabled(false);
                    alert('아이디나 비밀번호를 확인해주세요.');
                    return;
                });

                function setDisabled(isDisabled) {
                    $('input[name="username"]').prop('disabled', isDisabled);
                    $('input[name="password"]').prop('disabled', isDisabled);
                    $('#form_submit').prop('disabled', isDisabled);
                }

                return false;
            });
    }

    /* Managers */
    var $managers = $('#es-managers');
    if ($managers.length) {
        $managers
            .find('#es-table-managers th i.ti-exchange-vertical')
            .click(function(e) {
                e.preventDefault();

                var $this = $(this);
                var $th = $this.closest('th');
                var orderBy = $th.attr('data-name');
                var sort = $th.attr('data-sort') || 'desc';

                if (sort === 'asc') {
                    sort = 'desc';
                } else {
                    sort = 'asc';
                }

                window.location.href = fv.Uri.getCurrentUri({
                    orderby: orderBy,
                    sort: sort
                });
            });

        $managers
            .find('#es-table-managers tbody tr')
            .click(function() {
                window.location.href = '/managers/' + $(this).attr('data-id') + '/edit';
            });

        $managers
            .find('#es-item-count')
            .change(function() {
                window.location.href = fv.Uri.getCurrentUri({
                    count: $(this).val()
                });
            });

        $managers
            .find('#es-field')
            .change(function() {
                var fieldId = $(this).val();

                switch (fieldId) {
                    case 0: $('#es-keyword').attr('placeholder', '전체'); break;
                    case 1: $('#es-keyword').attr('placeholder', '아이디'); break;
                    case 2: $('#es-keyword').attr('placeholder', '이름'); break;
                    default: break;
                }
            });

        $managers
            .find('#es-form-search')
            .submit(function(e) {
                e.preventDefault();

                window.location.href = fv.Uri.getCurrentUri({
                    field: $('#es-field').val(),
                    keyword: $('#es-keyword').val()
                });

                return false;
            });
    }

    /* Register a manager */
    var $managerRegister = $('#es-manager-register');
    if ($managerRegister.length) {
        $managerRegister
            .find('#es-manager-register-form')
            .submit(function() {
                var mode = window.location.pathname === '/managers/create' ? 'create' : 'edit';

                var $displayName = $('input[name="display_name"]');
                if (! $displayName.val()) {
                    alert('이름을 입력해주세요.');
                    $displayName.focus();
                    return false;
                }

                var $userId = $('input[name="username"]');
                if (! $userId.val()) {
                    alert('아이디를 입력해주세요.');
                    $userId.focus();
                    return false;
                }

                var $password = $('input[name="password"]');
                if (mode === 'create' && ! $password.val()) {
                    alert('비밀번호를 입력해주세요.');
                    $password.focus();
                    return false;
                }

                var passwordLength = $password.val().length;
                if (0 < passwordLength && passwordLength < 6) {
                    alert('비밀번호는 6자 이상 입력해주세요.');
                    $password.focus();
                    return false;
                }

                var $passwordConfirmation = $('input[name="password_confirmation"]');
                if (passwordLength > 0 && ! $passwordConfirmation.val()) {
                    alert('비밀번호를 한 번 더 입력해주세요.');
                    $passwordConfirmation.focus();
                    return false;
                }

                if (passwordLength > 0 && $password.val() !== $passwordConfirmation.val()) {
                    alert('비밀번호가 일치하지 않습니다.\n비밀번호를 확인해주세요.');
                    $passwordConfirmation.focus();
                    return false;
                }

                var permissions = '';

                $('.es-permission')
                    .each(function() {
                        permissions += $(this).prop('checked') ? '1' : '0';
                    });

                $('input[name="permissions"]').val(permissions);

                return true;
            });

        $managerRegister
            .find('#es-cancel')
            .click(function(e) {
                e.preventDefault();

                window.location.href = '/managers';
            });
    }
});