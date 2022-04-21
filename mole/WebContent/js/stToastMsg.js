/**
 *
 */
var stToastMsg = (function() {
	var instance;

	var that;
	var gToastMsg;
	
	function initiate() {
		return {
			showToastMsg: function(type, _resultCode) {
				var _toastMsg = that.add.group();
				var _panel = that.add.sprite(360.0, 400.0, 'ToastPanel', null, _toastMsg);
				_panel.anchor.x = 0.5;
				_panel.anchor.y = 0.5;
				
				var _icon = that.add.sprite(80.0, 400.0, 'ToastPanelNoticeIcon', null, _toastMsg);
				_icon.anchor.x = 0.5;
				_icon.anchor.y = 0.5;
				
				var _style;
				var _msg;
				var _t;
				if (type == 1000) {
					_style = { font: "bold 45px 나눔고딕", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
					_icon.visible = true;
					switch(_resultCode) {
					case -1:
						_msg = "세션 ID 발급 오류!(-1)";
						break;
					case 3101:
						_msg = "세션이 만료되었습니다.(3101)";
						break;
					case 3102:
						_msg = "DB요청 실패.(3102)";
						break;
					default:
						_msg = "알수없는 에러 발생.(" + _resultCode + ")";
						break;
					}
					_t = that.add.text(140.0, 405.0, _msg, _style, _toastMsg);
					_t.anchor.y = 0.5;
				}
				else if (type == 2000) {
					_style = { font: "bold 32px 나눔고딕", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
					_icon.visible = false;
					_msg = "한컴포인트 " + _resultCode +"(을)를 획득했습니다.";
					_t = that.add.text(360.0, 405.0, _msg, _style, _toastMsg);
					_t.anchor.x = 0.5;
					_t.anchor.y = 0.5;

				}

				gToastMsg = _toastMsg;
				
			},
			hideToastMsg: function() {
				gToastMsg.visible = false;
			}
		}
	}
	return {
		getInstance: function(_that) {
			if (!instance) {
				instance = initiate();
				that = _that;
			}
			return instance;
		}
	}
})();

