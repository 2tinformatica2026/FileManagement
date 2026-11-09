#  Complete infrastructure for file upload and download management

## 1 Introduction

Our solution is based on 5 logical elements:
- Two Javascript classes;
- Two html structures;
- A stylesheet;
- A net core class;
- Three service patterns for implementing insert, delete, and download operations.
The reference development environment is Asp net core 8, Bootstrap 5.3x and the 2tInfrastructure.css stylesheet.

## 2	FileUpload control
La classe Javascript FileUpload implementa la gestione completa della selezione, salvataggio, download ed eliminazione di un file.
L’interfaccia utente mostra la progressione di caricamento, con possibilità di arrestarlo, eliminazione e download del file caricato:

Upload panel

<img width="482" height="283" alt="image 01" src="https://github.com/user-attachments/assets/20251c11-d1ec-449c-98da-dfbaaa545659" />
<br>
<br>
<img width="472" height="277" alt="image 02" src="https://github.com/user-attachments/assets/03af9772-f52c-4fcd-9ac8-1be95cc87b13" />
<br>
<br>
<img width="461" height="270" alt="image 03" src="https://github.com/user-attachments/assets/4efca459-3a08-40c1-99ef-6aa8b083712d" />
<br>
<br>
<img width="457" height="268" alt="image 04" src="https://github.com/user-attachments/assets/fce22dc1-ee75-4df0-9842-30774467b8df" />
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
    <td></td>
  </tr>
  <tr>
    <td>PK_2</td>
    <td>some type</td>
    <td></td>
  </tr>
  <tr>
    <td>PK_n</td>
    <td>some type</td>
    <td></td>
  </tr>
</table>

