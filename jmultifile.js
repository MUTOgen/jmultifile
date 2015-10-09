(function( $ ){
    $.jmultifile = function(element, options) {

        var defaults = {
            'label' : 'Присоединить файлы (до 10 файлов, jpg,png,doc,docx и др., не более 5Мб каждый)',
            'containerClass'  : 'form-group col-md-12',
            'linkId' : 'file-add-more',
            'linkLabel' : 'Добавить еще файл',
            'afterInputContainer' : 'p',
            'afterInputClass' : 'add_file',
            'afterInputText' : 'Выберите файл',
            'wrapperFileClass' : 'btn btn-primary btn-file',
            'wrapperFileId' : 'file-wrapper',
            'wrapperBlockClass' : 'file-block',
            'maxSize' : 5,
            'maxFile' : 5,
            'allowedExt': 'all',
            'errorSize' : 'Неверный размер файла! Выберите файл объемом менее 5Мб',
            'errorType' : 'Неверный формат файла!'
        };

        var plugin = this;
        plugin.settings = {'emptyBlock':''};

        var $element = $(element),
            element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            var $wrapperClasses = plugin.settings.wrapperFileClass.split(' ');
            var $container = $("<div>", {class: plugin.settings.containerClass});
            var $wrapper = $("<div>", {class: plugin.settings.wrapperBlockClass});
            var $after = $("<"+plugin.settings.afterInputContainer+">", {class: plugin.settings.afterInputClass}).html(plugin.settings.afterInputText);
            var $link = $("<a>", {id: plugin.settings.linkId});
            $link.attr('href','#').html(plugin.settings.linkLabel);
            $container.append(
                $("<label>").html(plugin.settings.label)
            ).append(
                $wrapper.append(
                    $("<div>", {class: plugin.settings.wrapperFileClass, id: plugin.settings.wrapperFileId})
                ).append(
                    $after
                )
            );
            $element.after($container);
            $container.after($link);
            var $newinput = $element.clone();
            $newinput.appendTo('div#'+plugin.settings.wrapperFileId);
            $element.remove();
            plugin.settings.emptyBlock = $wrapper.clone();


            $(document).on('change','div.'+$wrapperClasses.join('.')+' input',plugin.appendFile);
            $(document).on('click','a#'+plugin.settings.linkId,plugin.appendBlock);
        };

        plugin.appendFile = function( ) {
            var fileName = $(this).val().split('/').pop().split('\\').pop();
            var tmp = fileName.split('.');
            var types = null;
            var flag = false;
            if(plugin.settings.allowedExt!='all'){
                types = plugin.settings.allowedExt.split(' ');
            }
            if(types){
                for(var i=0;i<types.length;i++){
                    if(tmp[1]==types[i]){
                        flag = true;
                    }
                }
                if(flag){
                    $(this).closest('.'+plugin.settings.wrapperBlockClass).find(plugin.settings.afterInputContainer).text(fileName);
                }else{
                    $(this).closest('.'+plugin.settings.wrapperBlockClass).find(plugin.settings.afterInputContainer).text(plugin.settings.errorType);
                    $(this).replaceWith($(this).clone());
                    return;
                }
            }else{
                $(this).closest('.'+plugin.settings.wrapperBlockClass).find(plugin.settings.afterInputContainer).text(fileName);
            }

            if ( window.FileReader && window.File && window.FileList && window.Blob )
            {
                var size = $(this)[0].files[0].size;
                if(size>plugin.settings.maxSize*1024*1024){
                    $(this).closest('.'+plugin.settings.wrapperBlockClass).find(plugin.settings.afterInputContainer).text(plugin.settings.errorSize);
                    $(this).replaceWith($(this).clone());
                }
            }
        };

        plugin.appendBlock = function( ) {
            var count = $('.'+plugin.settings.wrapperBlockClass).length;
            if(count==plugin.settings.maxFile){
                return false;
            }
            if(count==plugin.settings.maxFile-1){
                $(this).hide();
            }

            var block = plugin.settings.emptyBlock.clone().css('clear','both');

            $(this).prev().append(block);
            return false;
        };
        plugin.init();

    };

    $.fn.jmultifile = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('jmultifile')) {
                var plugin = new $.jmultifile(this, options);
                $(this).data('jmultifile', plugin);
            }
        });
    };

})( jQuery );