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
<br>
<img width="482" height="283" alt="image 01" src="https://github.com/user-attachments/assets/4edfd7ae-54eb-41f3-97b4-374008a24822" />
<br>
<br>
<img width="472" height="277" alt="image 02" src="https://github.com/user-attachments/assets/a5490eeb-d8ba-4d0b-868d-8e875661e269" />
<br>
<br>
<img width="461" height="270" alt="image 03" src="https://github.com/user-attachments/assets/e862b96f-724b-429b-9029-8935cd0e7024" />
<br>
<br>
<img width="457" height="268" alt="image 04" src="https://github.com/user-attachments/assets/65710487-df31-40b9-8b85-bd9f4ce31156" />
<br>
<br>
Operation requires the implementation of three services:

- Saving the file with the post method;
- Delete the file with delete method;
- Download the file with get method.

The basic tabular structure is as follows:
<br>
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
<br>
PK 1…n represent the primary key.
<br>

## 2.1	Operating logic

The operating logic arises from observing the use cases of this type of control within user interfaces. Below are three of the most common cases:

<span><strong>Documentation for admission tests</strong></span> 
<br>
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
<br>
The user is invited to enter 4 types of documents
<br>
<span><strong>Message Attachments</strong></span>
<br>
<table>
  <tr>
    <td>Attachment</td>
    <td><img width="535" height="48" alt="image 05" src="https://github.com/user-attachments/assets/3c5f25b2-5dd8-4648-a193-2d36ac94ace6" /></td>
  </tr>
</table>
<br>
The user can enter any number of documents he wants








