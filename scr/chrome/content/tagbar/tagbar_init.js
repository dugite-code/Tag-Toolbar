var gTagToolbar;

//Override Original Functions
var OnTagsChangeOrg = window.OnTagsChange;
if (OnTagsChangeOrg) {
	OnTagsChange = function() {
		if (gTTBPreferences.getBoolPref("ttb.hide_tags_hdr", false)) {
			//hide tags row in header view
			var setTagHeaderOrg = window.SetTagHeader;
			window.SetTagHeader = function() {};
			OnTagsChangeOrg.apply(this, arguments);
			window.SetTagHeader = setTagHeaderOrg;
		} else {
			OnTagsChangeOrg.apply(this, arguments);
		}
		gTagToolbar.initTagToolbarContainer();
	};
}

var MailToolboxCustomizeDoneOrg = MailToolboxCustomizeDone;
//var MailToolboxCustomizeDone = function(aToolboxChanged, customizePopupId) {
var MailToolboxCustomizeDone = function() {
	MailToolboxCustomizeDoneOrg.apply(this, arguments);
	gTagToolbar.updateTagToolbar();
	//if (!gTagToolbar.inToolbar) gTagToolbar.buildCatList();
};

function initTagToolbar(aEvent)
{
	if (!aEvent) return;
	
	var doc = aEvent.originalTarget;
	if (doc.location && doc.location.protocol == "chrome:") {
		var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].
													getService(Components.interfaces.nsIWindowMediator);
		var parent = windowMediator.getMostRecentWindow("mail:3pane");
		if (window == parent) parent = null;
		//var parent = window.opener ? window.opener : null;
		if (!gTagToolbar) {
			gTagToolbar = new TagToolbar(parent);
			gTagToolbar.initTagToolbar();
		}
	}
	
	//folder listener
	var win = document.getElementById("messengerWindow");
	if (win.getAttribute("windowtype") == "mail:3pane" && !TTBFolderListener.registered) {
		var notificationService = Components.classes["@mozilla.org/messenger/msgnotificationservice;1"]  
															.getService(Components.interfaces.nsIMsgFolderNotificationService);  
		notificationService.addListener(TTBFolderListener, notificationService.msgAdded);
		TTBFolderListener.registered = true;
	}
	
	//to parse X-TagToolbar-Keys header
	var customHdrs = gTTBPreferences.copyUnicharPref("mailnews.customDBHeaders", "").split(" ");
	if (customHdrs.indexOf("x-tagtoolbar-keys") == -1) customHdrs.push("x-tagtoolbar-keys");
	gTTBPreferences.setUnicharPref("mailnews.customDBHeaders", customHdrs.join(" "));
	
	var hdrListener = {
		onStartHeaders: function() {},
		onEndHeaders: function() {},
		onEndAttachments: function() {},
		onBeforeShowHeaderPane: function() {
			//hide tags row in header view 
			if (gTTBPreferences.getBoolPref("ttb.hide_tags_hdr", false)) delete currentHeaderData.tags;
		}
	}
	
	gMessageListeners.push(hdrListener);
	/*
	if (gTTBPreferences.getBoolPref("ttb.thread_bgcolor_style", false)) {
		var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
    	                .getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"]
    	                .getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI("chrome://tagbar/skin/tagColors.css", null, null);
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	}
	*/
}
window.addEventListener("load", initTagToolbar, true);

function finalizeTagToolbar()
{
	if (gTagToolbar.inToolbar) gTagToolbar.finalize();
}
window.addEventListener("unload", finalizeTagToolbar, false);