function AJAXForm(eleid)
{
    this.data = null;
	
	this.type = 'get';
	
	this.enctype = 'multipart/form-data';
	
	this.url = '';
	
	this.dataType = '';
	
	this.upload = false;//是否有上传的文件，自动判断
	
	this.filenum = 0; //需要处理的文件数量
    
    this.setele = function(eleid)
    {
        if(eleid)
        {
            var elebox = $(eleid);
			if($(elebox).attr('enctype')){
				this.enctype = $(elebox).attr('enctype');
			}
			if($(elebox).attr('action')){
				this.url = $(elebox).attr('action');
			}
			if($(elebox).attr('method')){
				this.type = $(elebox).attr('method');
			}

            var inputs = $(elebox).find('input[type!="file"]').clone(false),

            textareas = $(elebox).find('textarea').clone(false),

            selects_from_ele = $(elebox).find('select'),
			
			files = $(elebox).find(':file').get();

            _form = document.createElement('form');
            
            for(var i = 0; i<selects_from_ele.length; i++){
                var s = document.createElement('select');
                $(s).attr("name",$(selects_from_ele[i]).attr('name'));
                var op = document.createElement('option');
                $(op).attr('value', $(selects_from_ele[i]).val());
                $(op).attr('selected', 'selected');
                $(s).append(op);
                $(_form).append($(s));
            }
			
			for(var i = 0; i<files.length; i++){
				if(files[i].files.length){
					this.filenum += 1;
					var fr_onload = function(ele,_form,t){
						return function(){
							// var b = new Base64();
							// $(ele).val(b.encode(this.result));
							$(ele).val(this.result);
							$(_form).append(ele);
							t.filenum -= 1;
							if(t.filenum == 0){
								t.data = $(_form).serialize();
								t.send();
							}
						}
					}
					var fr = new FileReader();
					//var b = new Base64();
					this.upload = true;
					//console.log(files[i].files[0]);
					var file_input = document.createElement('input');
					$(file_input).attr('type','text');
					if($(files[i]).attr('name')){
						$(file_input).attr('name',$(files[i]).attr('name'));
					}
					
					fr.readAsDataURL(files[i].files[0]);
					fr.onload = fr_onload(file_input, _form, this);
				}
			}
            
            $(_form).append(inputs);

            $(_form).append(textareas);
			
            if(!this.upload || !this.filenum){
				this.data = $(_form).serialize();
			}
            
        }
    }
    
    this.result = null;

    this.success = function(){};
	this.error = function(){};
	this.complete = function(){};
    
    this.send = function(url,type)
    {
		if(type) this.type = type;
		
		if(url) this.url = url;
		
		if(this.upload){
			if(this.filenum){
				return;
			}
		}
        
        $.ajax({
            url:this.url,
            
            data:this.data,
            
            type:this.type,
			
			enctype: this.enctype,
			
			dataType: this.dataType,
            
            t:this,
            
            success:function(data)
            {
                this.t.result = data;
                
                this.t.success(data);
            },
			error:function(a){
				this.t.error(a);
			},
			complete:function(a){
				this.t.complete(a);
			}
			
        });
    };
    
    if(eleid)
    {
        this.setele(eleid);
    }
}

