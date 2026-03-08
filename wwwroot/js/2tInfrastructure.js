class FileUploadDelete {
    constructor() { }
    delete(params) {
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
                    if (xhr.status==200) document.dispatchEvent(fuDeleted);
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
}
class FileUpload extends FileUploadDelete {
    constructor(Token, Group, InsertUrl, DeleteUrl, DownloadUrl, FileNameUrl) {
        super();
        var containers = document.querySelectorAll('div[data-fileupload][data-group="'+ Group + '"]');
        if (containers != null) {
            var This = this;
            for (var i = 0; i < containers.length; i++) {
                //download
                var btnDownload = containers[i].querySelector('span[data-download]');
                btnDownload.addEventListener('click', function (e) {
                    var container = e.target.parentElement;
                    var file = container.querySelector('input[type="file"]');
                    var filename = container.querySelector('input[data-file-name]');
                    var urlparams = new URLSearchParams(JSON.parse(container.getAttribute('data-json-key'))).toString();
                    var progress = container.querySelector('span[data-progress-bar]');
                    var hourglass = container.querySelector('img.hourglass');
                    var abortbutton = container.querySelector('span[data-abort]');
                    var deletebutton = container.querySelector('span[data-delete]');
                    var error = container.querySelector('span.bi.bi-exclamation');
                    This.#download(DownloadUrl + '?' + urlparams, Token, file, filename, progress, hourglass, abortbutton, deletebutton, e.target, error);
                });
                //delete
                var deletebutton = containers[i].querySelector('span[data-delete]');
                deletebutton.addEventListener('click', function (e) {
                    var container = e.target.parentElement;
                    var filename = container.querySelector('input[data-file-name]');
                    var file = container.querySelector('input[type="file"]');
                    var error = container.querySelector('span.bi.bi-exclamation');
                    var downloadbutton = container.querySelector('span[data-download]');
                    var dataurlparams = new URLSearchParams(JSON.parse(container.getAttribute('data-json-key'))).toString();
                    var params = {
                        url: DeleteUrl + '?' + dataurlparams,
                        Token: Token,
                        file: file,
                        filename: filename,
                        error: error,
                        deletebutton: e.target,
                        downloadbutton: downloadbutton
                    };
                    var fuBeforeDeleteFile = new Event('fuBeforeDeleteFile', { bubbles: true, cancelable: true, composed: false })
                    fuBeforeDeleteFile.cancel = false;
                    fuBeforeDeleteFile.params = params;
                    document.dispatchEvent(fuBeforeDeleteFile);
                    if (!fuBeforeDeleteFile.cancel) { This.delete(params); }
                });
                //upload
                var file = containers[i].querySelector('input[type="file"]');
                file.addEventListener('change', function (e) {
                    var file = e.target;
                    var container = file.parentElement;
                    var dataurlparams = new URLSearchParams(JSON.parse(container.getAttribute('data-json-key'))).toString();
                    var error = container.querySelector('span.bi.bi-exclamation');
                    var progress = container.querySelector('span[data-progress-bar]');
                    var hourglass = container.querySelector('img.hourglass');
                    var abortbutton = container.querySelector('span[data-abort]');
                    var deletebutton = container.querySelector('span[data-delete]');
                    var filename = container.querySelector('input[data-file-name]');
                    var downloadbutton = container.querySelector('span[data-download]');
                    This.#upload(InsertUrl + '?' + dataurlparams, Token, file, filename, error, progress, hourglass, abortbutton, deletebutton, downloadbutton);
                });
                //set initial configuration
                if (FileNameUrl != null && FileNameUrl != '') {
                    var filename = containers[i].querySelector('input[data-file-name]');
                    var error = containers[i].querySelector('span.bi.bi-exclamation');
                    var urlparams = new URLSearchParams(JSON.parse(containers[i].getAttribute('data-json-key'))).toString();
                    this.#FileNameAndFootprint(FileNameUrl + '?' + urlparams, Token, filename, btnDownload, deletebutton, file, error);
                }
            }
        }
    }
    #upload(url, Token, file, filename, error, progress, hourglass, abortbutton, deletebutton, downloadbutton) {
        const SuccessfulUpload = new Event('SuccessfulUpload', { bubbles: true, cancelable: true, composed: false })
        if (file.files.length > 0) {
            var aborted = false;
            const xhr = new XMLHttpRequest();
            xhr.open('post', url);
            xhr.responseType = 'json';
            if (Token != null && Token != '') xhr.setRequestHeader('Authorization', Token);
            var fileData = new FormData();
            fileData.append('file', file.files[0], file.files[0].name);
            xhr.onloadend = function () {
                if (!hourglass.classList.contains('d-none')) hourglass.classList.add('d-none');
                if (!abortbutton.classList.contains('d-none')) abortbutton.classList.add('d-none');
                if (!progress.classList.contains('d-none')) progress.classList.add('d-none');

                switch (xhr.status) {
                    case 200:
                        deletebutton.classList.remove('d-none');
                        filename.value = xhr.response.filename;
                        filename.setAttribute('data-file-footprint', xhr.response.footprint);
                        filename.classList.remove('d-none');
                        file.classList.add('d-none');
                        file.value = '';
                        downloadbutton.classList.remove('d-none');
                        document.dispatchEvent(SuccessfulUpload);
                        break;
                    case 409:
                        error.classList.remove('d-none');
                        deletebutton.classList.remove('d-none');
                        filename.value = xhr.response.filename;
                        filename.setAttribute('data-file-footprint', xhr.response.footprint);
                        filename.classList.remove('d-none');
                        file.classList.add('d-none');
                        file.value = '';
                        downloadbutton.classList.remove('d-none');
                        break;
                    default:
                        if (!aborted) {
                            error.classList.remove('d-none');
                            file.value = '';
                        };                        
                }
            }
            xhr.upload.onloadstart = function () {
                if (!error.classList.contains('d-none')) error.classList.add('d-none');
                progress.classList.remove('d-none');
                abortbutton.classList.remove('d-none');
                abortbutton.onclick = function () {
                    aborted = true;
                    progress.classList.add('d-none');
                    abortbutton.classList.add('d-none');
                    file.value = '';
                    xhr.abort();
                };
            }
            xhr.upload.onprogress = function (e) {
                if (e.total > 0) {
                    const perc = Math.round((e.loaded / e.total) * 100);
                    progress.innerHTML = perc + '%';
                    if (perc == 100) {
                        abortbutton.classList.add('d-none');
                        progress.classList.add('d-none');
                        hourglass.classList.remove('d-none');
                    }
                } else {
                    progress.innerHTML = Math.round(e.loaded / 1000) + ' Mb downloaded';
                }
            }
            xhr.send(fileData);
        }
    }
    #download(url, Token, file, filename, progressbar, hourglass, abortbutton, deletebutton, downloadbutton, error) {
        const This = this;
        const xhr = new XMLHttpRequest();
        var perc = 0;
        var aborted = false;
        xhr.open('get', url);
        if (Token != null && Token !='') xhr.setRequestHeader('Authorization', Token);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3 && perc == 0) {
                hourglass.classList.add('d-none')
                progressbar.classList.remove('d-none'); }
            if (xhr.readyState == 4) {
                progressbar.innerHTML = '';
                if (!progressbar.classList.contains('d-none')) progressbar.classList.add('d-none');
                if (!hourglass.classList.contains('d-none')) hourglass.classList.add('d-none');
                if (!abortbutton.classList.contains('d-none')) abortbutton.classList.add('d-none');
                switch (xhr.status) {
                    case 200:
                        setTimeout(function () {
                            downloadbutton.classList.remove('d-none');
                            deletebutton.classList.remove('d-none');
                        }, 100);
                        var RecoveredFileName = This.#GetFileNameFromHeader(xhr.getResponseHeader('content-disposition'));
                        var footprint = xhr.getResponseHeader('footprint');
                        var currentfootprint = filename.getAttribute('data-file-footprint');
                        if (footprint != currentfootprint || filename.value != RecoveredFileName) {
                            error.classList.remove('d-none');
                            filename.value = RecoveredFileName;
                            filename.setAttribute('data-file-footprint', footprint);
                        }
                        This.#saveOrOpenFile(xhr.response, RecoveredFileName);
                        break;
                    case 204: // no file
                        error.classList.remove('d-none');
                        filename.value = '';
                        filename.setAttribute('data-file-footprint', '');
                        filename.classList.add('d-none');
                        file.classList.remove('d-none');
                        break;
                    default:
                        setTimeout(function () {
                            downloadbutton.classList.remove('d-none');
                            deletebutton.classList.remove('d-none');
                        }, 100);
                        if (!aborted) error.classList.remove('d-none');
                }
            }
        }
        xhr.onprogress = function (e) {
            if (e.total > 0) {
                perc = Math.round((e.loaded / e.total) * 100);
                progressbar.innerHTML = perc + '%';
            } else {
                progressbar.innerHTML = Math.round(e.loaded / 1024) + ' Kb downloaded';
            }
        }
        if (hourglass != null) hourglass.classList.remove('d-none');
        if (abortbutton != null) {
            abortbutton.classList.remove('d-none');
            abortbutton.onclick = function (e) {
                aborted = true;
                e.stopPropagation();
                abortbutton.classList.add('d-none');
                xhr.abort();
            };
        }
        if (!error.classList.contains('d-none')) error.classList.add('d-none');
        deletebutton.classList.add('d-none');
        downloadbutton.classList.add('d-none');
        if (!error.classList.contains('d-none')) error.classList.add('d-none');
        xhr.send();
    }
    #FileNameAndFootprint(url, Token, filename, btnDownload, deletebutton, file, error) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', url);
        if (Token != null && Token != '') xhr.setRequestHeader('Authorization', Token);
        xhr.responseType = 'json';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (xhr.response != null) {
                        filename.value = xhr.response.filename;
                        filename.setAttribute('data-file-footprint', xhr.response.footprint);
                        filename.classList.remove('d-none');
                        btnDownload.classList.remove('d-none');
                        deletebutton.classList.remove('d-none');
                        file.classList.add('d-none');
                    }
                }
                else if (xhr.status != 204) { error.classList.remove('d-none'); }
            }
        }
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
