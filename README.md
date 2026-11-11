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
		<th align="center"><strong>html element</strong></th>
		<th align="center"><strong>attribute name and value</strong></th>
		<th align="center"><strong>purpose</strong></th>
	</tr>
	<tr>
		<td align="center" valign="middle">div</td>
		<td align="center" valign="middle">data-component="file-upload"</td>
		<td align="center" valign="middle"></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
	<tr>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
		<td align="center" valign="middle"><strong></strong></td>
	</tr>
</table>









