class FileUpload {
    #Token;
    #Group;
    #InsertUrl;
    #DownloadUrl;
    #FileNameUrl;
    constructor(Token, Group, InsertUrl, DeleteUrl, DownloadUrl, FileNameUrl, LoadFileNameAndFootprint=true) {
        this.#Token = Token;
        this.#Group = Group;
        this.#InsertUrl = InsertUrl;
        this.#DownloadUrl = DownloadUrl;
        this.#FileNameUrl = FileNameUrl;
        var containers = document.querySelectorAll('div[data-fileupload][data-group="' + Group + '"]');
        if (containers.length > 0) {
            var This = this;
            for (var i = 0; i < containers.length; i++) {
                //download
                var btnDownload = containers[i].querySelector('span[data-download]');
                btnDownload.addEventListener('click', function (e) {
                    var container = e.target.parentElement;
                    This.#download(container);
                });
                //delete
                var deletebutton = containers[i].querySelector('span[data-delete]');
                deletebutton.addEventListener('click', function (e) {
                    var container = e.target.parentElement;
                    var params = This.#RetriveParams(DeleteUrl, container); 
                    var fuBeforeDeleteFile = new Event('fuBeforeDeleteFile', { bubbles: true, cancelable: true, composed: false })
                    fuBeforeDeleteFile.cancel = false;
                    fuBeforeDeleteFile.params = params;
                    document.dispatchEvent(fuBeforeDeleteFile);
                    if (!fuBeforeDeleteFile.cancel) { This.deletefile(params); }
                });
                //upload
                var file = containers[i].querySelector('input[type="file"]');
                file.addEventListener('change', function (e) {
                    var file = e.target;
                    var container = file.parentElement;
                    This.#upload(container);
                });
                //set initial configuration
                if (LoadFileNameAndFootprint) this.#FileNameAndFootprint(containers[i]);
            }
        }
    }
    #RetriveParams(url, container) {
        var file = container.querySelector('input[type="file"]');
        var filename = container.querySelector('input[data-file-name]');
        var urlparams = new URLSearchParams(JSON.parse(container.getAttribute('data-json-key'))).toString();
        var progressbar = container.querySelector('span[data-progress-bar]');
        var hourglass = container.querySelector('img.hourglass');
        var downloadbutton = container.querySelector('span[data-download]');
        var abortbutton = container.querySelector('span[data-abort]');
        var deletebutton = container.querySelector('span[data-delete]');
        var error = container.querySelector('span.bi.bi-exclamation');
        urlparams = url + '?' + urlparams;

        var params = {
            url: urlparams,
            Token: this.#Token,
            file: file,
            filename: filename,
            downloadbutton: downloadbutton,
            deletebutton: deletebutton,
            abortbutton: abortbutton,
            error: error,
            progressbar: progressbar,
            hourglass: hourglass
        };

        return params;

    }
    #upload(container) {
        const SuccessfulUpload = new Event('SuccessfulUpload', { bubbles: true, cancelable: true, composed: false })
        var params = this.#RetriveParams(this.#InsertUrl, container);
        if (params.file.files.length > 0) {
            var aborted = false;
            const xhr = new XMLHttpRequest();
            xhr.open('post', params.url);
            xhr.responseType = 'json';
            if (this.#Token != null && this.#Token != '') xhr.setRequestHeader('Authorization', this.#Token);
            var fileData = new FormData();
            fileData.append('file', params.file.files[0], params.file.files[0].name);
            xhr.onloadend = function () {
                if (!params.hourglass.classList.contains('d-none')) params.hourglass.classList.add('d-none');
                if (!params.abortbutton.classList.contains('d-none')) params.abortbutton.classList.add('d-none');
                if (!params.progressbar.classList.contains('d-none')) params.progressbar.classList.add('d-none');

                switch (xhr.status) {
                    case 200:
                        params.deletebutton.classList.remove('d-none');
                        params.filename.value = xhr.response.filename;
                        params.filename.setAttribute('data-file-footprint', xhr.response.footprint);
                        params.filename.classList.remove('d-none');
                        params.file.classList.add('d-none');
                        params.file.value = '';
                        params.downloadbutton.classList.remove('d-none');
                        document.dispatchEvent(SuccessfulUpload);
                        break;
                    case 409:
                        params.error.classList.remove('d-none');
                        params.deletebutton.classList.remove('d-none');
                        params.filename.value = xhr.response.filename;
                        params.filename.setAttribute('data-file-footprint', xhr.response.footprint);
                        params.filename.classList.remove('d-none');
                        params.file.classList.add('d-none');
                        params.file.value = '';
                        params.downloadbutton.classList.remove('d-none');
                        break;
                    default:
                        if (!aborted) {
                            params.error.classList.remove('d-none');
                            params.file.value = '';
                        };                        
                }
            }
            xhr.upload.onloadstart = function () {
                if (!params.error.classList.contains('d-none')) params.error.classList.add('d-none');
                params.progressbar.classList.remove('d-none');
                params.abortbutton.classList.remove('d-none');
                params.abortbutton.onclick = function () {
                    aborted = true;
                    params.progressbar.classList.add('d-none');
                    params.abortbutton.classList.add('d-none');
                    params.file.value = '';
                    xhr.abort();
                };
            }
            xhr.upload.onprogress = function (e) {
                if (e.total > 0) {
                    const perc = Math.round((e.loaded / e.total) * 100);
                    params.progressbar.innerHTML = perc + '%';
                    if (perc == 100) {
                        params.abortbutton.classList.add('d-none');
                        params.progressbar.classList.add('d-none');
                        params.hourglass.classList.remove('d-none');
                    }
                } else {
                    params.progressbar.innerHTML = Math.round(e.loaded / 1000) + ' Mb downloaded';
                }
            }
            xhr.send(fileData);
        }
    }
    #download(container) {
        const This = this;
        const xhr = new XMLHttpRequest();
        var perc = 0;
        var aborted = false;
        var params = this.#RetriveParams(this.#DownloadUrl, container);
        xhr.open('get', params.url);
        if (this.#Token != null && this.#Token != '') xhr.setRequestHeader('Authorization', this.#Token);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3 && perc == 0) {
                params.hourglass.classList.add('d-none')
                params.progressbar.classList.remove('d-none'); }
            if (xhr.readyState == 4) {
                params.progressbar.innerHTML = '';
                if (!params.progressbar.classList.contains('d-none')) params.progressbar.classList.add('d-none');
                if (!params.hourglass.classList.contains('d-none')) params.hourglass.classList.add('d-none');
                if (!params.abortbutton.classList.contains('d-none')) params.abortbutton.classList.add('d-none');
                switch (xhr.status) {
                    case 200:
                        setTimeout(function () {
                            params.downloadbutton.classList.remove('d-none');
                            params.deletebutton.classList.remove('d-none');
                        }, 100);
                        var RecoveredFileName = This.#GetFileNameFromHeader(xhr.getResponseHeader('content-disposition'));
                        var footprint = xhr.getResponseHeader('footprint');
                        var currentfootprint = params.filename.getAttribute('data-file-footprint');
                        if (footprint != currentfootprint || params.filename.value != RecoveredFileName) {
                            params.error.classList.remove('d-none');
                            params.filename.value = RecoveredFileName;
                            params.filename.setAttribute('data-file-footprint', footprint);
                        }
                        This.#saveOrOpenFile(xhr.response, RecoveredFileName);
                        break;
                    case 204: // no file
                        params.error.classList.remove('d-none');
                        params.filename.value = '';
                        params.filename.setAttribute('data-file-footprint', '');
                        params.filename.classList.add('d-none');
                        params.file.classList.remove('d-none');
                        break;
                    default:
                        setTimeout(function () {
                            params.downloadbutton.classList.remove('d-none');
                            params.deletebutton.classList.remove('d-none');
                        }, 100);
                        if (!aborted) params.error.classList.remove('d-none');
                }
            }
        }
        xhr.onprogress = function (e) {
            if (e.total > 0) {
                perc = Math.round((e.loaded / e.total) * 100);
                params.progressbar.innerHTML = perc + '%';
            } else {
                params.progressbar.innerHTML = Math.round(e.loaded / 1024) + ' Kb downloaded';
            }
        }
        if (params.hourglass != null) params.hourglass.classList.remove('d-none');
        if (params.abortbutton != null) {
            params.abortbutton.classList.remove('d-none');
            params.abortbutton.onclick = function (e) {
                aborted = true;
                e.stopPropagation();
                params.abortbutton.classList.add('d-none');
                xhr.abort();
            };
        }
        if (!params.error.classList.contains('d-none')) params.error.classList.add('d-none');
        params.deletebutton.classList.add('d-none');
        params.downloadbutton.classList.add('d-none');
        if (!params.error.classList.contains('d-none')) params.error.classList.add('d-none');
        xhr.send();
    }
    deletefile(params) {
        var fuDeleted = new Event('fuDeleted', { bubbles: true, cancelable: true, composed: false })
        const xhr = new XMLHttpRequest();
        xhr.open('delete', params.url);
        if (params.Token != null && params.Token != '') xhr.setRequestHeader('Authorization', params.Token);
        xhr.onloadend = function () {
            switch (xhr.status) {
                case 200: case 204:
                    params.filename.value = '';
                    params.filename.setAttribute('data-file-footprint', '');
                    params.filename.classList.add('d-none');
                    params.file.value = '';
                    params.file.classList.remove('d-none');
                    params.downloadbutton.classList.add('d-none');
                    if (xhr.status == 200) document.dispatchEvent(fuDeleted);
                    break;
                default:
                    params.deletebutton.classList.remove('d-none');
                    params.error.classList.remove('d-none');
            }
        }
        if (!params.error.classList.contains('d-none')) params.error.classList.add('d-none');
        params.deletebutton.classList.add('d-none');
        xhr.send();
    }
    refresh() {
        var containers = document.querySelectorAll('div[data-fileupload][data-group="' + this.#Group + '"]');
        if (containers.length > 0) 
            for (var i = 0; i < containers.length; i++) {
                this.#FileNameAndFootprint(containers[i]);
            } 
    }
    #FileNameAndFootprint(container) {
        var params = this.#RetriveParams(this.#FileNameUrl, container);
        const xhr = new XMLHttpRequest();
        xhr.open('get', params.url);
        if (this.#Token != null && this.#Token != '') xhr.setRequestHeader('Authorization', this.#Token);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var currentfilename = params.filename.value;
                var currentfootprint = params.filename.getAttribute('data-file-footprint');
                switch (xhr.status) {
                    case 200:
                        if (currentfilename != '' && currentfootprint != '' && (params.filename.value != currentfilename || currentfootprint != xhr.response.footprint)) params.error.classList.remove('d-none');
                        params.filename.value = xhr.response.filename;
                        params.filename.setAttribute('data-file-footprint', xhr.response.footprint);
                        params.filename.classList.remove('d-none');
                        params.downloadbutton.classList.remove('d-none');
                        params.deletebutton.classList.remove('d-none');
                        if (!params.file.classList.contains('d-none')) params.file.classList.add('d-none');
                        break;
                    case 204:
                        if (currentfilename != '') params.error.classList.remove('d-none');
                        params.filename.value = '';
                        params.filename.setAttribute('data-file-footprint', '');
                        if (!params.filename.classList.contains('d-none')) params.filename.classList.add('d-none'); 
                        if (!params.downloadbutton.classList.contains('d-none')) params.downloadbutton.classList.add('d-none'); 
                        if (!params.deletebutton.classList.contains('d-none')) params.deletebutton.classList.add('d-none');
                        params.file.classList.remove('d-none');
                        break;
                    default:
                        params.error.classList.remove('d-none');
                }
            }
        }
        if (!params.error.classList.contains('d-none')) params.error.classList.add('d-none');
        xhr.send();
    }
    #saveOrOpenFile(blob, FileName) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = FileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { document.body.removeChild(a); window.URL.revokeObjectURL(a.href); }, 0);
    }
    #GetFileNameFromHeader(header) {
        var header = header.split(";");
        var result = null;
        for (var i = 0; i < header.length; i++) {
            if (header[i].match("filename")) {
                result = header[i].split("=")[1];
                break;
            }
        }
        return result;
    }
}