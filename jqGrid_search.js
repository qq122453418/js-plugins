/*
	jqGrid 前端筛选功能
*/
function GridSearch(grid){
	//克隆对象
	this.clone_obj = function(data){
		var d;
		if($.type(data) == 'array' ){
			d = [];
            for(i in data){
                d[i] = data[i];
            }
        }else if($.type(data) == 'object'){
			d = {};
            for(i in data){
                d[i] = data[i];
            }
		}else{
            d = data;
        }
		return d;
	}
	
	//根据键值删除指定的元素
	this.delete_val_by_key = function(keys, arr){
		for(var j=0,i=0; i<keys.length; i++){
			arr.splice(keys[i-j], 1);
			j++;
		}
		return arr;
	}
	
    this.grid = grid;
    this.result = [];
    this.search_param = null;
	this.r  = [];
    this.data = [];
    if(this.data.length == 0){
        var data = $(grid).getGridParam('readonlydata');
		this.data = this.clone_obj(data);
    }
	//console.log(this.data.length);
	
    //初始化result
    this.init_result = function(){
		this.result = this.clone_obj(this.data);
    }
	
	//初始化 r
	this.init_r = function(){
		this.r = [];
	}

    //设置筛选参数
    this.set_search_param = function(search_param){
        this.search_param = search_param;
    }
    
    //筛选规则
    /*模糊筛选*/
    this.vagueSearch = function(str, column){
		this.init_r();
        var re = new RegExp(str, "i");
		// var is = [];
        for(var i=0; i<this.result.length; i++){
            if(re.test(this.result[i][column])){
				this.r.push(this.clone_obj(this.result[i]));
				// is[is.length] = i;
            }
        }
		
		// this.result = this.delete_val_by_key(is, this.result);
		this.result = this.clone_obj(this.r);
    }

    /*区间查找*/
    this.betweenSearch = function(start, end, column){
		this.init_r();
		// var is = [];
        for(var i=0; i<this.result.length; i++){
			
            if(this.result[i][column] >= start && this.result[i][column] <= end){
				
                this.r.push(this.clone_obj(this.result[i]));
				// is[is.length] = i;
            }
        }
		// this.result = this.delete_val_by_key(is, this.result);
		this.result = this.clone_obj(this.r);
    }

    /*根据参数选择规则筛选*/
    this.select = function(params){
        //var rule_name = params.rule_name;
		
        switch(params.rule_name){
            case 'between':
				//console.log(this.result);
                this.betweenSearch(params.start, params.end, params.column);
                break;
            case 'vague':
                this.vagueSearch(params.str, params.column);
                break;
        }
    }

    /*清空 result */
    this.clearResult = function(){
        this.result = [];
    }

    //执行筛选
    this.search = function(){
        this.init_result();
        this.init_r();
		
        if(this.search_param){
            if($.type(this.search_param) == 'array'){
                for(var i=0; i <= this.search_param.length; i++){
					if(this.search_param[i]){
						this.select(this.search_param[i]);
					}
                }
            }else{
                this.select(this.search_param);
            }
        }
		
        //重新加载数据
		$('#table_list_1').jqGrid('clearGridData');
        $(this.grid).jqGrid('setGridParam',{data:this.result}).trigger('reloadGrid');
		this.clearResult();
		this.init_r();
    }

}
