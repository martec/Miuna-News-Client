var parserColors = [];

var parserTags = {
	'b': {
		openTag: function(params,content) {
			return '<b>';
		},
		closeTag: function(params,content) {
			return '</b>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'code': {
		openTag: function(params,content) {
			return '<div class="codeblock"><div class="title">'+mns_code_lang+'<br></div><div class="body" dir="ltr"><code>';
		},
		closeTag: function(params,content) {
			return '</code></div></div></div>';
		},
		content: function(params,content) {
			return content.trim();
		},
		noParse: true
	},
	'php': {
		openTag: function(params,content) {
			return '<div class="codeblock phpcodeblock"><div class="title">'+mns_php_lang+'<br></div><div class="body"><div dir="ltr"><code><span style="color: #0000BB">';
		},
		closeTag: function(params,content) {
			return '</span></code></div></div></div>';
		},
		content: function(params,content) {
			return content.trim();
		},
		noParse: true
	},
	'spoiler': {
		openTag: function(params,content) {
			return "<tag><div style=\"margin: 5px\"><div style=\"font-size:11px; border-radius: 3px 3px 0 0 ; padding: 4px; background: #f5f5f5;border:1px solid #ccc;font-weight:bold;color:#000;text-shadow:none; \">"+mns_spo_lan+":&nbsp;&nbsp;<input type=\"button\" onclick=\"if (this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != '') { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = '';this.innerText = ''; this.value = '"+mns_hide_lan+"'; } else { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none'; this.innerText = ''; this.value = '"+mns_show_lan+"'; }\" style=\"font-size: 9px;\" value=\""+mns_show_lan+"\"></div><div><div style=\"border:1px solid #ccc; border-radius: 0 0 3px 3px; border-top: none; padding: 4px;display: none;\">";
		},
		closeTag: function(params,content) {
			return '</code></div></div>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'color': {
		openTag: function(params,content) {
			return '<span style="color:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	"email": {
		openTag: function(params,content) {

			var myEmail;

			if (!params) {
				myEmail = content.replace(/<.*?>/g,"");
			} else {
				myEmail = params.substr(1);
			}

			emailPattern.lastIndex = 0;
			if ( !emailPattern.test( myEmail ) ) {
				return '<a>';
			}

			return '<a href="mailto:' + myEmail + '">';
		},
		closeTag: function(params,content) {
			return '</a>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'i': {
		openTag: function(params,content) {
			return '<i>';
		},
		closeTag: function(params,content) {
			return '</i>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'img': {
		openTag: function(params,content) {

			var myUrl = content;

			BBCodeParser.urlPattern.lastIndex = 0;
			if ( !BBCodeParser.urlPattern.test( myUrl ) ) {
				myUrl = "";
			}

			return '<img class="bbCodeImage" src="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '';
		},
		content: function(params,content) {
			return '';
		}
	},
	'list': {
		openTag: function(params,content) {
			if(params=='1') {
				return '<ol type="1">';
			}
			else {
				return '<ul>';
			}
		},
		closeTag: function(params,content) {
			if(params=='1') {
				return '</ol>';
			}
			else {
				return '</ul>';
			}
		},
		restrictChildrenTo: ["*", "li"]
	},
	'quote': {
		openTag: function(params,content) {
			if(params){
				return '<blockquote><cite>'+params+mns_wrote_lang+'</cite>';
			}
			else {
				return '<blockquote><cite>'+mns_quote_lang+'</cite>';
			}
		},
		closeTag: function(params,content) {
			return '</blockquote>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	's': {
		openTag: function(params,content) {
			return '<s>';
		},
		closeTag: function(params,content) {
			return '</s>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'size': {
		openTag: function(params,content) {
			return '<span style="font-size:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'font': {
		openTag: function(params,content) {
			return '<span style="font-family:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'align': {
		openTag: function(params,content) {
			return '<div style="text-align:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</div>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'u': {
		openTag: function(params,content) {
			return '<span style="text-decoration:underline">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'url': {
		openTag: function(params,content) {

			var myUrl;

			if (!params) {
				myUrl = content.replace(/<.*?>/g,"");
			} else {
				myUrl = params;
			}

			return '<a href="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '</a>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'video': {
		openTag: function(params,content) {
			link = content.trim();
			var	vd_matches, vd_url, vd_size;
			switch(params)
			{
				case 'dailymotion':
					vd_matches = link.match(/dailymotion\.com\/video\/([^_]+)/);
					vd_url	   = vd_matches ? 'http://www.dailymotion.com/embed/video/' + vd_matches[1] : false;
					vd_size = 'width="480" height="270"';
					break;
				case 'facebook':
					vd_matches = link.match(/facebook\.com\/(?:photo.php\?v=|video\/video.php\?v=|video\/embed\?video_id=|v\/?)(\d+)/);
					vd_url	   = vd_matches ? 'https://www.facebook.com/video/embed?video_id=' + vd_matches[1] : false;
					vd_size = 'width="625" height="350"';
					break;
				case 'liveleak':
					vd_matches = link.match(/liveleak\.com\/(?:view\?i=)([^\/]+)/);
					vd_url	   = vd_matches ? 'http://www.liveleak.com/ll_embed?i=' + vd_matches[1] : false;
					vd_size = 'width="500" height="300"';
					break;
				case 'metacafe':
					vd_matches = link.match(/metacafe\.com\/watch\/([^\/]+)/);
					vd_url	   = vd_matches ? 'http://www.metacafe.com/embed/' + vd_matches[1] : false;
					vd_size = 'width="440" height="248"';
					break;
				case 'veoh':
					vd_matches = link.match(/veoh\.com\/watch\/([^\/]+)/);
					vd_url	   = vd_matches ? '//www.veoh.com/swf/webplayer/WebPlayer.swf?videoAutoPlay=0&permalinkId=' + vd_matches[1] : false;
					vd_size = 'width="410" height="341"';
					break;
				case 'vimeo':
					vd_matches = link.match(/vimeo.com\/(\d+)($|\/)/);
					vd_url	   = vd_matches ? '//player.vimeo.com/video/' + vd_matches[1] : false;
					vd_size = 'width="500" height="281"';
					break;
				case 'youtube':
					vd_matches = link.match(/(?:v=|v\/|embed\/|youtu\.be\/)(.{11})/);
					vd_url	   = vd_matches ? '//www.youtube.com/embed/' + vd_matches[1] : false;
					vd_size = 'width="560" height="315"';
					break;
			};
			return '<iframe '+vd_size+' src='+vd_url+'>';
		},
		closeTag: function(params,content) {
			return '</iframe>';
		},
		content: function(params,content) {
			return '';
		}
	},
};

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

mns_avt_dime_spli = mns_avt_dime.split("x");
var newscont = 0,
mns_avt_width = mns_avt_dime_spli[0],
mns_avt_height = mns_avt_dime_spli[1];

function miunanews(mybbuid) {

	var timenews,
	mn_set_old = '1',
	mn_set_new = '1',
	mn_set_mya = '1',
	mn_set_post = '1',
	mn_set_id = '',
	mn_set_ls = JSON.parse(localStorage.getItem('mn_set'));

	if (mns_zone_crrect=='1') {
		mns_zone++;
	}

	if (mn_set_ls) {
		mn_set_old = mn_set_ls['old'];
		mn_set_new = mn_set_ls['new'];
		if (mn_set_ls['mya']!=undefined) {
			mn_set_mya = mn_set_ls['mya'];
		}
		if (mn_set_ls['pos']!=undefined) {
			mn_set_post = mn_set_ls['pos'];
		}
		if (mn_set_ls['id']!=undefined) {
			mn_set_id = mn_set_ls['id'];
		}
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#mns_opt', function (e) {
		e.preventDefault();
		$(".miunanews_popup").hide();
		mns_myal_sett = mns_npost_sett = '';
		if(parseInt(mns_myalerts)) {
			mns_myal_sett = '<tr><td class="trow1" width="40%"><strong>'+mns_lmyalertsnews_lang+'</strong></td><td class="trow1" width="60%"><select id="mns_new_lmyal"><option value="1">'+mns_yes_lan+'</option><option value="0">'+mns_no_lan+'</option></select></td></tr>';
		}
		if(parseInt(mns_newpost)) {
			mns_npost_sett = '<tr><td class="trow1" width="40%"><strong>'+mns_lnewpost_lang+'</strong></td><td class="trow1" width="60%"><select id="mns_new_lpost"><option value="1">'+mns_yes_lan+'</option><option value="0">'+mns_no_lan+'</option></select></td></tr><tr><td class="trow1" width="40%"><strong>'+mns_idign_lang+'</strong></td><td class="trow1" width="60%"><input type="text" name="tid_ig_inp" id="tid_ig_inp" autocomplete="off"></td></tr>';
		}
		$('body').append( '<div id="mns_conf"><table border="0" cellspacing="0" cellpadding="5" class="tborder"><tr><td class="thead" colspan="2"><strong>'+mns_sett_lang+'</strong></td></tr><tr><td class="trow1" width="40%"><strong>'+mns_loldnews_lang+'</strong></td><td class="trow1" width="60%"><select id="mns_old_lnews"><option value="1">'+mns_yes_lan+'</option><option value="0">'+mns_no_lan+'</option></select></td></tr><tr><td class="trow1" width="40%"><strong>'+mns_lnewnews_lang+'</strong></td><td class="trow1" width="60%"><select id="mns_new_lnews"><option value="1">'+mns_yes_lan+'</option><option value="0">'+mns_no_lan+'</option></select></td></tr>'+mns_myal_sett+mns_npost_sett+'</table><br /><div align="center"><button id="mns_update">'+mns_updset_lang+'</button></div><br /></div>' );
		if (mn_set_ls) {
			$("#mns_old_lnews").find("option[value=" + mn_set_old +"]").attr('selected', true);
			$("#mns_new_lnews").find("option[value=" + mn_set_new +"]").attr('selected', true);
			if (mn_set_ls['mya']!=undefined) {
				$("#mns_new_lmyal").find("option[value=" + mn_set_mya +"]").attr('selected', true);
			}
			if (mn_set_ls['pos']!=undefined) {
				$("#mns_new_lpost").find("option[value=" + mn_set_post +"]").attr('selected', true);
			}
			if (mn_set_ls['id']!=undefined) {
				$("#tid_ig_inp").val(""+ mn_set_id +"");
			}
		}
		$('#mns_conf').modal({ zIndex: 7 });
	});	

	($.fn.on || $.fn.live).call($(document), 'click', '#mns_update', function (e) {
		e.preventDefault();
		var mn_set_ls = JSON.parse(localStorage.getItem('mn_set'));
		if (!mn_set_ls) {
			mn_set_ls = {};
		}
		mn_set_ls['old'] = $("#mns_old_lnews option:selected").val();
		mn_set_ls['new'] = $("#mns_new_lnews option:selected").val();
		if($('#mns_new_lmyal').length) {
			mn_set_ls['mya'] = $("#mns_new_lmyal option:selected").val();
		}
		if($('#mns_new_lpost').length) {
			mn_set_ls['pos'] = $("#mns_new_lpost option:selected").val();
			mn_set_ls['id'] = $("#tid_ig_inp").val();
		}
		localStorage.setItem('mn_set', JSON.stringify(mn_set_ls));

		if(!$('#upd_news').length) {
			$('<div/>', { id: 'upd_news', class: 'bottom-right' }).appendTo('body');
		}
		setTimeout(function() {
			$('#upd_news').jGrowl(''+mns_updsaved_lang+'', { life: 500 });
		},200);
		if (mn_set_ls) {
			mn_set_old = mn_set_ls['old'];
			mn_set_new = mn_set_ls['new'];
			if (mn_set_ls['mya']!=undefined) {
				mn_set_mya = mn_set_ls['mya'];
			}
			if (mn_set_ls['pos']!=undefined) {
				mn_set_post = mn_set_ls['pos'];
			}
			if (mn_set_ls['id']!=undefined) {
				mn_set_id = mn_set_ls['id'];
			}
		}
		$.modal.close();
	});

	$('.miunanews_popup_hook').on({
		mouseenter: function () {
			popup_id = $(this).attr('id') + '_popup';
			alheight = $(this).height();
			timenews = setTimeout(function(){
				openmiunanews(popup_id, alheight, 'mouse');
			}, 400);
		},
		mouseleave: function () {
			clearTimeout(timenews);
		},
		click: function (event) {
			popup_id = $(this).attr('id') + '_popup';
			alheight = $(this).height();
			event.preventDefault();
			clearTimeout(timenews);
			openmiunanews(popup_id, alheight, 'click');
		}
	});

	$(document).mouseup(function (e) {
		var containermnews = $(".miunanews_popup:visible, .miunanews_popup_hook");
		if (!containermnews.is(e.target) && containermnews.has(e.target).length === 0) {
			$(".miunanews_popup").hide();
		}
	});

	if (parseInt(mn_set_old)) {
		mns_socket.emit('getoldnews', {newlm:mns_news_limit, uid:mybbuid});
		mns_socket.once('loadoldnews', function(docs){
			for (var i = docs.length-1; i >= 0; i--) {
				if (docs[i].uid!=mybbuid) {
					newsgenerator(docs[i].msg, docs[i].nick, docs[i].avatar, docs[i].url, docs[i].created, docs[i].type, 'old');
				}
			}
		});
	}

	if (parseInt(mn_set_new)) {
		mns_socket.on('msgnews', function(data){
			if (data.uid!=mybbuid && $.inArray(parseInt(data.tid), mn_set_id.split(',').map(function(idignore){return Number(idignore);}))==-1) {
				newsgenerator(data.msg, data.nick, data.avatar, data.url, data.created, data.type, 'new');
				newscont++;
				$(".mnewscount").text(newscont).show();
				document.title = '['+newscont+'] '+mns_orgtit+'';
			}
		});
	}

	if (mns_tid != '' && parseInt(mn_set_post) && $.inArray(parseInt(mns_tid), mn_set_id.split(',').map(function(idignorepost){return Number(idignorepost);}))==-1) {
		mns_socket.on('newpostnews_'+mns_tid+'', function(data){
			if (data.uid!=mybbuid) {
				if(parseInt(mns_pages)>parseInt(mns_page_current)){
					nextpage = parseInt(mns_page_current);
					nextpage++;
					if(!$('#mns_hasmore').length) {
						$("#posts").append('<div id="mns_hasmore">'+mns_hasmore_lang+'<a href="'+rootpath+'/showthread.php?tid='+data.tid+'&amp;page='+nextpage+'">'+mns_hasmore2_lang+'</a></div>');
					}
					postbitgenerator(data.nick, data.post, data.pid, data.tid, data.avatar, data.created);
				}
				else{
					postbitgenerator(data.nick, data.post, data.pid, data.tid, data.avatar, data.created);
				}
			}
		});
	}

	if(parseInt(mns_myalerts)) {
		mns_socket.on('myalertsnews_'+mybbuid+'', function(data){
			newsmyalertsgenerator(data.created, data.type);
			newscont++;
			$(".mnewscount").text(newscont).show();
			document.title = '['+newscont+'] '+mns_orgtit+'';
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

function regexmiunanewspost(message) {

	for (var val in mns_smilies) {
		message = message.replace(new RegExp(''+val+'(?!\\S)', "gi"), mns_smilies[val]);
	}

	format_search_before =	 [
		/\[\/quote\](\r?\n|\r)/ig,
		/\[\/code\](\r?\n|\r)/ig,
		/\[\/php\](\r?\n|\r)/ig,
		/\[\/spoiler\](\r?\n|\r)/ig,
		/\[\/list\](\r?\n|\r)/ig,
		/\[quote=['"](.*?)["'](.*?)\]/ig,
		/\[quote=['"](.*?)["']\]/ig,
		/\[spoiler=(.*?)\]/ig,
		/\[\*\]/ig
	],
	// The matching array of strings to replace matches with
	format_replace_before = [
		'[/quote]',
		'[/code]',
		'[/php]',
		'[/spoiler]',
		'[/list]',
		'[quote=$1]',
		'[quote=$1]',
		'[spoiler]',
		'\n[*]'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search_before.length;i++) {
		message = message.replace(format_search_before[i], format_replace_before[i]);
	}

	message = BBCodeParser.process(message);

	format_search_after =	 [
		/\[hr\]/ig,
		/\[\*\]([^\n]+)/ig,
		/\<ol type="1">(\r?\n*|\r)/ig,
		/\<ul>(\r?\n*|\r)/ig,
		/\<\/li>(\r?\n*|\r)/ig,
		/\n/ig,
		/(^|[^"=\]])(https?:\/\/[a-zA-Z0-9\.\-\_\-\/]+(?:\?[a-zA-Z0-9=\+\_\;\-\&]+)?(?:#[\w]+)?)/gim,
		/(^|[^"=\]\>\/])(www\.[\S]+(\b|$))/gim,
		/(^|[^"=\]])(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim
	],
	// The matching array of strings to replace matches with
	format_replace_after = [
		'<hr></hr>',
		'<li>$1</li>',
		'<ol type="1">',
		'<ul>',
		'</li>',
		'<br />',
		'$1<a href="$2" target="_blank">$2</a>',
		'$1<a href="http://$2" target="_blank">$2</a>',
		'<a href="mailto:$1">$1</a>'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search_after.length;i++) {
		message = message.replace(format_search_after[i], format_replace_after[i]);
	}

	return message;
}

function postbitgenerator(username,text,pid,tid,avatar,date) {
	message = regexmiunanewspost(text);
	hour = moment(date).utcOffset(parseInt(mns_zone)).format(mns_date_format);
	mns_mult_quote_but = '';
	if (parseInt(mns_mult_quote)==1) {
		mns_mult_quote_but = '<a href="javascript:Thread.multiQuote('+pid+');" id="multiquote_link_'+pid+'" title="'+mns_postb_multq_lang+'" class="postbit_multiquote"><span id="multiquote_'+pid+'">'+mns_postb_multqbut_lang+'</span></a>';
	}
	if(parseInt(mns_postbit)==0) {
		$("#posts").append('<a name="pid'+pid+'" id="pid'+pid+'"></a><div class="post" id="post_'+pid+'"><div class="post_author"><div class="author_avatar postavt_'+pid+'">'+avatar+'</div><div class="author_information"><strong><span class="largetext">'+username+'</span></strong></div></div><div class="post_content"><div class="post_head"><span class="post_date">'+hour+'</span></div><div class="post_body scaleimages" id="pid_'+pid+'">'+message+'</div></div><div class="post_controls"><div class="postbit_buttons post_management_buttons float_right"><a href="'+rootpath+'/newreply.php?tid='+tid+'&amp;replyto='+pid+'" title="'+mns_postb_quote_lang+'" class="postbit_quote"><span>'+mns_postb_quotebut_lang+'</span></a>'+mns_mult_quote_but+'</div></div></div>');
	}
	else {
		$("#posts").append('<a name="pid'+pid+'" id="pid'+pid+'"></a><div class="post classic" id="post_'+pid+'"><div class="post_author scaleimages"><div class="author_avatar postavt_'+pid+'">'+avatar+'</div><div class="author_information"><strong><span class="largetext">'+username+'</span></strong></div></div><div class="post_content"><div class="post_head"><span class="post_date">'+hour+'</span></div><div class="post_body scaleimages" id="pid_'+pid+'">'+message+'</div></div><div class="post_controls"><div class="postbit_buttons post_management_buttons float_right"><a href="'+rootpath+'/newreply.php?tid='+tid+'&amp;replyto='+pid+'" title="'+mns_postb_quote_lang+'" class="postbit_quote"><span>'+mns_postb_quotebut_lang+'</span></a>'+mns_mult_quote_but+'</div></div></div>');
	}
	 $('.postavt_'+pid+' img').css({"max-height": ""+mns_avt_height+"px", "max-width": ""+mns_avt_width+"px"});
}

function newsgenerator(message,username,avatar,url,date,type,typenewold) {
	message = regexmiunanews(message);
	color = mnewslang = typeoldnew = '';
	hour = moment(date).utcOffset(parseInt(mns_zone)).format(mns_date_format);
	if($("#newsarea").children("li.mnews").length>(parseInt(mns_news_limit) - 1)) {
		dif = $("#newsarea").children("li.mnews").length - (parseInt(mns_news_limit) - 1);
		$("#newsarea").children("li.mnews").slice(-dif).remove();
	}
	if(type=="newpost") {
		color = mns_newpost_color;
		mnewslang = mns_newpost_lang;
	}
	else {
		color = mns_newthread_color;
		mnewslang = mns_newthread_lang;
	}
	if(typenewold=="new") {
		typeoldnew = 'miunaunreadNew';
	}
	$("#newsarea").prepend("<li class='"+typeoldnew+" mnews'><table style='width: 100%;'><tbody><tr><td class='mns_tvatar tl_c' width='45'>"+avatar+"</td><td><div class='miunanewsContent'><span style='font-size:12px;'><span style='color:"+color+";'>•</span> "+mnewslang+":</span> <span style='float:right;'><a href="+url+"><img src='"+rootpath+"/images/jump.png' /></a></span><br>"+username+" "+message+". ("+hour+")</div></td></tr></tbody></table></li>");
}

function newsmyalertsgenerator(date,type) {
	hour = moment(date).utcOffset(parseInt(mns_zone)).format(mns_date_format);
	if($("#newsarea").children("li.malnews").length>(parseInt(mns_myanews_limit) - 1)) {
		dif = $("#newsarea").children("li.malnews").length - (parseInt(mns_myanews_limit) - 1);
		$("#newsarea").children("li.malnews").slice(-dif).remove();
	}
	$("#newsarea").prepend("<li class='miunaunreadNew malnews'><div class='miunanewsContent'><span style='font-size:12px;'><span style='color:"+mns_myalerts_color+";'>•</span> "+mns_new_myalerts_lang+":</span> <br>"+mns_new_myalertsmsg_lang+" ("+type+"). ("+hour+")</div></li>");
}

function openmiunanews(el, el2, type) {
	slidetype = '';
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