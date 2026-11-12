# Complete infrastructure for file upload and download

## 1  Introduction

Our solution is based on 5 logical elements:

- Two Javascript classes;
- Two html structures;
- A stylesheet;
- A net core class;
- Three service patterns for implementing insert, delete, and download operations.

The reference development environment is Asp net core 8, Bootstrap 5.3x and the 2tInfrastructure.css stylesheet.

## 2	FileUpload control

The Javascript FileUpload class implements full handling of selecting, saving, downloading, and deleting a file.
The user interface displays the upload progression, with the ability to stop, delete, and download the uploaded file:

Upload panel
</br>
<img width="482" height="283" alt="image 01" src="https://github.com/user-attachments/assets/4edfd7ae-54eb-41f3-97b4-374008a24822" />
</br>
</br>
<img width="472" height="277" alt="image 02" src="https://github.com/user-attachments/assets/a5490eeb-d8ba-4d0b-868d-8e875661e269" />
</br>
</br>
<img width="461" height="270" alt="image 03" src="https://github.com/user-attachments/assets/e862b96f-724b-429b-9029-8935cd0e7024" />
</br>
</br>
<img width="457" height="268" alt="image 04" src="https://github.com/user-attachments/assets/65710487-df31-40b9-8b85-bd9f4ce31156" />
</br>
</br>
Operation requires the implementation of three services:

- Saving the file with the post method;
- Delete the file with delete method;
- Download the file with get method.

The basic tabular structure is as follows:
</br>
<table>
  <tr>
    <th>column</th>
    <th>type</th>
    <th>description</th>
  </tr>
  <tr>
    <td>PK_1</td>
    <td>some type</td>
    <td>description</td>
  </tr>
  <tr>
    <td>PK_2</td>
    <td>some type</td>
    <td>description</td>
  </tr>
  <tr>
    <td>PK_n</td>
    <td>some type</td>
    <td>description</td>
  </tr>
  <tr>
    <td>File_Buffer</td>
    <td>Image / Varbinary(max)</td>
    <td>The file</td>
  </tr>
  <tr>
    <td>File_Name</td>
    <td>Varchar(100)</td>
    <td>Filename with extension</td>
  </tr>
  <tr>
    <td>Mime_Type</td>
    <td>Varchar(100)</td>
    <td>Returned Javascript Mime Type</td>
  </tr>
</table>
</br>
PK 1…n represent the primary key.
</br>

## 2.1	Operating logic

The operating logic arises from observing the use cases of this type of control within user interfaces. Below are three of the most common cases:

<ins><strong>Documentation for admission tests</strong></ins> 
</br>
<table>
  <tr>
    <td>
      Identity card
    </td>
    <td>
      <img width="535" height="48" alt="image 05" src="https://github.com/user-attachments/assets/3c5f25b2-5dd8-4648-a193-2d36ac94ace6" />
    </td>
  </tr>
  <tr>
    <td>
      Fiscal code
    </td>
    <td>
      <img width="535" height="48" alt="image 05" src="https://github.com/user-attachments/assets/3c5f25b2-5dd8-4648-a193-2d36ac94ace6" />
    </td>
  </tr>
  <tr>
    <td>
      CV
    </td>
    <td>
      <img width="535" height="48" alt="image 05" src="https://github.com/user-attachments/assets/3c5f25b2-5dd8-4648-a193-2d36ac94ace6" />
    </td>
  </tr>
  <tr>
    <td>
      Photo
    </td>
    <td>
      <img width="535" height="48" alt="image 05" src="https://github.com/user-attachments/assets/3c5f25b2-5dd8-4648-a193-2d36ac94ace6" />
    </td>
  </tr>
</table>

The user is invited to enter 4 types of documents
</br>
</br>


<ins><strong>Message Attachments</strong></ins>
</br>
<table>
  <tr>
    <td>Attachment</td>
    <td><img width="535" height="48" alt="image 05" src="https://github.com/user-attachments/assets/3c5f25b2-5dd8-4648-a193-2d36ac94ace6" /></td>
  </tr>
</table>
</br>
The user can enter any number of documents he wants
</br>
</br>
<ins><strong>Contract annexes</strong></ins>
</br>
<img width="593" height="144" alt="image 06" src="https://github.com/user-attachments/assets/12948d31-bdab-4340-8dbb-0c6af1cb609c" />
</br>
The user can enter any number of documents indicating their type.
</br>
</br>
Now for each of the three cases we assume a minimal tabular structure.
</br>
</br>
<strong>Competitor_Documents</strong>
<table>
  <tr>
    <td>Pk</td>
    <td>Test_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td>Pk</td>
    <td>Competitor_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td>Pk</td>
    <td>Doc_Type</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td></td>
    <td>File_Buffer</td>
    <td>Image / Varbinary(max), not null</td>
  </tr>
  <tr>
    <td></td>
    <td>File_Name</td>
    <td>Varchar(100), not null</td>
  </tr>
  <tr>
    <td></td>
    <td>Mime_Type</td>
    <td>Varchar(100), not null</td>
  </tr>
</table>

</br>
</br>
<strong>Message Attachments</strong>
<table>
  <tr>
    <td>Pk</td>
    <td>Message_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td>Pk</td>
    <td>File_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td></td>
    <td>File_Buffer</td>
    <td>Image / Varbinary(max), not null</td>
  </tr>
  <tr>
    <td></td>
    <td>File_Name</td>
    <td>Varchar(100), not null</td>
  </tr>
  <tr>
    <td></td>
    <td>Mime_Type</td>
    <td>Varchar(100), not null</td>
  </tr>
</table>
</br>
</br>
<strong>Contract_Annexes</strong>
<table>
  <tr>
    <td>Pk</td>
    <td>Contract_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td>Pk</td>
    <td>Customer_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td>Pk</td>
    <td>Doc_Type</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td>Pk</td>
    <td>File_Id</td>
    <td>Int, not null</td>
  </tr>
  <tr>
    <td></td>
    <td>File_Buffer</td>
    <td>Image / Varbinary(max), not null</td>
  </tr>
  <tr>
    <td></td>
    <td>File_Name</td>
    <td>Varchar(100), not null</td>
  </tr>
  <tr>
    <td></td>
    <td>Mime_Type</td>
    <td>Varchar(100), not null</td>
  </tr>
</table>
</br>

Note how before inserting a new record a part of the primary key is already known:
</br>
1.	Admission Test Documentation	=> full key
2.	Message Attachments    		    => Message_Id
3.	Contract Attachments		      => Contract_Id, Customer_Id, Doc_Type
<br/>
After inserting the new record we will instead have:
<br/>
<br/>
1.	Admission Test Documentation	=> full key<br/>
2.	Message Attachments    		    => Message_Id, <strong>File_Id</strong><br/>
3.	Contract Attachments		      => Contract_Id, Customer_Id, Doc_Type, <strong>File_Id</strong><br/>

<br/>
Therefore, the partial key is required to insert a new file, while the complete key will allow it to be downloaded and deleted.

Both, in the html implementation of the control, are represented by the values of the following properties, respectively:

<strong>[data-partial-url-params]</strong> and <strong>[data-url-params]</strong>.

<strong>data-partial-url-params</strong> must be valued either during the loading phase of the web page or subsequently, via JavaScript, when its value comes from a previous action (see the case of contract attachments).

<strong>data-url-params must</strong> instead be valued by the web service's response to the insertion of the new record. Both Json and url params formats are allowed:</br></br>

data-partial-url-params = '{"Message_Id":1025}' or data-partial-url-params = "Message_Id=1025" </br></br>

data-url-params = '{"Message_Id":1025,"File_Id":12}' or data-url-params = "Message_Id=1025&File_Id=12" </br></br>

Below is a minimal example of the three required web services.</br><br>

```csharp

//
[Authorize]
[HttpGet]
[Route("mycontroller/DownloadTemporaryDocument")]
public ActionResult DownloadTemporaryDocument(int User_Id, int Doc_Type, int Doc_Number)
{
	//retrive the document here
	return File(……);
}
//
[Authorize]
[HttpDelete]
[Route("mycontroller/DeleteTemporaryDocument")]
public ActionResult DeleteTemporaryDocument(int User_Id, int Doc_Type, int Doc_Number)
{
	//delete the document here
	return Ok();
}

//

[Authorize]
[HttpPost]
[Route("mycontroller/SaveTemporaryDocument")]
public ActionResult SaveTemporaryDocument(IFormFile file, int User_Id, int Doc_Type)
{
  var number = (db.User_Documents.Where(x=> x.User_Id == User_Id).Select(x=>(int?)x.Doc_Number).Max()?? 0)+1;
  //add new record here
  return Ok(“User_Id=” + User_Id.ToString() + “&Doc_Type =” + Doc_Type.ToString()  +  “&Doc_Number=” + number.ToString());
}
```
## 2.2	http status codes managed by the Javascript FileUpload class

The Javascript FileUpload class handles the following http status codes:</br>
<table>
	<tr>
		<th><strong>Service</strong></th>
		<th><strong>HTTP Method</strong></th>
		<th><strong>Triggering process</strong></th>
		<th><strong>HTTP status code</strong></th>
	</tr>
	<tr>
		<td align="center">Upload</td>
		<td align="center">Post</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>Process successfully terminated</td>
		<td align="center">200</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">unauthorized user <img width="20" height="20" alt="image 07" src="https://github.com/user-attachments/assets/5860cf44-2532-4adb-8eec-f1d16eb6193d" /></td>
		<td align="center">401</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">
			Failed process <img width="20" height="20" alt="image 09" src="https://github.com/user-attachments/assets/2451459d-301b-47bd-b04a-b91529e50ccb" />
		</td>
		<td align="center">All other status codes</td>
	</tr>
		<tr>
		<td align="center">Download</td>
		<td align="center">Get</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>Process successfully terminated</td>
		<td align="center">200</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">Process terminated successfully but record no longer exists. The control will be configured in Upload mode by reporting the anomaly graphically <img width="20" height="20" alt="image 08" src="https://github.com/user-attachments/assets/d79ed232-f1e6-4671-a424-9c18d8b76ac9" /></td>
		<td align="center">204</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">unauthorized user <img width="20" height="20" alt="image 07" src="https://github.com/user-attachments/assets/5860cf44-2532-4adb-8eec-f1d16eb6193d" /></td>
		<td align="center">401</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">
			Failed process <img width="20" height="20" alt="image 09" src="https://github.com/user-attachments/assets/2451459d-301b-47bd-b04a-b91529e50ccb" />
		</td>
		<td align="center">All other status codes</td>
	</tr>
	</tr>
		<tr>
		<td align="center">Delete</td>
		<td align="center">Delete</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td>Process terminated successfully. The control will configure itself in Upload mode</td>
		<td align="center">200, 204</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">unauthorized user <img width="20" height="20" alt="image 07" src="https://github.com/user-attachments/assets/5860cf44-2532-4adb-8eec-f1d16eb6193d" /></td>
		<td align="center">401</td>
	</tr>
	<tr>
		<td></td>
		<td></td>
		<td valign="middle">
			Failed process <img width="20" height="20" alt="image 09" src="https://github.com/user-attachments/assets/2451459d-301b-47bd-b04a-b91529e50ccb" />
		</td>
		<td align="center">All other status codes</td>
	</tr>
</table>
</br>
</br>

## 2.3	Html Structure

```html

<div class="row user-select-none">
	<div class="col-7 col-md-5 col-lg-4">
		<label>Some document</label>
		<div class="input-group"
			 data-component="file-upload"
			 data-group="Contract_Annexes"
			 data-partial-url-params='{"Contract_Id":1005,"Customer_Id":"1000","Doc_Type":1}'
			 data-url-params="">
			<input type="file" class="form-control" required /> <!-- adding required attribute if the document is considered mandatory -->
			<span class="form-control rounded-3 d-none" data-file-name></span>
			<span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
			<span class="mt-auto mb-auto ms-2 d-none" data-role="progress-bar"></span>
			<img class="hourglass hourglass-sm d-none" data-role="hourglass" />
			<span class="btn btn-close mt-auto mb-auto ms-2 d-none" data-role="abort"></span>
			<span class="btn mt-auto mb-auto fs-5 ms-2 p-0 bi bi-download d-none" data-role="download" ></span>
			<span class="btn mt-auto mb-auto ms-2 p-0 bi bi-trash d-none" data-role="delete"></span>
		</div>
	</div>
</div>

```
<strong><ins>Elements description</ins></strong></br></br>
<table>
	<tr>
		<th align="center" width="150"><strong>html element</strong></th>
		<th align="center" width="250"><strong>attribute name and value</strong></th>
		<th align="center"><strong>purpose</strong></th>
	</tr>
	<tr>
		<td align="center" valign="middle">div</td>
		<td align="center" valign="middle">data-component="file-upload"</td>
		<td align="center" valign="middle" align="justify">This is the container control. The Javascript FileUpload class will select all elements with these characteristics within the DOM</td>
	</tr>
	<tr>
		<td align="center" valign="middle"></td>
		<td align="center" valign="middle">data-group</td>
		<td align="center" valign="middle" align="justify">It is intended to group one or more containers during the call to the RegisterTheGroup(Token, Group, InsertUrl, DeleteUrl, DownloadUrl) method of the Javascript FileUpload class</td>
	</tr>
	<tr>
		<td align="center" valign="middle"></td>
		<td align="center" valign="middle">data-partial-url-params</td>
		<td align="center" valign="middle" align="justify">It is the partial key required by the web service "InsertUrl" named in the call of the previous method "RegisterTheGroup"</td>
	</tr>
	<tr>
		<td align="center" valign="middle"></td>
		<td align="center" valign="middle">data-url-params</td>
		<td align="center" valign="middle" align="justify">It is the complete key of the inserted record that must be returned by the previous web service either in json format or in url params format</td>
	</tr>
	<tr>
		<td align="center" valign="middle">input</td>
		<td align="center" valign="middle">type="file"</td>
		<td align="center" valign="middle" align="justify">It is the input element of file type and class "form-control" that provides for the loading of the desired file</td>
	</tr>
	<tr>
		<td align="center" valign="middle">span</td>
		<td align="center" valign="middle">data-file-name</td>
		<td align="center" valign="middle" align="justify">This element is entrusted with the task of indicating the existence of the file by showing its name and extension. When registering the control via FileUpload's RegisterTheGroup method, the presence of the file name will place the control state in download and delete modes with the display of the relevant buttons</td>
	</tr>
	<tr>
		<td align="center" valign="middle">span</td>
		<td align="center" valign="middle">data-role="error"</td>
		<td align="center" valign="middle" align="justify">It can show two icons: The first one at an http status code 401, to signal the user's failure to authenticate, the second one for all other http statuses other than 200</td>
	</tr>
	<tr>
		<td align="center" valign="middle">span</td>
		<td align="center" valign="middle">data-role="progress-bar"</td>
		<td align="center" valign="middle" align="justify">Shows the percentage of progression in both the upload and download phases</td>
	</tr>
	<tr>
		<td align="center" valign="middle">img</td>
		<td align="center" valign="middle">data-role="hourglass"</td>
		<td align="center" valign="middle" align="justify">Show an hourglass during the intermediate upload and download processing stages</td>
	</tr>
	<tr>
		<td align="center" valign="middle">span</td>
		<td align="center" valign="middle">data-role="abort"</td>
		<td align="center" valign="middle" align="justify">This is the button to cancel the upload and download process</td>
	</tr>
	<tr>
		<td align="center" valign="middle">span</td>
		<td align="center" valign="middle">data-role="download"</td>
		<td align="center" valign="middle" align="justify">It's the button to start the download</td>
	</tr>
	<tr>
		<td align="center" valign="middle">span</td>
		<td align="center" valign="middle">data-role="delete"</td>
		<td align="center" valign="middle" align="justify">It's the button to delete the file</td>
	</tr>
</table>
</br>
</br>

## 2.4	Javascript FileUpload
</br>

```javascript

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
            container: container,
            filenameText: container.querySelector('span[data-file-name]').innerText
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

```
</br>
The class implements 7 private methods (preceded by the # character) and 3 public methods:
</br>
</br>
<table>
	<tr>
		<th width="500" align="center" valign="middle" align="justify"><strong>Method</strong></th>
		<th align="center" valign="middle" align="justify"><strong>Description</strong></th>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#KeyToURLSearchParams(key)</td>
		<td align="center" valign="middle" align="justify">Called internally to convert a key from a Json format to a Params URL format. If an error occurs, it returns a null value.</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">Reset(containerId)</td>
		<td align="center" valign="middle" align="justify">Forces control in the input state by deleting any value of the container's data-url-returned-params attribute.</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">RegisterTheGroup(Token, Group, InsertUrl, DeleteUrl, DownloadUrl)</td>
		<td align="center" valign="middle" align="justify">E’ the method that must be called to initialize the control or controls. Token represents a string of type BearerToken. If existing it will be added in the request header. Group identifies the group of controls with which the same three web services will be associated.</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#BaseParameters(group, token, ServiceUrl, container)</td>
		<td align="center" valign="middle" align="justify">Returns an object with the Group, Token, Url attributes of the context-related web service, the container, and the file name with the extension.</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#CompleteParameters(baseParameters)</td>
		<td align="center" valign="middle" align="justify">Returns an object with all the attributes and elements of the control.</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#upload(BaseParameters)</td>
		<td align="center" valign="middle" align="justify">Upload the file via a FormData instance and transfer it to the dedicated web service along with any partial key in url params format.</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#download(BaseParameters)</td>
		<td align="center" valign="middle" align="justify">Retrieve the file via the indicated web service and the complete key and save or open it in the user's browser</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">delete(BaseParameters)</td>
		<td align="center" valign="middle" align="justify">It allows you to delete the file using the indicated web service and the complete key</td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#saveOrOpenFile(blob, FileName)</td>
		<td align="center" valign="middle" align="justify">Save or open the file in the user's Browser </td>
	</tr>
	<tr>
		<td align="center" valign="middle" align="justify">#GetFileNameFromHeader(header)</td>
		<td align="center" valign="middle" align="justify">Extracts the file name with extension from the header of the response received from the download web service</td>
	</tr>
</table>
</br>
</br>

## 2.5	Example of use
</br>
<strong><ins>ER diagram</ins></strong></br></br>
<img width="801" height="201" alt="image 10" src="https://github.com/user-attachments/assets/f8cfc666-179c-4a94-b1f6-bf0f09657c1b" />
</br>

```html

<div class="row user-select-none">
	<div class="col-7 col-md-5 col-lg-4">
		<label>Identity card</label>
		<div class="input-group"
			 data-component="file-upload"
			 data-group="UserDocuments"
			 data-partial-url-params='{"User_Id":1005,"Doc_Type":1}'
			 data-url-params="">
			<input type="file" class="form-control" required /> <!-- adding required attribute if the document is considered mandatory -->
			<span class="form-control rounded-3 d-none" data-file-name></span>
			<span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
			<span class="mt-auto mb-auto ms-2 d-none" data-role="progress-bar"></span>
			<img class="hourglass hourglass-sm d-none" data-role="hourglass" />
			<span class="btn btn-close mt-auto mb-auto ms-2 d-none" data-role="abort"></span>
			<span class="btn mt-auto mb-auto fs-5 ms-2 p-0 bi bi-download d-none" data-role="download" ></span>
			<span class="btn mt-auto mb-auto ms-2 p-0 bi bi-trash d-none" data-role="delete"></span>
		</div>
	</div>
	<div class="col-7 col-md-5 col-lg-4">
		<label>Identity card</label>
		<div class="input-group"
			 data-component="file-upload"
			 data-group="UserDocuments"
			 data-partial-url-params='{"User_Id":1005,"Doc_Type":2}'
			 data-url-params="">
			<input type="file" class="form-control" required /> <!-- adding required attribute if the document is considered mandatory -->
			<span class="form-control rounded-3 d-none" data-file-name></span>
			<span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
			<span class="mt-auto mb-auto ms-2 d-none" data-role="progress-bar"></span>
			<img class="hourglass hourglass-sm d-none" data-role="hourglass" />
			<span class="btn btn-close mt-auto mb-auto ms-2 d-none" data-role="abort"></span>
			<span class="btn mt-auto mb-auto fs-5 ms-2 p-0 bi bi-download d-none" data-role="download" ></span>
			<span class="btn mt-auto mb-auto ms-2 p-0 bi bi-trash d-none" data-role="delete"></span>
		</div>
	</div>
	<div class="col-7 col-md-5 col-lg-4">
		<label>Identity card</label>
		<div class="input-group"
			 data-component="file-upload"
			 data-group="UserDocuments"
			 data-partial-url-params='{"User_Id":1005,"Doc_Type":3}'
			 data-url-params="">
			<input type="file" class="form-control" required /> <!-- adding required attribute if the document is considered mandatory -->
			<span class="form-control rounded-3 d-none" data-file-name></span>
			<span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
			<span class="mt-auto mb-auto ms-2 d-none" data-role="progress-bar"></span>
			<img class="hourglass hourglass-sm d-none" data-role="hourglass" />
			<span class="btn btn-close mt-auto mb-auto ms-2 d-none" data-role="abort"></span>
			<span class="btn mt-auto mb-auto fs-5 ms-2 p-0 bi bi-download d-none" data-role="download" ></span>
			<span class="btn mt-auto mb-auto ms-2 p-0 bi bi-trash d-none" data-role="delete"></span>
		</div>
	</div>
</div>
<script>
	const fu = new FileUpload();
	fu.RegisterTheGroup('',
	                    'UserDocuments',
	                    '/SaveTemporaryDocument',
	                    '/RemoveTemporaryDocument',
	                    '/DownloadTemporaryDocument');
</script>
```

