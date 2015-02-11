/**
 * Miuna News
 * https://github.com/martec
 *
 * Copyright (C) 2015-2015, Martec
 *
 * Miuna News is licensed under the GPL Version 3, 29 June 2007 license:
 *	http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Miuna News - Websocket News for Mybb
 * @author Martec
 * @requires jQuery, Nodejs, Socket.io, Express, debug and Mybb
 * @credits notify.png icon from http://community.mybb.com/post-861176.html
 * @credits some part of code based in MyAlerts of Euan T (http://community.mybb.com/thread-127444.html)
 */

var newscont = 0;

function miunanews(mybbuid) {

	var timeal;

	if (mns_zone_crrect=='1') {
		mns_zone++;
	}

	$('.miunanews_popup_hook').on({
		mouseenter: function () {
			popup_id = $(this).attr('id') + '_popup';
			alheight = $(this).height();
			timeal = setTimeout(function(){
				openalert(popup_id, alheight, 'mouse');
			}, 400);
		},
		mouseleave: function () {
			clearTimeout(timeal);
		},
		click: function (event) {
			popup_id = $(this).attr('id') + '_popup';
			alheight = $(this).height();
			event.preventDefault();
			clearTimeout(timeal);
			openalert(popup_id, alheight, 'click');
		}
	});

	$('.miunanews_popup *').on('click', function(event) {
		event.stopPropagation();
	});

	$(document).mouseup(function (e) {
		var container = $(".miunanews_popup:visible, .miunanews_popup_hook");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			$(".miunanews_popup").hide();
		}
	});

	mns_socket.emit('getoldnews', {newlm:mns_news_limit, uid:mybbuid});
	mns_socket.once('loadoldnews', function(docs){
		for (var i = docs.length-1; i >= 0; i--) {
			if (docs[i].uid!=mybbuid) {
				newsgenerator(docs[i].msg, docs[i].nick, docs[i].avatar, docs[i].url, docs[i].created, docs[i].type, 'old');
			}
		}
	});

	mns_socket.on('msgnews', function(data){
		if (data.uid!=mybbuid) {
			var limitnews = mns_news_limit;
			newsgenerator(data.msg, data.nick, data.avatar, data.url, data.created, data.type, 'new');
			if(mns_myalerts) {
				limitnews = parseInt(mns_news_limit) + parseInt(mns_myanews_limit);
			}
			if (newscont < limitnews) {
				newscont++;
			}
			$(".mnewscount").text(newscont).show();
			document.title = '['+newscont+'] '+mns_orgtit+'';
		}
	});

	if (mns_tid != '') {
		mns_socket.on('newpostnews_'+mns_tid+'', function(data){
			if (data.uid!=mybbuid) {
				if(!$('#mns_news').length) {
					$('<div/>', { id: 'mns_news', class: 'bottom-left' }).appendTo('body');
				}
				setTimeout(function() {
					$('#mns_news').jGrowl(mns_new_msg_lang+data.nick+mns_new_msg2_lang, { life: 500 });
				},200);
			}
		});
	}

	if(mns_myalerts) {
		mns_socket.on('myalertsnews_'+mybbuid+'', function(data){
			newsmyalertsgenerator(data.created, data.type);
			limitnews = parseInt(mns_news_limit) + parseInt(mns_myanews_limit);
			if (newscont < limitnews) {
				newscont++;
			}
		});
	}
}

function regexmiunanews(message) {
	format_search =	 [
		/\[url=(.*?)\](.*?)\[\/url\]/ig
	],
	// The matching array of strings to replace matches with
	format_replace = [
		'<a href="$1">$2</a>'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search.length;i++) {
		message = message.replace(format_search[i], format_replace[i]);
	}

	return message;
}

function newsgenerator(message,username,avatar,url,date,type,typenewold) {
	var message = regexmiunanews(message),
	hour = moment(date).utcOffset(parseInt(mns_zone)).format(mns_date_format),
	color = lang = typeoldnew = '';
	if($("#newsarea").children("li.mnews").length>(parseInt(mns_news_limit) - 1)) {
		dif = $("#newsarea").children("li.mnews").length - (parseInt(mns_news_limit) - 1);
		$("#newsarea").children("li.mnews").slice(-dif).remove();
	}
	if(type=="newpost") {
		color = mns_newpost_color;
		lang = mns_newpost_lang;
	}
	else {
		color = mns_newthread_color;
		lang = mns_newthread_lang;
	}
	if(typenewold=="new") {
		typeoldnew = 'miunaunreadNew';
	}
	$("#newsarea").prepend("<li class='"+typeoldnew+" mnews'><table style='width: 100%;'><tbody><tr><td class='tvatar tl_c' width='45'>"+avatar+"</td><td><div class='miunanewsContent'><span style='font-size:12px;'><span style='color:"+color+";'>•</span> "+lang+":</span> <span style='float:right;'><a href="+url+"><img src='"+rootpath+"/images/jump.png' /></a></span><br>"+username+" "+message+". ("+hour+")</div></td></tr></tbody></table></li>");
}

function newsmyalertsgenerator(date,type) {
	var hour = moment(date).utcOffset(parseInt(mns_zone)).format(mns_date_format);
	if($("#newsarea").children("li.malnews").length>(parseInt(mns_myanews_limit) - 1)) {
		dif = $("#newsarea").children("li.malnews").length - (parseInt(mns_myanews_limit) - 1);
		$("#newsarea").children("li.malnews").slice(-dif).remove();
	}
	$("#newsarea").prepend("<li class='miunaunreadNew malnews'><div class='miunanewsContent'><span style='font-size:12px;'><span style='color:"+mns_myalerts_color+";'>•</span> "+mns_new_myalerts_lang+":</span> <br>"+mns_new_myalertsmsg_lang+" ("+type+"). ("+hour+")</div></li>");
}

function openalert(el, el2, type) {
	var slidetype = '';
	if (type=="click") {
		slidetype = 'slideToggle';
	}
	else {
		slidetype = 'slideDown';
	}
	$('#' + el).attr('top', el2 + 'px')[slidetype]('fast');
	newscont = 0;
	$(".mnewscount").text(newscont).hide();
	document.title = mns_orgtit;
	return false;
}