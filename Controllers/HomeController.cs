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
                // Let's check if the document exists by loading its name and footprint.
                var document = (from f in db.suppliersDocuments
                               where f.SupplierID == SupplierID && f.DocumentType == DocumentType
                               select new FileNameAndFootprint { filename = f.FileName, footprint = f.filefootprint }).FirstOrDefault();
                // If the document does not exist we insert it. 
                if (document == null)
                {
                    byte[] buffer = UploadedFileReader.ToArray(file);
                    FileNameAndFootprint info = new FileNameAndFootprint(file.FileName, Sha256.Sha256base64string(buffer));
                    SuppliersDocuments doc = new SuppliersDocuments()
                    {
                        SupplierID = SupplierID,
                        DocumentType = DocumentType,
                        FileName = info.filename,
                        MimeType = file.ContentType,
                        Buffer = buffer,
                        filefootprint = info.footprint,
                    };
                    db.Add(doc);
                    db.SaveChanges();
                    // We return the file name and its footprint.
                    return Ok(info);
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
                                 Footprint = doc.filefootprint,
                             } ).FirstOrDefault();
               // If the document exists we return the http 200 code along with its FileContent instance. 
               if (result!=null) return new ExtendedFileContentResult(HttpContext, result);
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
                if (db.suppliersDocuments.Count(x=>(x.SupplierID==SupplierID && x.DocumentType == DocumentType)) > 0)
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
        public IActionResult FileNameAndFootprintSupplierDocument(int SupplierID, int DocumentType)
        {
            using (var db = new Database())
            {
                // Let's get the file name and it's footprint.
                var result = (from doc in db.suppliersDocuments
                             where doc.SupplierID == SupplierID && doc.DocumentType == DocumentType
                             select new FileNameAndFootprint { filename = doc.FileName, footprint = doc.filefootprint }).FirstOrDefault();
                // If the document doesn't exists let's return the http code 204.
                if (result == null) return StatusCode(StatusCodes.Status204NoContent);
                // Let's return the http code 200 and the serialized istance of FileNameAndFootprint. 
                return Ok(result);             
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
