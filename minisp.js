/* MiniSP v1.0 by Kyle Schaeffer // Protiviti */
function minisp(path){
	var files = ['corev15.css','controls15.css','searchv15.css','aclinv.css','controls.css','forms.css','pagelayouts15.css','editmode15.css','wpeditmodev4.css','page-layouts-21.css','edit-mode-21.css','portal.css','storefront.css','socialdata.css','survey.css','search.css'];
	var head = document.getElementsByTagName('head')[0].innerHTML;
	if(head.indexOf('[minisp]') > -1 && head.indexOf('[/minisp]') > -1){
		var links = head.substring(head.indexOf('[minisp]')+8, head.indexOf('[/minisp]')).split('\n');
		for(var i = 0; i < links.length; i++){
			var match = false;
			for(var j = 0; j < files.length; j++){
				if(links[i].toLowerCase().indexOf('/' + files[j]) > -1 || links[i].toLowerCase().indexOf('/corev15-') > -1 && files[j] == 'corev15.css'){
					document.write('<link rel="stylesheet" type="text/css" href="' + path + files[j] + '" />');
					match = true;
					break;
				}
			}
			if(!match){
				document.write(links[i]);
			}
		}
	}
}