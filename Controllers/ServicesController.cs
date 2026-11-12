using Microsoft.AspNetCore.Mvc;
using FileManagement.Models;
using FileManagement.File;
using System.Diagnostics;
namespace FileManagement.Controllers
{
    public class ServicesController : Controller
    {
        private readonly ILogger<ServicesController> _logger;
        private IStringLocalizer<ServicesController> _localizer;
        private IConfiguration _configuration;

        public ServicesController(ILogger<HomeController> logger, IStringLocalizer<HomeController> localizer, IConfiguration configuration)
        {
            _logger = logger;
            _localizer = localizer;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Services/SaveTemporaryDocument")]
        public ActionResult SaveTemporaryDocument(IFormFile file, int UserId, int DocType)
        {
            if (file != null)
            {
                using (var db = new AuthorizationDb())
                {
                    var DocId = (db.Users_Documents.
                                Where(x => x.User_Id == UserId && x.Doc_Type == DocType).
                                Select(x => (int?)x.Doc_Id).
                                Max() ?? 0) + 1;
                    db.Users_Documents.Add(new Users_Documents()
                    {
                        Doc_Id = DocId,
                        Doc_Type = DocType,
                        User_Id = UserId,
                        File_Buffer = UploadedFileReader.ToArray(file),
                        File_Name = file.FileName,
                        Mime_Type = file.ContentType
                    });
                    db.SaveChanges();
                    return Ok("Doc_Id=" + DocId.ToString() + "&Doc_Type=" + DocType.ToString() + "&User_Id=" + UserId.ToString());
                }
            }
            return Ok();
        }

       
    }
}
