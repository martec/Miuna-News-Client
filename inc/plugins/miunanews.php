<?php
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

// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
	die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

if(!defined("PLUGINLIBRARY"))
{
	define("PLUGINLIBRARY", MYBB_ROOT."inc/plugins/pluginlibrary.php");
}

define('MNS_PLUGIN_VER', '3.2.0');

function miunanews_info()
{
	global $lang, $mybb, $plugins_cache;

	$lang->load('config_miunanews');

	$info = array(
		"name"			=> "Miuna News",
		"description"	=> $lang->miunanews_plug_desc,
		"author"		=> "martec",
		"authorsite"	=> "",
		"version"		=> MNS_PLUGIN_VER,
		"guid"			=> "",
		"compatibility" => "18*"
	);

	if(miunanews_is_installed() && $plugins_cache['active']['miunanews'] && $plugins_cache['active']['myalerts']) {
		global $PL;
		$PL or require_once PLUGINLIBRARY;

		$editcode = $PL->url_append("index.php?module=config-plugins", array("miunanews" => "edit", "my_post_key" => $mybb->post_code));
		$undocode = $PL->url_append("index.php", array("module" => "config-plugins", "miunanews" => "undo", "my_post_key" => $mybb->post_code));

		$editcode = "index.php?module=config-plugins&amp;miunanews=edit&amp;my_post_key=".$mybb->post_code;
		$undocode = "index.php?module=config-plugins&amp;miunanews=undo&amp;my_post_key=".$mybb->post_code;

		$info["description"] .= "<br /><a href=\"{$editcode}\">Make edits to inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php</a>.";
		$info["description"] .= "	 | <a href=\"{$undocode}\">Undo edits to inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php</a>.";
	}

	return $info;
}

function miunanews_install()
{
	global $db, $lang, $PL;

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$lang->load('config_miunanews');

	$query	= $db->simple_select("settinggroups", "COUNT(*) as rows");
	$dorder = $db->fetch_field($query, 'rows') + 1;

	$groupid = $db->insert_query('settinggroups', array(
		'name'		=> 'miunanews',
		'title'		=> 'Miuna News',
		'description'	=> $lang->miunanews_sett_desc,
		'disporder'	=> $dorder,
		'isdefault'	=> '0'
	));

	$miunanews_setting[] = array(
		'name' => 'miunanews_online',
		'title' => $lang->miunanews_onoff_title,
		'description' => $lang->miunanews_onoff_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 1,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_num_news',
		'title' => $lang->miunanews_newslimit_title,
		'description' => $lang->miunanews_newslimit_desc,
		'optionscode' => 'numeric',
		'value' => '10',
		'disporder' => 2,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_num_myanews',
		'title' => $lang->miunanews_newsmyalimit_title,
		'description' => $lang->miunanews_newsmyalimit_desc,
		'optionscode' => 'numeric',
		'value' => '5',
		'disporder' => 3,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_grups_acc',
		'title' => $lang->miunanews_nogrp_title,
		'description' => $lang->miunanews_nogrp_desc,
		'optionscode' => 'groupselect',
		'value' => '7',
		'disporder' => 4,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_server',
		'title' => $lang->miunanews_server_title,
		'description' => $lang->miunanews_server_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 5,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_socketio',
		'title' => $lang->miunanews_socketio_title,
		'description' => $lang->miunanews_socketio_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 6,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_server_username',
		'title' => $lang->miunanews_serusr_title,
		'description' => $lang->miunanews_serusr_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 7,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_server_password',
		'title' => $lang->miunanews_serpass_title,
		'description' => $lang->miunanews_serpass_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 8,
		'gid'		=> $groupid
	);	
	$miunanews_setting[] = array(
		'name' => 'miunanews_newpost',
		'title' => $lang->miunanews_newpost_title,
		'description' => $lang->miunanews_newpost_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 9,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_newthread',
		'title' => $lang->miunanews_newthread_title,
		'description' => $lang->miunanews_newthread_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 10,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_folder_acc',
		'title' => $lang->miunanews_foldacc_title,
		'description' => $lang->miunanews_foldacc_desc,
		'optionscode' => 'forumselect',
		'value' => '',
		'disporder' => 11,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_dataf',
		'title' => $lang->miunanews_dataf_title,
		'description' => $lang->miunanews_dataf_desc,
		'optionscode' => 'text',
		'value' => 'DD/MM hh:mm A',
		'disporder' => 12,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_newpost_color',
		'title' => $lang->miunanews_newpostcolor_title,
		'description' => $lang->miunanews_newpostcolor_desc,
		'optionscode' => 'text',
		'value' => 'green',
		'disporder' => 13,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_newthread_color',
		'title' => $lang->miunanews_newthreadcolor_title,
		'description' => $lang->miunanews_newthreadcolor_desc,
		'optionscode' => 'text',
		'value' => 'blue',
		'disporder' => 14,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_myalerts_color',
		'title' => $lang->miunanews_myalertscolor_title,
		'description' => $lang->miunanews_myalertscolor_desc,
		'optionscode' => 'text',
		'value' => 'orange',
		'disporder' => 15,
		'gid'		=> $groupid
	);
	$miunanews_setting[] = array(
		'name' => 'miunanews_myalerts',
		'title' => $lang->miunanews_myalertonoff_title,
		'description' => $lang->miunanews_myalertonoff_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 16,
		'gid'		=> $groupid
	);

	$db->insert_query_multiple("settings", $miunanews_setting);
	rebuild_settings();

}

function miunanews_uninstall()
{
	global $db, $PL;
	$PL or require_once PLUGINLIBRARY;

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->stylesheet_delete('miunanews', true);

	//Delete Settings
	$db->write_query("DELETE FROM ".TABLE_PREFIX."settings WHERE name IN(
		'miunanews_online',
		'miunanews_num_news',
		'miunanews_num_myanews',
		'miunanews_grups_acc',
		'miunanews_server',
		'miunanews_server_username',
		'miunanews_server_password',
		'miunanews_socketio'
		'miunanews_newpost',
		'miunanews_newthread',
		'miunanews_folder_acc',
		'miunanews_dataf',
		'miunanews_newpost_color',
		'miunanews_newthread_color',
		'miunanews_myalerts_color',
		'miunanews_myalert'
	)");

	$db->delete_query("settinggroups", "name = 'miunanews'");
	rebuild_settings();

}

function miunanews_is_installed()
{
	global $db;

	$query = $db->simple_select("settinggroups", "COUNT(*) as rows", "name = 'miunanews'");
	$rows  = $db->fetch_field($query, 'rows');

	return ($rows > 0);
}

function miunanews_activate()
{

	global $db, $plugins_cache, $PL;
	$PL or require_once PLUGINLIBRARY;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->stylesheet('miunanews', file_get_contents(MYBB_ROOT . "/jscripts/miuna/news/css/miunanews.css"));

	$new_template_global['miunanewstemplate'] = "<li><a href=\"{\$mybb->settings['bburl']}/usercp.php?action=miunanews_config\" class=\"miunanews miunanews_popup_hook\" id=\"miunaunreadNews_menu\">{\$lang->miunanews_news}</a></li>
<span class=\"miunanews_popup_wrapper miunanews\"><a href=\"{\$mybb->settings['bburl']}/usercp.php?action=miunanews_config\" class=\"miunaunreadNews miunanews_popup_hook\" id=\"miunaunreadNews_menu\"><span class=\"mnewscount\" style=\"display:none\"></span></a>
	<div id=\"miunaunreadNews_menu_popup\" class=\"miunanews_popup\" style=\"display:none\">
		<div class=\"popupTitle\">{\$lang->miunanews_recent_news}</div>
		<ol id=\"newsarea\">
		</ol>
		<div class=\"popupFooter\"><div class=\"tl_r\"><a href=\"#\" id=\"mns_opt\">{\$lang->miunanews_settings}</a></div></div>
	</div>
</span>";

	$new_template_global['miunanewsfootertemplate'] = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.slim.js\"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js'></script>
<script type=\"text/javascript\">
<!--
	const mybbuid = '{\$mybb->user['uid']}';
	var mns_socket = io.connect('{\$mybb->settings['miunanews_socketio']}/mnews'),
	mns_date_format = '{\$mybb->settings['miunanews_dataf']}',
	mns_zone = '{\$mybb->user['timezone']}',
	mns_zone_crrect = '{\$mybb->user['dst']}',
	mns_news_limit = '{\$mybb->settings['miunanews_num_news']}',
	mns_myanews_limit = '{\$mybb->settings['miunanews_num_myanews']}',
	mns_newpost_color = '{\$mybb->settings['miunanews_newpost_color']}',
	mns_newthread_color = '{\$mybb->settings['miunanews_newthread_color']}',
	mns_myalerts_color = '{\$mybb->settings['miunanews_myalerts_color']}',
	mns_myalerts = '{\$mybb->settings['miunanews_myalerts']}',
	mns_newpost = '{\$mybb->settings['miunanews_newpost']}',
	mns_newpost_lang = '{\$lang->miunanews_new_post}',
	mns_newthread_lang = '{\$lang->miunanews_new_thread}',
	mns_new_msg_lang = '{\$lang->miunanews_new_msg}',
	mns_new_msg2_lang = '{\$lang->miunanews_new_msg2}',
	mns_new_myalerts_lang = '{\$lang->miunanews_new_myalerts}',
	mns_new_myalertsmsg_lang = '{\$lang->miunanews_new_myalerts_msg}',
	mns_hasmore_lang = '{\$lang->miunanews_has_more}',
	mns_hasmore2_lang = '{\$lang->miunanews_has_more2}',
	mns_sett_lang = '{\$lang->miunanews_settings}',
	mns_loldnews_lang = '{\$lang->miunanews_old_news}',
	mns_lnewnews_lang = '{\$lang->miunanews_new_news}',
	mns_lmyalertsnews_lang = '{\$lang->miunanews_myalerts_news}',
	mns_lnewpost_lang = '{\$lang->miunanews_load_newpost}',
	mns_idign_lang = '{\$lang->miunanews_tidign_newpost}',
	mns_updset_lang = '{\$lang->miunanews_update_config}',
	mns_updsaved_lang = '{\$lang->miunanews_update_saved}',
	mns_postb_multq_lang = '{\$lang->postbit_multiquote}',
	mns_postb_multqbut_lang = '{\$lang->postbit_button_multiquote}',
	mns_postb_quote_lang = '{\$lang->postbit_quote}',
	mns_postb_quotebut_lang = '{\$lang->postbit_button_quote}',
	mns_spo_lan = '{\$lang->miunanews_spoiler}',
	mns_hide_lan = '{\$lang->miunanews_hide}',
	mns_show_lan = '{\$lang->miunanews_show}',
	mns_no_lan = '{\$lang->miunanews_no}',
	mns_yes_lan = '{\$lang->miunanews_yes}',
	mns_quote_lang = '{\$lang->quote}',
	mns_wrote_lang = '{\$lang->wrote}',
	mns_code_lang = '{\$lang->code}',
	mns_php_lang = '{\$lang->php_code}',
	mns_orgtit = document.title,
	mns_postbit = '{\$mybb->user['classicpostbit']}',
	mns_pages = \$.trim(\$('.pagination').not('#breadcrumb_multipage_popup').children('.pagination_page').last().html()),
	mns_page_current = \$.trim(\$('.pagination').not('#breadcrumb_multipage_popup').children('.pagination_current').last().html()),
	mns_avt_dime = '{\$mybb->settings['postmaxavatarsize']}',
	mns_mult_quote = '{\$mybb->settings['multiquote']}',
	mns_tid = '{\$mybb->input['tid']}';
// -->
</script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/miuna/news/miunanews.helper.js?ver=".MNS_PLUGIN_VER."\"></script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/miuna/news/bbcode-parser.js?ver=".MNS_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
mns_smilies = {
	{\$mns_smilies_json}
}
mns_types = {
	{\$mns_type_json}
}
\$(document).ready(function() {
	miunanews();
});
</script>";

	foreach($new_template_global as $title => $template)
	{
		$new_template_global = array('title' => $db->escape_string($title), 'template' => $db->escape_string($template), 'sid' => '-1', 'version' => '1803', 'dateline' => TIME_NOW);
		$db->insert_query('templates', $new_template_global);
	}

	find_replace_templatesets("header_welcomeblock_member", '#{\$modcplink}#', "{\$modcplink}{\$miunanews}");
	find_replace_templatesets("footer", '/$/', "{\$miunanewsfooter}");

	if($plugins_cache['active']['myalerts']) {
		$result = $PL->edit_core("miunanews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array (
					array(	'search' => array('return array('),
							'before' => array(	'
										global $mybb, $settings;

										if($settings[\'miunanews_myalerts\']) {
											$data = array(
												"uid" => $this->getUserId(),
												"type" => $this->getTypeId()
											);

											sendPostDataMN(\'newmyalert\', $data);
										}
										')
						)
			),
			true
		);
	}
}

function miunanews_deactivate()
{
	global $db, $PL;
	$PL or require_once PLUGINLIBRARY;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->stylesheet_deactivate('miunanews', true);

	$db->delete_query("templates", "title IN('miunanewstemplate','miunanewsfootertemplate')");

	find_replace_templatesets("header_welcomeblock_member", '#'.preg_quote('{$miunanews}').'#', '',0);
	find_replace_templatesets("footer", '#'.preg_quote('{$miunanewsfooter}').'#', '',0);

	$PL->edit_core("miunanews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array(), true);
}

global $settings;
if ($settings['miunanews_online']) {
	$plugins->add_hook('global_start', 'MiunaNews');
}
function MiunaNews() {

	global $templatelist, $settings, $mybb, $theme, $smiliecache, $talertcache, $cache, $mns_smilies_json, $mns_type_json, $templates, $miunanews, $miunanewsfooter, $lang;

	if (!$lang->miunanews) {
		$lang->load('miunanews');
	}

	if (isset($templatelist)) {
		$templatelist .= ',';
	}

	$templatelist .= 'miunanewstemplate,miunanewsfootertemplate';

	if(!$talertcache)
	{
		if(!is_array($talert_cache))
		{
			$talert_cache = $cache->read("mybbstuff_myalerts_alert_types");
		}
		if ($talert_cache) {
			foreach($talert_cache as $talert)
			{
				if($talert['enabled'] != 0)
				{
					$talertcache[$talert['id']] = $talert;
				}
			}
		}
	}	

	unset($talert);	

	if(is_array($talertcache))
	{
		reset($talertcache);
		$mns_type_json = "";

		foreach($talertcache as $talert)
		{		
			$mns_type_json .= '"'.$talert['id'].'": "'.$talert['code'].'",';
		}
	}

	if(!$smiliecache)
	{
		if(!is_array($smilie_cache))
		{
			$smilie_cache = $cache->read("smilies");
		}
		foreach($smilie_cache as $smilie)
		{
			if($smilie['showclickable'] != 0)
			{
				$smilie['image'] = str_replace("{theme}", $theme['imgdir'], $smilie['image']);
				$smiliecache[$smilie['sid']] = $smilie;
			}
		}
	}

	unset($smilie);

	if(is_array($smiliecache))
	{
		reset($smiliecache);

		$mns_smilies_json = "";

		foreach($smiliecache as $smilie)
		{
			$finds = explode("\n", $smilie['find']);

			// Only show the first text to replace in the box
			$smilie['find'] = $finds[0];

			$find = htmlspecialchars_uni($smilie['find']);
			$image = htmlspecialchars_uni($smilie['image']);
			$findfirstquote = preg_quote($find);
			$findsecoundquote = preg_quote($findfirstquote);
			$mns_smilies_json .= '"'.$findsecoundquote.'": "<img src=\"'.$mybb->asset_url.'/'.$image.'\" />",';
		}
	}

	if(!in_array((int)$mybb->user['usergroup'],explode(',',$mybb->settings['miunanews_grups_acc'])) && $mybb->user['uid']!=0) {
		eval("\$miunanews = \"".$templates->get("miunanewstemplate")."\";");
		eval("\$miunanewsfooter = \"".$templates->get("miunanewsfootertemplate")."\";");
	}

}

function sendPostDataMN($type, $data) {

	global $mybb, $settings;

	$baseurl = $settings['miunanews_server'];
	if (parse_url($baseurl, PHP_URL_SCHEME)=='http') {
		$baseurl = "https://".parse_url($baseurl, PHP_URL_HOST)."";
	}
	if (parse_url($baseurl, PHP_URL_SCHEME)!='https') {
		$baseurl = "https://".$settings['miunanews_server']."";
	}
	$emiturl = $baseurl."/".$type."";
	$ch = curl_init($emiturl);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Origin: http://'.$_SERVER['HTTP_HOST'].'', 'Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	curl_setopt($ch, CURLOPT_USERPWD, "".$settings['miunanews_server_username'].":".$settings['miunanews_server_password']."");
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

if ($settings['miunanews_online'] && $settings['miunanews_newthread']) {
	$plugins->add_hook('newthread_do_newthread_end', 'MNS_newthread');
}
function MNS_newthread()
{
	global $mybb, $tid, $settings, $lang, $forum;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['miunanews_folder_acc']))) {
		$lang->load('admin/config_miunanews');

		if(empty($mybb->user['avatar'])) {
			$mybb->user['avatar'] = "". $settings['bburl'] ."/images/default_avatar.png";
		}
		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid']);
		$avtar_link = build_profile_link("<img src='".$mybb->user['avatar']."' />",$mybb->user['uid']);
		$link = '[url=' . $settings['bburl'] . '/' . get_thread_link($tid) . ']' . $mybb->input['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->miunanews_newthread_lang, $link);

		$data = array(
			"nick" => $name_link,
			"msg" => $linklang,
			"uid" => $mybb->user['uid'],
			"tid" => $tid,
			"url" => "". $settings['bburl'] ."/". get_thread_link($tid) ."",
			"avatar" => $avtar_link,
			"newslimit" => $mybb->settings['miunanews_num_news'],
			"type" => "newthread"
		);

		sendPostDataMN('newnews', $data);
	}
}

if ($settings['miunanews_online'] && $settings['miunanews_newpost']) {
	$plugins->add_hook('newreply_do_newreply_end', 'MNS_newpost');
}
function MNS_newpost()
{
	global $mybb, $tid, $settings, $lang, $url, $thread, $forum, $pid, $visible, $post;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['miunanews_folder_acc'])) && $visible==1) {
		$lang->load('admin/config_miunanews');

		if(empty($mybb->user['avatar'])) {
			$mybb->user['avatar'] = "". $settings['bburl'] ."/images/default_avatar.png";
		}
		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid']);
		$avtar_link = build_profile_link("<img src='".$mybb->user['avatar']."' />",$mybb->user['uid']);
		$MNS_url = htmlspecialchars_decode($url);
		$link = '[url=' . $settings['bburl'] . '/' . $MNS_url . ']' . $thread['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->miunanews_newpost_lang, $link);

		$data = array(
			"nick" => $name_link,
			"msg" => $linklang,
			"post" => htmlspecialchars_uni($post['message']),
			"pid" => $pid,
			"uid" => $mybb->user['uid'],
			"tid" => $tid,
			"url" => "". $settings['bburl'] ."/". $MNS_url ."",
			"avatar" => $avtar_link,
			"newslimit" => $mybb->settings['miunanews_num_news'],
			"type" => "newpost"
		);

		sendPostDataMN('newnews', $data);
	}
}

$plugins->add_hook("admin_config_plugins_begin", "miunanews_edit");
function miunanews_edit()
{
	global $mybb, $PL;

	if($mybb->input['my_post_key'] != $mybb->post_code)
	{
		return;
	}

	$PL or require_once PLUGINLIBRARY;

	if($mybb->input['miunanews'] == 'edit') {
		$result = $PL->edit_core("miunanews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array (
					array(	'search' => array('return array('),
							'before' => array(	'
										global $mybb, $settings;

										if($settings[\'miunanews_myalerts\']) {
											$data = array(
												"uid" => $this->getUserId(),
												"type" => $this->getTypeId()
											);

											sendPostDataMN(\'newmyalert\', $data);
										}
										')
						)
			),
			true
		);
	}

	else if($mybb->input['miunanews'] == 'undo')
	{
		$result = $PL->edit_core("miunanews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array(), true);
	}

	else
	{
		return;
	}

	if($result === true)
	{
		flash_message("The file inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php was modified successfully.", "success");
		admin_redirect("index.php?module=config-plugins");
	}

	else
	{
		flash_message("The file inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php could not be edited. Are the CHMOD settings correct?", "error");
		admin_redirect("index.php?module=config-plugins");
	}
}

?>