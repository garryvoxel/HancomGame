var session_id_login_url;

var request_write_typing_setup_url;
var request_request_typing_setup_url;
var request_write_typing_pos_practice_url;
var request_request_typing_pos_practice_url;
var request_write_typing_word_practice_url;
var request_request_typing_word_practice_url;
var request_write_typing_long_word_practice_url;
var request_request_typing_long_word_practice_url;
var request_write_typing_continue_play_url;
var request_request_typing_continue_play_url;
var request_write_game_result_url;
var request_request_game_result_url;

var request_write_update_point_url;
var request_send_mail_url;
var request_start_end_game_log_url;

var request_write_test_result_url;
var request_request_test_result_url;

var request_read_taja_contents_url;
var request_read_taja_contents_data_url;

var request_write_two_word_finger_speed;
var request_write_two_word_velocity;
var request_write_two_word_acc;
var request_write_two_typing_speed;

var request_write_typing_speed;

// Data - Request
var reqSessionIDLoginData = {
	"session_id" : "Test001",
};

// 설정 저장하기
var reqWriteTypingSetupData = {
	uuid : 21,
	keyboard1 : 1,
	keyboard2 : 1,
	language : 0,
	sound : 50,
	finger_guide : 1
};

// 설정 불러오기
var reqRequestTypingSetupData = {
	uuid : 21,
};

// 자리 연습 저장하기
var reqWritePosPracticeData = {
	uuid : 21,
	step : 0,
	language : 0,
	is_complete : 0
};

// 자리 연습 불러오기
var reqRequestPosPracticeData = {
	uuid : 21,
};

// 낱말 연습 저장하기
var reqWriteWordPracticeData = {
	uuid : 21,
	step : 0,
	language : 0,
	is_complete : 0
};

// 낱말 연습 불러오기
var reqRequestWordPracticeData = {
	uuid : 21,
};

// 긴글 연습 저장하기
var reqWriteLongWordPracticeData = {
	uuid : 21,
	step : 0,
	content : 0,
	language : 0,
	is_practice : 0,
	is_verify : 0
};

// 긴글 연습 불러오기
var reqRequestLongWordPracticeData = {
	uuid : 21,
};

// 긴글 이어하기 저장하기
var reqWriteLongWordContinueData = {
	uuid : 21,
	language : 0,
	kind : 0,
	type : 0,
	pos : 0,
	acc : 0
};

// 긴글 연습 이어하기 불러오기
var reqRequestLongWordContinueData = {
	uuid : 21,
};

// 스코어 저장하기
var reqWriteGameResultData = {
	uuid : 21,
	score : 0,
	nick_name : "nickName"
};

// 스코어 불러오기
var reqRequestGameResultData = {
	uuid : 21,
};

// 한컴 포인트 저장하기
var reqWriteUpdatePointData = {
	uuid : 21,
	point : 0,
	nick_name : "닉네임",
	game_code : 10003,
	date : "2019-03-09 17:41:02"
};

// 한컴 메일 보내기
var reqSendMailData = {
	uuid : 21,
	nick_name : "닉네임",
	to_mail : "elwind@hancom.com",
	mail_title : "[메일]말랑마랑",
	content : "메일 보내기 테스트입니다"
};

// 한컴 시작끝 로그
var reqStartEndGameLogData = {
	uuid : 21,
	nick_name : "닉네임",
	typing_kind : 0,
	middle_kind : 0,
	small_kind : 0,
	long_word_id : 0,
	is_clear_mode : 0,
	game_start_time : "2019-03-09 17:41:02",
	game_end_time : "2019-03-09 17:41:02"
};

// 타수 속도 저장하기
var reqWriteTypingSpeedData = {
	uuid : 21,
	language : 0,
	speed : 0
};

// 두벌식 글쇠별 타수 저장하기
var reqWriteTwoTypingSpeedData = {
	uuid : 21,
	language : 0,
	idx_array : "",
	count_array : ""
};

// 두벌식/쿼티 글쇠별 손가락 빠르기 저장하기
var reqWriteTwoWordFingerSpeedData = {
	uuid : 21,
	language : 0,
	idx_array : [],
	input_total_array : [],
	total_speed_array : []
};

// 두벌식/쿼티 글쇠별 정확도 저장하기
var reqWriteTwoWordAccData = {
	uuid : 21,
	language : 0,
	idx_array : [],
	input_total_array : [],
	total_acc_array : []
};

// 두벌식/쿼티 글쇠별 속도 저장하기
var reqWriteTwoWordVelocityData = {
	uuid : 21,
	language : 0,
	idx_array : [],
	input_total_array : [],
	total_velocity_array : []
};

// 타자 검정 결과 저장하기
var reqWriteTestResultData = {
	uuid : 21,
	title : "",
	speed : 0,
	acc : 0,
	page_ing : 0,
	page_end : 0,
	regit_date : "2019-03-09"
};

// 타자 검정 결과 불러오기
var reqRequestTestResultData = {
	uuid : 21
};

// 컨텐츠 제목 불러오기
var reqReadTajaContentsData = {
	category : 1,
	type : 2
};

// 컨텐츠 데이터 불러오기
var reqReadTajaContentsDataData = {
	idx : 1
};

// Data - ResponseData
var resSessionIDLoginData = {
	"result" : 0,
	"uuid" : 1,
	"nick_name" : "nickName000",
	"character_type" : 0,
	"target_typing_speed" : 150,
	"target_typing_accuracy" : 95,
	"school" : "초등학교"
};

// AjaxManager instance
var AjaxManager = (function() {
	var instance;

	function init() {
		return {
			config : Config.getInstance(),
			setURL : function() {
				session_id_login_url = this.config.getGameAPIURL()
						+ "request_userinfo2";

				request_write_typing_setup_url = this.config.getGameAPIURL()
						+ "typing_practice/write_typing_setup";
				request_request_typing_setup_url = this.config.getGameAPIURL()
						+ "typing_practice/request_typing_setup";
				request_write_typing_pos_practice_url = this.config
						.getGameAPIURL()
						+ "typing_practice/write_typing_pos_practice";
				request_request_typing_pos_practice_url = this.config
						.getGameAPIURL()
						+ "typing_practice/request_typing_pos_practice";
				request_write_typing_word_practice_url = this.config
						.getGameAPIURL()
						+ "typing_practice/write_typing_word_practice";
				request_request_typing_word_practice_url = this.config
						.getGameAPIURL()
						+ "typing_practice/request_typing_word_practice";
				request_write_typing_long_word_practice_url = this.config
						.getGameAPIURL()
						+ "typing_practice/write_typing_long_word_practice";
				request_request_typing_long_word_practice_url = this.config
						.getGameAPIURL()
						+ "typing_practice/request_typing_long_word_practice";
				request_write_typing_continue_play_url = this.config
						.getGameAPIURL()
						+ "typing_practice/write_typing_continue_play";
				request_request_typing_continue_play_url = this.config
						.getGameAPIURL()
						+ "typing_practice/request_typing_continue_play";
				request_write_game_result_url = this.config.getGameAPIURL()
						+ "typing_practice/write_game_result";
				request_request_game_result_url = this.config.getGameAPIURL()
						+ "typing_practice/request_game_result";

				request_write_update_point_url = this.config.getGameAPIURL()
						+ "update_point";
				request_send_mail_url = this.config.getGameAPIURL()
						+ "typing_practice/send_mail";
				request_start_end_game_log_url = this.config.getGameAPIURL()
						+ "typing_practice/start_end_game_log";

				request_write_test_result_url = this.config.getGameAPIURL()
						+ "typing_practice/write_check_result";
				request_request_test_result_url = this.config.getGameAPIURL()
						+ "typing_practice/read_check_result";

				request_read_taja_contents_url = this.config.getGameAPIURL()
						+ "typing_practice/read_taja_contents";
				request_read_taja_contents_data_url = this.config
						.getGameAPIURL()
						+ "typing_practice/read_taja_contents_data";

				request_write_two_word_finger_speed = this.config
						.getGameAPIURL()
						+ "typing_practice/write_two_word_finger_speed";
				request_write_two_word_velocity = this.config.getGameAPIURL()
						+ "typing_practice/write_two_word_velocity";
				request_write_two_word_acc = this.config.getGameAPIURL()
						+ "typing_practice/write_two_word_acc";
				request_write_two_typing_speed = this.config.getGameAPIURL()
						+ "typing_practice/write_two_typing_speed";
				request_write_typing_speed = this.config.getGameAPIURL()
						+ "typing_practice/write_typing_speed";

			},
			// ================================== Request
			// ===========================================
			netReqSessionIDLogin : function(aSessionID, aSuccessCallBack,
					aFailCallBack) {
				reqSessionIDLoginData.session_id = aSessionID;
				this.netReqAjax(session_id_login_url, reqSessionIDLoginData,
						instance.netResSessionIDLogin, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 설정 저장하기
			netReqWriteTypingSetup : function(aUUID, aKeyboard1, aKeyboard2,
					aLanguage, aSound, aFingerGuide, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteTypingSetupData.uuid = aUUID;
				reqWriteTypingSetupData.keyboard1 = aKeyboard1;
				reqWriteTypingSetupData.keyboard2 = aKeyboard2;
				reqWriteTypingSetupData.language = aLanguage;
				reqWriteTypingSetupData.sound = aSound;
				reqWriteTypingSetupData.finger_guide = aFingerGuide;

				this.netReqAjax(request_write_typing_setup_url,
						reqWriteTypingSetupData,
						instance.netResWriteTypingSetup, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 설정 불러오기
			netReqRequestTypingSetup : function(aUUID, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestTypingSetupData.uuid = aUUID;

				this.netReqAjax(request_request_typing_setup_url,
						reqRequestTypingSetupData,
						instance.netResRequestTypingSetup, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 자리 연습 저장하기
			netReqWriteTypingPosPractice : function(aUUID, aStep, aLanguage,
					aIsComplete, aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWritePosPracticeData.uuid = aUUID;
				reqWritePosPracticeData.step = aStep;
				reqWritePosPracticeData.language = aLanguage;
				reqWritePosPracticeData.is_complete = aIsComplete;

				this.netReqAjax(request_write_typing_pos_practice_url,
						reqWritePosPracticeData,
						instance.netResWriteTypingPosPractice,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 자리 연습 불러오기
			netReqRequestTypingPosPractice : function(aUUID, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestPosPracticeData.uuid = aUUID;

				this.netReqAjax(request_request_typing_pos_practice_url,
						reqRequestPosPracticeData,
						instance.netResRequestTypingPosPractice,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 낱말 연습 저장하기
			netReqWriteTypingWordPractice : function(aUUID, aStep, aLanguage,
					aIsComplete, aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteWordPracticeData.uuid = aUUID;
				reqWriteWordPracticeData.step = aStep;
				reqWriteWordPracticeData.language = aLanguage;
				reqWriteWordPracticeData.is_complete = aIsComplete;

				this.netReqAjax(request_write_typing_word_practice_url,
						reqWriteWordPracticeData,
						instance.netResWriteTypingWordPractice,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 낱말 연습 불러오기
			netReqRequestTypingWordPractice : function(aUUID, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestWordPracticeData.uuid = aUUID;

				this.netReqAjax(request_request_typing_word_practice_url,
						reqRequestWordPracticeData,
						instance.netResRequestTypingWordPractice,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 저장하기
			netReqWriteTypingLongWordPractice : function(aUUID, aStep,
					aContent, aLanguage, aIsPractice, aIsVerify,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteLongWordPracticeData.uuid = aUUID;
				reqWriteLongWordPracticeData.step = aStep;
				reqWriteLongWordPracticeData.content = aContent;
				reqWriteLongWordPracticeData.language = aLanguage;
				reqWriteLongWordPracticeData.is_practice = aIsPractice;
				reqWriteLongWordPracticeData.is_verify = aIsVerify;

				this.netReqAjax(request_write_typing_long_word_practice_url,
						reqWriteLongWordPracticeData,
						instance.netResWriteTypingLongWordPractice,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 불러오기
			netReqRequestTypingLongWordPractice : function(aUUID,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestLongWordPracticeData.uuid = aUUID;
				// reqRequestLongWordPracticeData: uuid
				// console.log('긴글 연습 불러오기Req');
				this.netReqAjax(request_request_typing_long_word_practice_url,
						reqRequestLongWordPracticeData,
						instance.netResRequestTypingLongWordPractice,
						this.netResError, aSuccessCallBack, aFailCallBack);

			},

			// 긴글 연습 이어하기 저장하기
			netReqWriteTypingLongWordContinue : function(aUUID, aLanguage,
					aKind, aType, aPos, aAcc, aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteLongWordContinueData.uuid = aUUID;
				reqWriteLongWordContinueData.language = aLanguage;
				reqWriteLongWordContinueData.kind = aKind;
				reqWriteLongWordContinueData.type = aType;
				reqWriteLongWordContinueData.pos = aPos;
				reqWriteLongWordContinueData.acc = aAcc;

				this.netReqAjax(request_write_typing_continue_play_url,
						reqWriteLongWordContinueData,
						instance.netResWriteTypingLongWordContinue,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 이어하기 불러오기
			netReqRequestTypingLongWordContinue : function(aUUID,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestLongWordContinueData.uuid = aUUID;

				this.netReqAjax(request_request_typing_continue_play_url,
						reqRequestLongWordContinueData,
						instance.netResRequestTypingLongWordContinue,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 스코어 저장하기
			netReqWriteGameResult : function(aUUID, aScore, aNickName,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteGameResultData.uuid = aUUID;
				reqWriteGameResultData.score = aScore;
				reqWriteGameResultData.nick_name = aNickName;

				var jsonPack = {};
				var ciphertext = CryptoJS.AES.encrypt(JSON
						.stringify(reqWriteGameResultData),
						"!eogksalsrnrakstp@#");
				jsonPack.packet = "" + ciphertext;

				// this.netReqAjax(request_write_game_result_url,
				// reqWriteGameResultData, instance.netResWriteGameResult,
				// this.netResError, aSuccessCallBack, aFailCallBack);
				this.netReqAjax(request_write_game_result_url, jsonPack,
						instance.netResWriteGameResult, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 스코어 불러오기
			netReqRequestGameResult : function(aUUID, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestGameResultData.uuid = aUUID;

				this.netReqAjax(request_request_game_result_url,
						reqRequestGameResultData,
						instance.netResRequestGameResult, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 한컴 스코어 저장하기
			netReqWriteUpdatePoint : function(aUUID, aNickName, aPoint,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteUpdatePointData.uuid = aUUID;
				reqWriteUpdatePointData.point = aPoint;
				reqWriteUpdatePointData.game_code = 10003;
				reqWriteUpdatePointData.nick_name = aNickName;

				var date = new Date();
				date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
						+ date.getDate() + " " + date.getHours() + ":"
						+ date.getMinutes() + ":" + date.getSeconds();

				reqWriteUpdatePointData.date = date;
				console.log("reqWriteUpdatePointData.date ::: "
						+ reqWriteUpdatePointData.date);
				var jsonPack = {};
				var ciphertext = CryptoJS.AES.encrypt(JSON
						.stringify(reqWriteUpdatePointData),
						"!eogksalsrnrakstp@#");
				jsonPack.packet = "" + ciphertext;
				console.log("AjaxManager Call!!!!!!!!!!!!!!!!!!!");
				this.netReqAjax(request_write_update_point_url, jsonPack,
						instance.netResWriteUpdatePoint, this.netResError,
						aSuccessCallBack, aFailCallBack);
				// this.netReqAjax(request_write_update_point_url,
				// reqWriteUpdatePointData, instance.netResWriteUpdatePoint,
				// this.netResError, aSuccessCallBack, aFailCallBack);
			},
			// 한컴 메일 보내기

      netReqSendMail : function(aUUID, aNickName, aToMail, aMailTitle,
					aContent, aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqSendMailData.uuid = aUUID;
				reqSendMailData.nick_name = aNickName;
				reqSendMailData.to_mail = aToMail;
				reqSendMailData.mail_title = aMailTitle;
				reqSendMailData.content = aContent;

				this.netReqAjax(request_send_mail_url, reqSendMailData,
						instance.netResSendMail, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 한컴 시작끝 로그 보내기
			netReqStartEndGameLog : function(aUUID, aNickName, aTypingKind,
					aMiddleKind, aSmallKind, aLongWordId, aIsClearMode,
					aStartTime, aEndTime, aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqStartEndGameLogData.uuid = aUUID;
				reqStartEndGameLogData.nick_name = aNickName;
				reqStartEndGameLogData.typing_kind = aTypingKind;
				reqStartEndGameLogData.middle_kind = aMiddleKind;
				reqStartEndGameLogData.small_kind = aSmallKind;
				reqStartEndGameLogData.long_word_id = aLongWordId;
				reqStartEndGameLogData.is_clear_mode = aIsClearMode;
				reqStartEndGameLogData.game_start_time = aStartTime;
				reqStartEndGameLogData.game_end_time = aEndTime;

				this.netReqAjax(request_start_end_game_log_url,
						reqStartEndGameLogData, instance.netResStartEndGameLog,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 타자 검정 결과 저장하기
			netReqWriteTestResult : function(aUUID, aTitle, aSpeed, aAcc,
					aPageIng, aPageEnd, aRegitDate, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteTestResultData.uuid = aUUID;
				reqWriteTestResultData.title = aTitle;
				reqWriteTestResultData.speed = aSpeed;
				reqWriteTestResultData.acc = aAcc;
				reqWriteTestResultData.page_ing = aPageIng;
				reqWriteTestResultData.page_end = aPageEnd;
				reqWriteTestResultData.regit_date = aRegitDate;

				this.netReqAjax(request_write_test_result_url,
						reqWriteTestResultData, instance.netResWriteTestResult,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 타자 검정 결과 불러오기
			netReqRequestTestResult : function(aUUID, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				reqRequestTestResultData.uuid = aUUID;

				this.netReqAjax(request_request_test_result_url,
						reqRequestTestResultData,
						instance.netResRequestTestResult, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 컨텐츠 제목 불러오기
			netReqReadTajaContents : function(aCategory, aType,
					aSuccessCallBack, aFailCallBack) {
				reqReadTajaContentsData.category = aCategory;
				reqReadTajaContentsData.type = aType;

				this.netReqAjax(request_read_taja_contents_url,
						reqReadTajaContentsData,
						instance.netResReadTajaContents, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 컨텐츠 데이터 불러오기
			netReqReadTajaContentsData : function(aIdx, aSuccessCallBack,
					aFailCallBack) {
				reqReadTajaContentsDataData.idx = aIdx;

				this.netReqAjax(request_read_taja_contents_data_url,
						reqReadTajaContentsDataData,
						instance.netResReadTajaContentsData, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 타수 속도 저장하기
			netReqWriteTypingSpeed : function(aUUID, aLanguage, aSpeed,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				reqWriteTypingSpeedData.uuid = aUUID;
				reqWriteTypingSpeedData.language = aLanguage;
				reqWriteTypingSpeedData.speed = aSpeed;

				this.netReqAjax(request_write_typing_speed,
						reqWriteTypingSpeedData,
						instance.netResWriteTypingSpeed, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 타수 저장하기
			netReqWriteTwoTypingSpeed : function(aUUID, aLanguage, aCountArray,
					aSuccessCallBack, aFailCallBack) {
				if (aUUID === 0)
					return;

				var idxText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						idxText += (i + 1) + ",";
					else
						idxText += (i + 1);
				}

				var countText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						countText += aCountArray[i] + ",";
					else
						countText += aCountArray[i];
				}

				reqWriteTwoTypingSpeedData.uuid = aUUID;
				reqWriteTwoTypingSpeedData.language = aLanguage;
				reqWriteTwoTypingSpeedData.idx_array = idxText;
				reqWriteTwoTypingSpeedData.count_array = countText;

				this.netReqAjax(request_write_two_typing_speed,
						reqWriteTwoTypingSpeedData,
						instance.netResWriteTwoTypingSpeed, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 손가락 빠르기 저장하기
			netReqWriteTwoWordFingerSpeed : function(aUUID, aLanguage,
					aInputTotalArray, aTotalSpeedArray, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				var idxText = "";
				for (var i = 0; i < 8; i++) {
					if (i < 7)
						idxText += (i + 1) + ",";
					else
						idxText += (i + 1);
				}

				var inputTotalText = "";
				for (var i = 0; i < 8; i++) {
					if (i < 7)
						inputTotalText += aInputTotalArray[i] + ",";
					else
						inputTotalText += aInputTotalArray[i];
				}

				var totalSpeedText = "";
				for (var i = 0; i < 8; i++) {
					if (i < 7)
						totalSpeedText += aTotalSpeedArray[i] + ",";
					else
						totalSpeedText += aTotalSpeedArray[i];
				}

				reqWriteTwoWordFingerSpeedData.uuid = aUUID;
				reqWriteTwoWordFingerSpeedData.language = aLanguage;
				reqWriteTwoWordFingerSpeedData.idx_array = idxText;
				reqWriteTwoWordFingerSpeedData.input_total_array = inputTotalText;
				reqWriteTwoWordFingerSpeedData.total_speed_array = totalSpeedText;

				this.netReqAjax(request_write_two_word_finger_speed,
						reqWriteTwoWordFingerSpeedData,
						instance.netResWriteTwoWordFingerSpeed,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 정확도 저장하기
			netReqWriteTwoWordAcc : function(aUUID, aLanguage,
					aInputTotalArray, aTotalAccArray, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				var idxText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						idxText += (i + 1) + ",";
					else
						idxText += (i + 1);
				}

				var inputTotalText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						inputTotalText += aInputTotalArray[i] + ",";
					else
						inputTotalText += aInputTotalArray[i];
				}

				var totalAccText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						totalAccText += aTotalAccArray[i] + ",";
					else
						totalAccText += aTotalAccArray[i];
				}

				reqWriteTwoWordAccData.uuid = aUUID;
				reqWriteTwoWordAccData.language = aLanguage;
				reqWriteTwoWordAccData.idx_array = idxText;
				reqWriteTwoWordAccData.input_total_array = inputTotalText;
				reqWriteTwoWordAccData.total_acc_array = totalAccText;

				this.netReqAjax(request_write_two_word_acc,
						reqWriteTwoWordAccData, instance.netResWriteTwoWordAcc,
						this.netResError, aSuccessCallBack, aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 속도 저장하기
			netReqWriteTwoWordVelocity : function(aUUID, aLanguage,
					aInputTotalArray, aTotalVelocityArray, aSuccessCallBack,
					aFailCallBack) {
				if (aUUID === 0)
					return;

				var idxText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						idxText += (i + 1) + ",";
					else
						idxText += (i + 1);
				}

				var inputTotalText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						inputTotalText += aInputTotalArray[i] + ",";
					else
						inputTotalText += aInputTotalArray[i];
				}

				var totalVelocityText = "";
				for (var i = 0; i < 46; i++) {
					if (i < 45)
						totalVelocityText += aTotalVelocityArray[i] + ",";
					else
						totalVelocityText += aTotalVelocityArray[i];
				}

				reqWriteTwoWordVelocityData.uuid = aUUID;
				reqWriteTwoWordVelocityData.language = aLanguage;
				reqWriteTwoWordVelocityData.idx_array = idxText;
				reqWriteTwoWordVelocityData.input_total_array = inputTotalText;
				reqWriteTwoWordVelocityData.total_velocity_array = totalVelocityText;

				this.netReqAjax(request_write_two_word_velocity,
						reqWriteTwoWordVelocityData,
						instance.netResWriteTwoWordVelocity, this.netResError,
						aSuccessCallBack, aFailCallBack);
			},
//			request와드
			netReqAjax : function(aUrl, aJsonObjectData, aResCallBack,
					aErrorCallBack, aSuccessCallBack, aFailCallBack) {
//				if (aUrl === 'https://dev-api.malangmalang.com/game/typing_practice/request_typing_long_word_practice') {// test																														// code
//					$.ajax({
//								type : 'get',
//								url : 'http://localhost:3000/request_typing_long_word_practice',
//								data : aJsonObjectData,
//								success : function(data) {
//									aResCallBack(aUrl, data, aSuccessCallBack,
//											aFailCallBack);
//								},
//								error : function(response, status, error) {
//									aErrorCallBack(aUrl, response, status,
//											error, aFailCallBack);
//								}
//							});
//				} else if(aUrl==='https://dev-api.malangmalang.com/game/typing_practice/write_typing_long_word_practice'){
//					$.ajax({
//						type : 'put',
//						url : 'http://localhost:3000/request_typing_long_word_practice',
//						data : aJsonObjectData,
//						success : function(data) {
//							aResCallBack(aUrl, data, aSuccessCallBack,
//									aFailCallBack);
//						},
//						error : function(response, status, error) {
//							aErrorCallBack(aUrl, response, status,
//									error, aFailCallBack);
//						}
//					});
//				}else {
					$.ajax({
						type : 'post',
						url : aUrl,
						data : aJsonObjectData,
						success : function(data) {
							aResCallBack(aUrl, data, aSuccessCallBack,
									aFailCallBack);
						},
						error : function(response, status, error) {
							aErrorCallBack(aUrl, response, status, error,
									aFailCallBack);
						}
					});

//				}

				// console.log("AjaxManager :: netReqAjax -> [url] " + aUrl
				// 		+ " [Data] " + JSON.stringify(aJsonObjectData));

			},
			// ======================================================================================

			// ================================== Response
			// ==========================================
			netResSessionIDLogin : function(aLoginURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aLoginURL, aData,
						instance.setResSessionIDLogin, aSuccessCallBack,
						aFailCallBack);
			},

			// 설정 저장하기
			netResWriteTypingSetup : function(aWriteTypingSetupURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTypingSetupURL, aData,
						instance.setWriteTypingSetup, aSuccessCallBack,
						aFailCallBack);
			},

			// 설정 불러오기
			netResRequestTypingSetup : function(aRequestTypingSetupURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aRequestTypingSetupURL, aData,
						instance.setRequestTypingSetup, aSuccessCallBack,
						aFailCallBack);
			},

			// 자리 연습 저장하기
			netResWriteTypingPosPractice : function(aWriteTypingPosPracticeURL,
					aData, aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTypingPosPracticeURL, aData,
						instance.setWriteTypingPosPractice, aSuccessCallBack,
						aFailCallBack);
			},

			// 자리 연습 불러오기
			netResRequestTypingPosPractice : function(
					aRequestTypingPosPracticeURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aRequestTypingPosPracticeURL, aData,
						instance.setRequestTypingPosPractice, aSuccessCallBack,
						aFailCallBack);
			},

			// 낱말 연습 저장하기
			netResWriteTypingWordPractice : function(
					aWriteTypingWordPracticeURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aWriteTypingWordPracticeURL, aData,
						instance.setWriteTypingWordPractice, aSuccessCallBack,
						aFailCallBack);
			},

			// 낱말 연습 불러오기
			netResRequestTypingWordPractice : function(
					aRequestTypingWordPracticeURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aRequestTypingWordPracticeURL, aData,
						instance.setRequestTypingWordPractice,
						aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 저장하기
			netResWriteTypingLongWordPractice : function(
					aWriteTypingLongWordPracticeURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aWriteTypingLongWordPracticeURL, aData,
						instance.setWriteTypingLongWordPractice,
						aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 불러오기
			netResRequestTypingLongWordPractice : function(
					aRequestTypingLongWordPracticeURL, aData, aSuccessCallBack,
					aFailCallBack) {
				// console.log('긴글 연습 불러오기:netResRequestTypingLongWordPractice\n',
				//		aRequestTypingLongWordPracticeURL);
				instance.netResData(aRequestTypingLongWordPracticeURL, aData,
						instance.setRequestTypingLongWordPractice,
						aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 이어하기 저장하기
			netResWriteTypingLongWordContinue : function(
					aWriteTypingLongWordContinueURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aWriteTypingLongWordContinueURL, aData,
						instance.setWriteTypingLongWordContinue,
						aSuccessCallBack, aFailCallBack);
			},

			// 긴글 연습 이어하기 불러오기
			netResRequestTypingLongWordContinue : function(
					aRequestTypingLongWordContinueURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aRequestTypingLongWordContinueURL, aData,
						instance.setRequestTypingLongWordContinue,
						aSuccessCallBack, aFailCallBack);
			},

			// 스코어 저장하기
			netResWriteGameResult : function(aWriteGameResultURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteGameResultURL, aData,
						instance.setWriteGameResult, aSuccessCallBack,
						aFailCallBack);
			},

			// 스코어 불러오기
			netResRequestGameResult : function(aRequestGameResultURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aRequestGameResultURL, aData,
						instance.setRequestGameResult, aSuccessCallBack,
						aFailCallBack);
			},

			// 한컴 포인트 저장하기
			netResWriteUpdatePoint : function(aWriteUpdatePointURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteUpdatePointURL, aData,
						instance.setWriteUpdatePoint, aSuccessCallBack,
						aFailCallBack);
			},

			// 한컴 메일 보내기
			netResSendMail : function(aSendMailURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aSendMailURL, aData, instance.setSendMail,
						aSuccessCallBack, aFailCallBack);
			},

			// 한컴 시작끝 로그 보내기
			netResStartEndGameLog : function(aStartEndGameLogURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aStartEndGameLogURL, aData,
						instance.setStartEndGameLog, aSuccessCallBack,
						aFailCallBack);
			},

			// 타자 검정 결과 저장하기
			netResWriteTestResult : function(aWriteTestResultURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTestResultURL, aData,
						instance.setWriteTestResult, aSuccessCallBack,
						aFailCallBack);
			},

			// 타자 검정 결과 불러오기
			netResRequestTestResult : function(aRequestTestResultURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aRequestTestResultURL, aData,
						instance.setRequestTestResult, aSuccessCallBack,
						aFailCallBack);
			},

			// 컨텐츠 제목 불러오기
			netResReadTajaContents : function(aReadTajaContentsURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aReadTajaContentsURL, aData,
						instance.setReadTajaContents, aSuccessCallBack,
						aFailCallBack);
			},

			// 컨텐츠 데이터 불러오기
			netResReadTajaContentsData : function(aReadTajaContentsDataURL,
					aData, aSuccessCallBack, aFailCallBack) {
				instance.netResData(aReadTajaContentsDataURL, aData,
						instance.setReadTajaContentsData, aSuccessCallBack,
						aFailCallBack);
				// console.log(aData);
			},

			// 타수 속도 저장하기
			netResWriteTypingSpeed : function(aWriteTypingSpeedURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTypingSpeedURL, aData,
						instance.setWriteTypingSpeed, aSuccessCallBack,
						aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 타수 저장하기
			netResWriteTwoTypingSpeed : function(aWriteTwoTypingSpeedURL,
					aData, aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTwoTypingSpeedURL, aData,
						instance.setWriteTwoTypingSpeed, aSuccessCallBack,
						aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 손가락 빠르기 저장하기
			netResWriteTwoWordFingerSpeed : function(
					aWriteTwoWordFingerSpeedURL, aData, aSuccessCallBack,
					aFailCallBack) {
				instance.netResData(aWriteTwoWordFingerSpeedURL, aData,
						instance.setWriteTwoWordFingerSpeed, aSuccessCallBack,
						aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 정확도 저장하기
			netResWriteTwoWordAcc : function(aWriteTwoWordAccURL, aData,
					aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTwoWordAccURL, aData,
						instance.setWriteTwoWordAcc, aSuccessCallBack,
						aFailCallBack);
			},

			// 두벌식/쿼티 글쇠별 속도 저장하기
			netResWriteTwoWordVelocity : function(aWriteTwoWordVelocityURL,
					aData, aSuccessCallBack, aFailCallBack) {
				instance.netResData(aWriteTwoWordVelocityURL, aData,
						instance.setWriteTwoWordVelocity, aSuccessCallBack,
						aFailCallBack);
			},

			netResData : function(aUrl, aData, aResCallback, aSuccessCallBack,
					aFailCallBack) {
				// console.log("AjaxManager :: netResData -> [url] " + aUrl
				//		+ " [Data] " + JSON.stringify(aData));

				if (aData.length === 0) {
					// console.log("AjaxManager :: netResData " + "[url] " + aUrl
					//		+ " jsonStringData.length is zero");
					return;
				}

				if (aData.result !== undefined) {
					if (aData.result !== 0) {
						this.netResResultError(aData.result, aFailCallBack);
						return;
					}
				}
				aResCallback(aData, aSuccessCallBack);
			},

			netResResultError : function(aResult, aFailCallBack) {
				// console.log("AjaxManager :: netResResultError -> [aResult] "
				// + aResult);
				// if(aResult === 6)
				// aFailCallBack(instance.gameConst.PopupType.RED_ONE_BUTTON,
				// instance.gameConst.resultMessage[aResult]);
				// else if(aResult >= 0)
				// aFailCallBack(instance.gameConst.PopupType.BULE_ONE_BUTTON,
				// instance.gameConst.resultMessage[aResult]);
				aFailCallBack(aResult);
			},

			netResError : function(aUrl, aResponse, aStatus, aError,
					aFailCallBack) {
				console.log("AjaxManager :: netResError -> [Url] " + aUrl
						+ " [Response] " + aResponse + " [Status] " + aStatus
						+ " [ERROR] " + aError);
				// aFailCallBack(aResult);
			},
			// ======================================================================================

			// =============================== SetGetResponseData
			// ===================================
			setResSessionIDLogin : function(aResData, aSuccessCallBack) {
				resSessionIDLoginData = aResData;
				aSuccessCallBack(aResData);
			},

			getResSessionIDLogin : function() {
				return resSessionIDLoginData;
			},

			setRequestTypingSetup : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},
			setWriteTypingSetup : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTypingPosPractice : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setRequestTypingPosPractice : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTypingWordPractice : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setRequestTypingWordPractice : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTypingLongWordPractice : function(aResData,
					aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setRequestTypingLongWordPractice : function(aResData,
					aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTypingLongWordContinue : function(aResData,
					aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setRequestTypingLongWordContinue : function(aResData,
					aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteGameResult : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setRequestGameResult : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteUpdatePoint : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setSendMail : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setStartEndGameLog : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTestResult : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setRequestTestResult : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setReadTajaContents : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setReadTajaContentsData : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTypingSpeed : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTwoTypingSpeed : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTwoWordFingerSpeed : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTwoWordAcc : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			setWriteTwoWordVelocity : function(aResData, aSuccessCallBack) {
				aSuccessCallBack(aResData);
			},

			gameConst : GameConst.getInstance(),
		// ======================================================================================
		};
	}
	;

	return {
		getInstance : function() {
			if (!instance) {
				instance = init();
				instance.setURL();
			}
			return instance;
		}
	};
})();