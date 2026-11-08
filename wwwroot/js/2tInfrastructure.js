class FileUpload {
    RegisterTheGroup(Token, Group, InsertUrl, DeleteUrl, DownloadUrl) {
        const containers = document.querySelectorAll('div[data-component="file-upload"][data-group="' + Group + '"]');
        containers.forEach(container => {
            //download
            const btnDownload = container.querySelector('span[data-role="download"]');
            btnDownload.addEventListener('click', (e) => {
                var container = e.target.parentElement;
                var params = this.#BaseParameters(Group, Token, DownloadUrl, container);
                this.#download(params);
            });
            //delete
            const deletebutton = container.querySelector('span[data-role="delete"]');
            deletebutton.addEventListener('click', (e)=> {
                var container = e.target.parentElement;
                var params = this.#BaseParameters(Group, Token, DeleteUrl, container);
                var fuBeforeDeleteFile = new Event('delete.2t.fileupload', { bubbles: true, cancelable: true, composed: false })
                fuBeforeDeleteFile.cancel = false;
                fuBeforeDeleteFile.params = params;
                document.dispatchEvent(fuBeforeDeleteFile);
                if (!fuBeforeDeleteFile.cancel) { this.delete(params); }
            });
            //upload
            const file = container.querySelector('input[type="file"]');
            file.addEventListener('change', (e)=> {
                const file = e.target;
                const container = file.parentElement;
                const params = this.#BaseParameters(Group, Token, InsertUrl, container);
                this.#upload(params);
            });
            //set initial configuration
            const filename = container.querySelector('span[data-file-name]');
            if (file.getAttribute('required') != null) filename.classList.add('is-valid');
            if (filename.innerText != '') {
                file.classList.add('d-none');
                filename.classList.remove('d-none');
                deletebutton.classList.remove('d-none');
                btnDownload.classList.remove('d-none');
            }
        });
    }
    #KeyToURLSearchParams(key) {
        var result = '';
        key = key.trim();
        if (key != '') {
            if (key.startsWith('{') && key.endsWith('}')) {
                try {
                    result = new URLSearchParams(JSON.parse(key)).toString();
                } catch {
                    result = null;
                }
            } else {
                try {
                    result = new URLSearchParams(key).toString();
                } catch {
                    result = null;
                }
            }
        }
        return result;
    }
    write(containerId,fileName, urlParams = null) {
        var container = document.getElementById(containerId);
        var filename = container.querySelector('span[data-file-name]');
        var file = container.querySelector('input[type="file"]');
        var downloadbutton = container.querySelector('span[data-role="download"]');
        var deletebutton = container.querySelector('span[data-role="delete"]');
        fileName = fileName.trim();
        filename.innerText = fileName;
        if (fileName == '') { //upload mode
            filename.classList.add('d-none');
            file.classList.remove('d-none');
            file.value = '';
            downloadbutton.classList.add('d-none');
            deletebutton.classList.add('d-none');
        } else { //download/delete mode
            filename.classList.remove('d-none');
            file.classList.add('d-none');
            file.value = '';
            downloadbutton.classList.remove('d-none');
            deletebutton.classList.remove('d-none');

        }
        if (urlParams != null) container.setAttribute('data-url-params', urlParams);
    }
    #BaseParameters(group, token, ServiceUrl, container) {
        var Parameters = {
            group: group,
            token: token,
            ServiceUrl: ServiceUrl,
            container: container
        };
        return Parameters;
    }
    #CompleteParameters(baseParameters) {
        const urlParams = this.#KeyToURLSearchParams(baseParameters.container.dataset.urlParams);
        const partialUrlParams = this.#KeyToURLSearchParams(baseParameters.container.dataset.partialUrlParams);
        const params = {
            container: baseParameters.container,
            ServiceUrl: baseParameters.ServiceUrl,
            urlParams: urlParams,
            partialUrlParams: partialUrlParams,
            Group: baseParameters.group,
            Token: baseParameters.token,
            file: baseParameters.container.querySelector('input[type="file"]'),
            filename: baseParameters.container.querySelector('span[data-file-name]'),
            downloadbutton: baseParameters.container.querySelector('span[data-role="download"]'),
            deletebutton: baseParameters.container.querySelector('span[data-role="delete"]'),
            abortbutton: baseParameters.container.querySelector('span[data-role="abort"]'),
            error: baseParameters.container.querySelector('span[data-role="error"]'),
            progressbar: baseParameters.container.querySelector('span[data-role="progress-bar"]'),
            hourglass: baseParameters.container.querySelector('img[data-role="hourglass"]')
        };
        return params;
    }
    #upload(BaseParameters) {
        const params = this.#CompleteParameters(BaseParameters);
        if (params.partialUrlParams == null) {
            params.error.classList.add('bi-exclamation-circle');
            params.error.classList.remove('d-none');
            params.file.removeAttribute('disabled');
            params.file.value = '';
        } else
        if (params.file.files.length > 0) {
            var aborted = false;
            const xhr = new XMLHttpRequest();
            xhr.open('post', params.ServiceUrl + (params.partialUrlParams == '' ? '' : '?' + params.partialUrlParams));
            if (params.Token != null && params.Token != '') xhr.setRequestHeader('Authorization', params.Token);
            var fileData = new FormData();
            fileData.append('file', params.file.files[0], params.file.files[0].name);
            xhr.onloadend = ()=> {
                params.hourglass.classList.add('d-none');
                params.abortbutton.classList.add('d-none');
                params.progressbar.classList.add('d-none');
                params.file.removeAttribute('disabled');
                switch (xhr.status) {
                    case 200:
                        params.deletebutton.classList.remove('d-none');
                        params.filename.innerText = params.file.files[0].name;
                        params.filename.classList.remove('d-none');
                        params.file.classList.add('d-none');
                        params.file.value = '';
                        params.downloadbutton.classList.remove('d-none');
                        params.container.dataset.urlParams = xhr.response;
                        var fuSuccessfullySaved = new Event('fuSuccessfullySaved', { bubbles: true, cancelable: true, composed: false })
                        fuSuccessfullySaved.group = params.Group;
                        document.dispatchEvent(fuSuccessfullySaved);
                        break;
                    case 401:// Unauthorized
                        params.error.classList.add('bi-sign-do-not-enter');
                        params.error.classList.remove('d-none');
                        params.file.value = '';
                        break;
                    default:
                        if (!aborted) {
                            params.error.classList.add('bi-exclamation-circle');
                            params.error.classList.remove('d-none');
                            params.file.value = '';
                        };                        
                }
            }
            xhr.upload.onloadstart = function () {
                params.error.classList.add('d-none');
                params.progressbar.classList.remove('d-none');
                params.abortbutton.classList.remove('d-none');
                params.abortbutton.onclick = function () {
                    aborted = true;
                    params.progressbar.classList.add('d-none');
                    params.abortbutton.classList.add('d-none');
                    params.file.value = '';
                    params.file.removeAttribute('disabled');
                    params.file.focus();
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
            params.error.classList.remove('bi-ban', 'bi-exclamation-circle', 'bi-sign-do-not-enter');
            params.file.setAttribute('disabled', '');
            xhr.send(fileData);
        }
    }
    #download(BaseParameters) {
        const params = this.#CompleteParameters(BaseParameters);
        if (params.urlParams == null) {
            params.error.classList.add('bi-exclamation-circle');
            params.error.classList.remove('d-none');
            params.file.removeAttribute('disabled');
            params.file.value = '';
        } else {
            const xhr = new XMLHttpRequest();
            var perc = 0;
            var aborted = false;
            xhr.open('get', params.ServiceUrl + (params.urlParams == '' ? '' : '?' + params.urlParams));
            if (params.token != null && params.token != '') xhr.setRequestHeader('Authorization', params.Token);
            xhr.responseType = 'blob';
            xhr.onreadystatechange = ()=> {
                if (xhr.readyState == 3 && perc == 0) {
                    params.hourglass.classList.add('d-none')
                    params.progressbar.classList.remove('d-none'); }
                if (xhr.readyState == 4) {
                    params.progressbar.innerHTML = '';
                    params.progressbar.classList.add('d-none');
                    params.hourglass.classList.add('d-none');
                    params.abortbutton.classList.add('d-none');
                    switch (xhr.status) {
                        case 200:
                            setTimeout(function () {
                                params.downloadbutton.classList.remove('d-none');
                                params.deletebutton.classList.remove('d-none');
                            }, 100);
                            var RecoveredFileName = xhr.getResponseHeader('content-disposition');
                            if (RecoveredFileName != null) {
                                RecoveredFileName = this.#GetFileNameFromHeader(RecoveredFileName);
                                this.#saveOrOpenFile(xhr.response, RecoveredFileName);
                            } else {
                                params.error.classList.add('bi-exclamation-circle');
                                params.error.classList.remove('d-none');
                            }
                            break;
                        case 204: // no file
                            params.error.classList.add('bi-ban');
                            params.error.classList.remove('d-none');
                            params.filename.innerText = '';
                            params.filename.classList.add('d-none');
                            params.file.classList.remove('d-none');
                            break;
                        case 401: // Unauthorized
                            params.error.classList.add('bi-sign-do-not-enter');
                            params.error.classList.remove('d-none');
                        default:
                            setTimeout(function () {
                                params.downloadbutton.classList.remove('d-none');
                                params.deletebutton.classList.remove('d-none');
                            }, 100);
                            if (!aborted) {
                                params.error.classList.add('bi-exclamation-circle');
                                params.error.classList.remove('d-none');
                            }
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
            params.hourglass.classList.remove('d-none');
            params.abortbutton.classList.remove('d-none');
            params.abortbutton.onclick = function (e) {
                aborted = true;
                e.stopPropagation();
                params.abortbutton.classList.add('d-none');
                xhr.abort();
            };
            params.error.classList.add('d-none');
            params.error.classList.remove('bi-ban', 'bi-exclamation-circle', 'bi-sign-do-not-enter');
            params.deletebutton.classList.add('d-none');
            params.downloadbutton.classList.add('d-none');
            xhr.send();
        }
    }
    delete(BaseParameters) {
        const params = this.#CompleteParameters(BaseParameters);
        if (params.urlParams == null) {
            params.error.classList.add('bi-exclamation-circle');
            params.error.classList.remove('d-none');
            params.file.removeAttribute('disabled');
            params.file.value = '';
        } else {
            const xhr = new XMLHttpRequest();
            xhr.open('delete', params.ServiceUrl + (params.urlParams == '' ? '' : '?' + params.urlParams));
            if (params.Token != null && params.Token != '') xhr.setRequestHeader('Authorization', params.Token);
            xhr.onloadend = function () {
                params.hourglass.classList.add('d-none');
                switch (xhr.status) {
                    case 200:
                        var fuFileDeleted = new Event('deleted.2t.fileupload', { bubbles: true, cancelable: true, composed: false })
                        fuFileDeleted.Group = params.Group;
                        params.container.dataset.urlParams = '';
                        params.filename.innerText = '';
                        params.filename.classList.add('d-none');
                        params.file.value = '';
                        params.file.classList.remove('d-none');
                        params.file.focus();
                        document.dispatchEvent(fuFileDeleted);
                        break;
                    case 401:
                        params.error.classList.add('bi-sign-do-not-enter');
                        params.error.classList.remove('d-none');
                        params.deletebutton.classList.remove('d-none');
                        params.downloadbutton.classList.remove('d-none');
                        break;
                    default:
                        params.deletebutton.classList.remove('d-none');
                        params.downloadbutton.classList.remove('d-none');
                        params.error.classList.add('bi-exclamation-circle');
                        params.error.classList.remove('d-none');
                }
            }
            params.error.classList.remove('bi-ban', 'bi-exclamation-circle', 'bi-sign-do-not-enter');
            params.error.classList.add('d-none');
            params.deletebutton.classList.add('d-none');
            params.downloadbutton.classList.add('d-none');
            params.hourglass.classList.remove('d-none');
            xhr.send();
        }
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
                result = header[i].split("=")[1].trim().replace(/^"|"$/g, "");
                break;
            }
        }
        return result;
    }
}
