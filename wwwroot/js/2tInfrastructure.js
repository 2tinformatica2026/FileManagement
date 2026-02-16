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
                    This.#download(url, Token, progress, spinner, abortbutton, downloadbutton, error)
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
    #saveOrOpenBlob(blob, FileName) {
        //for responseType blob
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = FileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
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
                        This.#saveOrOpenBlob(xhr.response, filename);
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
                var file = containers[i].querySelector('input[type="file"]');
                file.addEventListener('change', function (e) {
                    var file = e.target;
                    var container = file.parentElement;
                    var url = container.getAttribute('data-url');
                    var deleteurl = container.getAttribute('data-delete-url');
                    var error = container.querySelector('span.bi.bi-exclamation');
                    var progress = container.querySelector('span[data-progress-bar]');
                    var spinner = container.querySelector('img.hourglass');
                    var abortbutton = container.querySelector('span[data-abort]');
                    var deletebutton = container.querySelector('span[data-delete]');
                    var filename = container.querySelector('span[data-file-name]');
                    var downloadbutton = container.querySelector('span[data-download]');
                    downloadbutton.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const a = document.createElement('a');
                        a.href = window.URL.createObjectURL(file.files[0]);
                        a.download = file.files[0].name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(a.href);
                    });
                    if (deleteurl != '') {
                        deletebutton.addEventListener('click', function () {
                            This.#delete(deleteurl, Token, file, filename, error, deletebutton, downloadbutton);
                        });
                    } else {
                        deletebutton.addEventListener('click', function () {
                            filename.innerText = '';
                            filename.classList.add('d-none');
                            file.value = '';
                            file.classList.remove('d-none');
                        })
                    }
                    This.#upload(url, Token, file, filename, error, progress, spinner, abortbutton, deletebutton, downloadbutton);
                });
            }
        }
    }
    #delete(url, Token, file, filename, error, deletebutton, downloadbutton) {
        const xhr = new XMLHttpRequest();
        xhr.open('delete', url);
        if (Token != null) xhr.setRequestHeader('Authorization', Token);
        xhr.onloadend = function () {
            if (xhr.status == 200) {
                filename.innerText = '';
                filename.classList.add('d-none');
                file.value = '';
                file.classList.remove('d-none');
                downloadbutton.classList.add('d-none');
            } else {
                deletebutton.classList.remove('d-none');
                error.classList.remove('d-none');
            }
        }
        deletebutton.classList.add('d-none');
        xhr.send();
    }
    #upload(url, Token, file, filename, error, progress, spinner, abortbutton, deletebutton, downloadbutton) {
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
                    filename.innerText = file.files[0].name;
                    filename.classList.remove('d-none');
                    file.classList.add('d-none');
                    downloadbutton.classList.remove('d-none');
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
}