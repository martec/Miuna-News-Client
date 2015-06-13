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

$l['miunanews_plug_desc'] = 'Websocket News for Mybb.';
$l['miunanews_sett_desc'] = 'Settings for the Miuna News.';
$l['miunanews_onoff_title'] = 'Enable Miuna News?';
$l['miunanews_onoff_desc'] = 'Set here if you want enable or disable Miuna News.';
$l['miunanews_newslimit_title'] = 'Amount of news';
$l['miunanews_newslimit_desc'] = 'Set here amount of news that will appear.';
$l['miunanews_newsmyalimit_title'] = 'Amount of Myalerts news';
$l['miunanews_newsmyalimit_desc'] = 'Set here amount of news generated by Myalerts that will appear.';
$l['miunanews_nogrp_title'] = 'Group without permission to use';
$l['miunanews_nogrp_desc'] = 'Set here group that does not has permission to use Miuna News.';
$l['miunanews_news_title'] = 'Title of Miuna News';
$l['miunanews_news_desc'] = 'Set here title of Miuna News that will appear.';
$l['miunanews_server_title'] = 'Link to Miuna News server';
$l['miunanews_server_desc'] = 'Set here your Miuna News server address.';
$l['miunanews_socketio_title'] = 'Socket.io address';
$l['miunanews_socketio_desc'] = 'Set here adress that miuna shout box will connect.<br />For openshift users recommended "wss://xxxxxx.rhcloud.com:8443" (replacing xxxxxx with your account).';
$l['miunanews_serusr_title'] = 'Miuna News Server Username';
$l['miunanews_serusr_desc'] = 'Provide News of your Miuna News Server.';
$l['miunanews_serpass_title'] = 'Miuna News Server Passsword';
$l['miunanews_serpass_desc'] = 'Provide Password of your Miuna News Server.';
$l['miunanews_newpost_title'] = 'New post';
$l['miunanews_newpost_desc'] = 'Show news alert when someone post in thread.';
$l['miunanews_newthread_title'] = 'New thread';
$l['miunanews_newthread_desc'] = 'Show news alert when someone post new thread.';
$l['miunanews_foldacc_title'] = 'Folder ignored by new post and new thread';
$l['miunanews_foldacc_desc'] = 'Set here folder that Miuna News will ignore when someone post in forum (value in id).<br />Separate each forum id with comma.';
$l['miunanews_newpost_lang'] = 'posted in thread {1}';
$l['miunanews_newthread_lang'] = 'posted new thread {1}';
$l['miunanews_dataf_title'] = 'Date Format';
$l['miunanews_dataf_desc'] = 'Set here date format (Options of format you can check in http://momentjs.com/docs/).';
$l['miunanews_newpostcolor_title'] = 'New Post Color';
$l['miunanews_newpostcolor_desc'] = 'Set here color used by Miuna News for New Post';
$l['miunanews_newthreadcolor_title'] = 'New Thread Color';
$l['miunanews_newthreadcolor_desc'] = 'Set here color used by Miuna News for New Thread';
$l['miunanews_myalertscolor_title'] = 'New Myalerts Color';
$l['miunanews_myalertscolor_desc'] = 'Set here color used by Miuna News for New Myalerts alert';
$l['miunanews_myalertonoff_title'] = 'Myalert support';
$l['miunanews_myalertonoff_desc'] = 'Set here if you want enable myalert support. This feature require myalert installed and myalerts.php edited.';
?>