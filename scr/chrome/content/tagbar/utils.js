var gTTBPreferences = {
	pref: Components.classes["@mozilla.org/preferences-service;1"].
	  getService(Components.interfaces.nsIPrefBranch),

	getIntPref: function(str, def) {
		try {
			return this.pref.getIntPref(str);
		} catch(e) {
			return def;
		}
	},

	getBoolPref: function(str, def) {
		try {
			return this.pref.getBoolPref(str);
		} catch(e) {
			return def;
		}
	},

	copyUnicharPref: function(str, def) {
		try{
			if ( Services.vc.compare(Services.appinfo.platformVersion, '58') < 0 ) {
				return this.pref.getComplexValue(str, Components.interfaces.nsISupportsString).data;
			} else {
				return this.pref.getStringPref(str)
			}
		}catch(e){
			return def;
		}
	},

	setIntPref: function(str, val) {
		return this.pref.setIntPref(str, val);
	},

	setBoolPref: function(str, val) {
		return this.pref.setBoolPref(str, val);
	},

	setUnicharPref: function(str, val) {
		var sstr = Components.classes["@mozilla.org/supports-string;1"].
							createInstance(Components.interfaces.nsISupportsString);
		sstr.data = val;
		if ( Services.vc.compare(Services.appinfo.platformVersion, '58') < 0 ) {
			this.pref.setComplexValue(str, Components.interfaces.nsISupportsString, sstr);
		} else {
			this.pref.setStringPref(str, sstr.data);
		}
	}
}
