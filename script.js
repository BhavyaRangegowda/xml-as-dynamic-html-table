// JavaScript Document

//url of xml file
var extXmlURL = "courses.xml";

var multifilter = {
	init: function(){
		this.addEventListener();
	},
	
	addEventListener: function(){
		//adding event listner to class
		$$('a[class="external_courses"]').each(function(ext_courses){
			ext_courses.observe('click', multifilter.externalCourseSearch)
		});
		
	},
externalCourseSearch: function(event){
		var firstParse = $(event.target).readAttribute('id');
		multifilter.parseXML.get(extXmlURL, function(xmlDoc){
			var external_params = new Array(xmlDoc, firstParse, 'onlinecourses');
			multifilter.getExternalResultTables(external_params);
		});
	},
	getExternalResultTables: function(external_params){
		//alert(external_params);
		var nodeDoc = external_params[0];
		var firstEle = external_params[1];
		var parent = external_params[2];

		var tab_tr, tab_td;
		var srch_parent = nodeDoc.getElementsByTagName(parent)[0];
	
		var tab_bdy = document.getElementById("external_srch_datas");
		//has child nodes
		if(srch_parent.hasChildNodes) 
		{
			srch_child = srch_parent.getElementsByTagName(firstEle);
			//Length of matching tags
			srch_child_size = srch_child.length;
			$$('.mf_head_tr').each(function(headtr){
				headtr.remove(); //Removes header for multiple clicks
			});
			
			var extrows = srch_child[0].getElementsByTagName("rowdetails")[0].getElementsByTagName("rownames")[0].firstChild.nodeValue;
			//Split row details xml  node values by ','
			var rowsplit = extrows.split(',');
			var extrows_count = rowsplit.length;
			
			//append rows and columns to table body external_srch_datas
			tab_tr = tab_bdy.insertRow(tab_bdy.rows.length);
			tab_tr.className = "acqToptable mf_head_tr";
			for(var i=0; i<extrows_count; i++)
			{
				tab_td = tab_tr.insertCell(tab_tr.cells.length);
				tab_td.innerHTML = rowsplit[i];
				
			}

			if(srch_child_size > 0)
			{
				$$('.ext_mf_rem_tr').each(function(tds){
					tds.remove();
				});
				//detect course tag inside data tags
				var extdata = srch_child[0].getElementsByTagName("data")[0].getElementsByTagName("course");
				var extdata_count = extdata.length;
				
				
				//loop to get all the node values
				for(var i=0; i<extdata_count; i++)
				{
					tab_tr = tab_bdy.insertRow(tab_bdy.rows.length);
					tab_tr.className = "acqTableContent ext_mf_rem_tr";
					
					for(var j=0; j<extrows_count; j++)
					{
						tab_td = tab_tr.insertCell(tab_tr.cells.length);
						//write column xml tag values
						tab_td.innerHTML = extdata[i].getElementsByTagName("column"+(j+1))[0].firstChild.nodeValue;
						
					}
				}
				
			}
			else
			{
				$$('.ext_mf_rem_tr').each(function(tds){
					tds.remove();
				});
				
				tab_tr = tab_bdy.insertRow(tab_bdy.rows.length);
				tab_tr.className = "acqTableContent ext_mf_rem_tr";
				
				tab_td = tab_tr.insertCell(tab_tr.cells.length);
				tab_td.setAttribute('valign', 'middle');

				tab_td.colSpan = 2;
				tab_td.className = "tdContentPadding";
				tab_td.innerHTML = "No data were found; please try a different search";
			}
		}
		
		$('mfsrch_datas').style.display = "none";
		$('fusion_static_content').style.display = "none";
		$('fusion_resls').style.display = "block";
	},
	
}
//ajax requset
multifilter.parseXML = (function() {
    return{
        get:function(url, callback) {
            new Ajax.Request(url, {
                method: 'get',
				contentType : 'application/xml',
				onLoading: function(data){
					if((url == xmlURL) && data.readyState == 1)
					{
						$('load_course').innerHTML = '<img src="http://sierrafire.cr.usgs.gov/images/loading.gif" alt="" border="0" /> Please wait, loading courses...';
						$('load_course').style.display = 'block';
					}
					else
					{
						$('load_course').innerHTML = '';
						$('load_course').style.display = 'none';
					}
				},

                onSuccess: function(data) {
					if(data.readyState == 4)
					{
						$('load_course').innerHTML = '';
						$('load_course').style.display = 'none';
		
						var res = data.responseXML;
						callback(res);
					}
                }
            });
        }
    }    
})();

Event.observe(window, 'load', function() {
	multifilter.init();
});