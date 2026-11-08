using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using [Application Name].File;
using [Application Name].Models;
using [Application Name].Models.Supplier;
using [Application Name].SuppliersDb;
using [Application Name].cryptografy;
using System.Data;
using System.Diagnostics;
using System.Security.Claims;

namespace Northwind.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult AddSupplierDocument(IFormFile file, int SupplierID, int DocumentType)
        {
            // When the process is aborted file is set to null.
            if (file == null) return Ok();
            using (var db = new Database())
            {
                // Let's check if the document exists.
                var exist = db.suppliersDocuments.Any(c=> upplierID == c.SupplierID && c.DocumentType == DocumentType);
                // If the document does not exist we insert it. 
                if (!exist)
                {
                    byte[] buffer = UploadedFileReader.ToArray(file);
                    SuppliersDocuments doc = new SuppliersDocuments()
                    {
                        SupplierID = SupplierID,
                        DocumentType = DocumentType,
                        FileName = file.Filename,
                        MimeType = file.ContentType,
                        Buffer = buffer,
                    };
                    db.Add(doc);
                    db.SaveChanges();
                    // We return the Key
                    return Ok(SuppliersDocumentsKey.JsonKey(SupplierID, DocumentType));
                }
                // If the document is already present we return the http code 409 along with the file name and its footprint.
                else return StatusCode(StatusCodes.Status409Conflict, document);
            }
        }
        [HttpGet]
        public IActionResult DownloadSupplierDocument(int SupplierID, int DocumentType)
        {
            // Let's try to load the document contents into an instance of the FileContent class.
            using (var db = new Database())
            {
               var result = (from doc in db.suppliersDocuments
                             where doc.SupplierID == SupplierID && doc.DocumentType == DocumentType
                             select new FileContent
                             {
                                 Buffer = doc.Buffer,
                                 FileName = doc.FileName,
                                 MimeType = doc.MimeType,
                             } ).FirstOrDefault();
               // If the document exists we return the http 200 code along with its FileContent instance. 
               if (result!=null) return File(FileContent.Buffer, FileContent.MimeType, FileContent.FileName);;
               // If the document does not exist we return the 204 http code.
               return StatusCode(StatusCodes.Status204NoContent);
            }
        }
        [HttpDelete]
        public IActionResult DeleteSupplierDocument(int SupplierID, int DocumentType)
        {
            using (var db = new Database())
            {
                // Let's check if the document exists.
                if (db.suppliersDocuments.Any(x=>(x.SupplierID==SupplierID && x.DocumentType == DocumentType)))
                {
                    // Let's delete the document.
                    SuppliersDocuments doc = new SuppliersDocuments
                    {
                        SupplierID = SupplierID,
                        DocumentType = DocumentType,
                    };
                    db.Remove(doc);
                    db.SaveChanges();
                    return Ok();
                }
                // If the document does not exist let's return the http code 204.
                else return StatusCode(StatusCodes.Status204NoContent);
            }
        }
        [HttpGet]
        public IActionResult SupplierDocuments(int SupplierID, string CompanyName)
        {
            return View(new SupplierDocumentsEditor() { CompanyName = CompanyName, SupplierID = SupplierID });
        }
        [HttpPost]
        public IActionResult SupplierDocuments(SupplierDocumentsEditor editor)
        {
           return View(editor);
        }
    }
}
