if(typeof replyToolJsLoaded === "undefined") { replyToolJsLoaded = {}; }
document.write("<link rel=\"stylesheet\" href=\"/ib/public/guestarea/styles/app.css?v=20fcdd9\">");
document.write("<script type=\"text/javascript\" src=\"/ib/public/guestarea/scripts/vendor.js?v=20fcdd9\"></script>");
document.write("<script type=\"text/javascript\" src=\"/ib/public/guestarea/scripts/app.js?v=20fcdd9\"></script>");
replyToolJsLoaded["guestarea"] = true;

if((document.getElementsByTagName("tool-ricerca-filiali").length>0 ||
		document.getElementsByTagName("tool-appuntamento").length>0) && !replyToolJsLoaded["appuntamento"]) {
	document.write("<script type=\"text/javascript\" src=\"/ib/public/vetrina/appuntamento/main_app.js\"></script>");
}
if(document.getElementsByTagName("tool-form-reclami").length>0 && !replyToolJsLoaded["reclami"]) {
	if(!replyToolJsLoaded["appuntamento"]) {
		document.write("<script type=\"text/javascript\" src=\"/ib/public/vetrina/appuntamento/main_app.js\"></script>");
	}
	document.write("<script type=\"text/javascript\" src=\"/ib/public/vetrina/reclami/main_app.js\"></script>");
}
