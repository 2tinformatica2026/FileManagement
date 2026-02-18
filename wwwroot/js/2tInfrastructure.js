class FileDownload {
    constructor(Token) {
        var containers = document.querySelectorAll("div[data-filedownload]");
        if (containers != null) {
            var This = this;
            for (var i = 0; i < containers.length; i++) {
                var downloadbutton = containers[i].querySelector("span[data-download]");
                downloadbutton.addEventListener('click', function (e) {
                    var downloadbutton = e.target;
                    var container = downloadbutton.parentElement;
                    var url = container.getAttribute('data-url');
                    var progress = container.querySelector('span[data-progress-bar]');
                    var spinner = container.querySelector('img.hourglass');
                    var abortbutton = container.querySelector('span[data-abort]');
                    var error = container.querySelector('span.bi.bi-exclamation');
                    if (!error.classList.contains('d-none')) error.classList.add('d-none');
                    This.#download(url, Token, progress, spinner, abortbutton, downloadbutton, error);
                });
            }
        }
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
    #saveOrOpenFile(blob, FileName) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = FileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { document.body.removeChild(a); window.URL.revokeObjectURL(a.href); }, 0);
    }
    #download(url, Token, progressbar, hourglass, abortbutton, downloadbutton, error) {
        const This = this;
        const xhr = new XMLHttpRequest();
        var perc = 0;
        var aborted = false;
        xhr.open('get', url);
        if (Token != null) xhr.setRequestHeader('Authorization', Token);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3 && perc == 0) {
                hourglass.classList.add('d-none')
                progressbar.classList.remove('d-none');
            }
            if (xhr.readyState == 4) {
                progressbar.innerHTML = '';
                downloadbutton.classList.remove('d-none');
                if (!progressbar.classList.contains('d-none')) progressbar.classList.add('d-none');
                if (!hourglass.classList.contains('d-none')) hourglass.classList.add('d-none');
                if (!abortbutton.classList.contains('d-none')) abortbutton.classList.add('d-none');
                if (xhr.status == 200) {
                    if (xhr.response != null) {
                        var filename = This.#GetFileNameFromHeader(xhr.getAllResponseHeaders());
                        This.#saveOrOpenFile(xhr.response, filename);
                    }
                }
                else if (!aborted) {
                    error.classList.remove('d-none');
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
        downloadbutton.classList.add('d-none');
        xhr.send();
    }
}
class FileUpload {
    constructor(Token) {
        var containers = document.querySelectorAll('div[data-fileupload]');
        if (containers != null) {
            var This = this;
            for (var i = 0; i < containers.length; i++) {
                var btnDownload = containers[i].querySelector('span[data-download]');
                btnDownload.addEventListener('click', function (e) {
                    var container = e.target.parentElement;
                    var downloadurl = container.getAttribute('data-download-url');
                    var progress = container.querySelector('span[data-progress-bar]');
                    var hourglass = container.querySelector('img.hourglass');
                    var abortbutton = container.querySelector('span[data-abort]');
                    var error = container.querySelector('span.bi.bi-exclamation');
                    switch (downloadurl == '') {
                        case true:
                            var file = container.querySelector('input[type="file"]');
                            This.#saveOrOpenFile(file.files[0], file.files[0].name);
                            break;
                        case false:
                            This.#download(downloadurl, Token, progress, hourglass, abortbutton, e.target, error);
                            break;
                    }
                });
                var deletebutton = containers[i].querySelector('span[data-delete]');
                switch (containers[i].getAttribute('data-delete-url') != '') {
                    case true:
                        deletebutton.addEventListener('click', function (e) {
                            var container = e.target.parentElement;
                            var file = container.querySelector('input[type="file"]');
                            var filename = container.querySelector('input[data-file-name]');
                            var error = container.querySelector('span.bi.bi-exclamation');
                            var downloadbutton = container.querySelector('span[data-download]');
                            var deleteurl = container.getAttribute('data-delete-url');
                            This.#delete(deleteurl, Token, file, filename, error, e.target, downloadbutton);
                        });
                        break;
                    case false:
                        deletebutton.addEventListener('click', function (e) {
                            var container = e.target.parentElement;
                            var file = container.querySelector('input[type="file"]');
                            var filename = container.querySelector('input[data-file-name]');
                            filename.value = '';
                            filename.classList.add('d-none');
                            file.value = '';
                            file.classList.remove('d-none');
                        });
                        break;
                };
                var file = containers[i].querySelector('input[type="file"]');
                file.addEventListener('change', function (e) {
                    var file = e.target;
                    var container = file.parentElement;
                    var url = container.getAttribute('data-url');
                    var downloadurl = container.getAttribute('data-download-url');
                    var error = container.querySelector('span.bi.bi-exclamation');
                    var progress = container.querySelector('span[data-progress-bar]');
                    var hourglass = container.querySelector('img.hourglass');
                    var abortbutton = container.querySelector('span[data-abort]');
                    var deletebutton = container.querySelector('span[data-delete]');
                    var filename = container.querySelector('input[data-file-name]');
                    var downloadbutton = container.querySelector('span[data-download]');
                    This.#upload(url, downloadurl, Token, file, filename, error, progress, hourglass, abortbutton, deletebutton, downloadbutton);
                });
                var filename = containers[i].querySelector('input[data-file-name]');
                if (filename.value != '') {
                    filename.classList.remove('d-none');
                    btnDownload.classList.remove('d-none');
                    deletebutton.classList.remove('d-none');
                    file.classList.add('d-none');
                }
            }
        }
    }
    #delete(url, Token, file, filename, error, deletebutton, downloadbutton) {
        const SuccessfulDelete = new Event('SuccessfulDelete', { bubbles: true, cancelable: true, composed: false })
        const xhr = new XMLHttpRequest();
        xhr.open('delete', url);
        if (Token != null) xhr.setRequestHeader('Authorization', Token);
        xhr.onloadend = function () {
            if (xhr.status == 200) {
                filename.value = '';
                filename.classList.add('d-none');
                file.value = '';
                file.classList.remove('d-none');
                downloadbutton.classList.add('d-none');
                document.dispatchEvent(SuccessfulDelete);
            } else {
                deletebutton.classList.remove('d-none');
                error.classList.remove('d-none');
            }
        }
        deletebutton.classList.add('d-none');
        xhr.send();
    }
    #upload(url, downloadurl, Token, file, filename, error, progress, spinner, abortbutton, deletebutton, downloadbutton) {
        const SuccessfulUpload = new Event('SuccessfulUpload', { bubbles: true, cancelable: true, composed: false })
        if (file.files.length > 0) {
            var aborted = false;
            const xhr = new XMLHttpRequest();
            xhr.open('post', url);
            if (Token != null) xhr.setRequestHeader('Authorization', Token);
            var fileData = new FormData();
            fileData.append('file', file.files[0], file.files[0].name);
            xhr.onloadend = function () {
                if (!spinner.classList.contains('d-none')) spinner.classList.add('d-none');
                if (!abortbutton.classList.contains('d-none')) abortbutton.classList.add('d-none');
                if (!progress.classList.contains('d-none')) progress.classList.add('d-none');
                if (xhr.status == 200) {
                    deletebutton.classList.remove('d-none');
                    filename.value = file.files[0].name;
                    filename.classList.remove('d-none');
                    file.classList.add('d-none');
                    if (downloadurl != '') file.value = '';
                    downloadbutton.classList.remove('d-none');
                    document.dispatchEvent(SuccessfulUpload);
                } else if (!aborted) {
                    error.classList.remove('d-none');
                    file.value = '';
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
                        spinner.classList.remove('d-none');
                    }
                } else {
                    progress.innerHTML = Math.round(e.loaded / 1000) + ' Mb downloaded';
                }
            }
            xhr.send(fileData);
        }
    }
    #download(url, Token, progressbar, hourglass, abortbutton, downloadbutton, error) {
        const This = this;
        const xhr = new XMLHttpRequest();
        var perc = 0;
        var aborted = false;
        xhr.open('get', url);
        if (Token != null) xhr.setRequestHeader('Authorization', Token);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3 && perc == 0) {
                hourglass.classList.add('d-none')
                progressbar.classList.remove('d-none');
            }
            if (xhr.readyState == 4) {
                progressbar.innerHTML = '';
                downloadbutton.classList.remove('d-none');
                if (!progressbar.classList.contains('d-none')) progressbar.classList.add('d-none');
                if (!hourglass.classList.contains('d-none')) hourglass.classList.add('d-none');
                if (!abortbutton.classList.contains('d-none')) abortbutton.classList.add('d-none');
                if (xhr.status == 200) {
                    if (xhr.response != null) {
                        var filename = This.#GetFileNameFromHeader(xhr.getAllResponseHeaders());
                        This.#saveOrOpenFile(xhr.response, filename);
                    }
                }
                else if (!aborted) {
                    error.classList.remove('d-none');
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
        downloadbutton.classList.add('d-none');
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
