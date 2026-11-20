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

        [HttpGet]
        [Route("Services/DownloadTemporaryDocument")]
        public async Task<ActionResult> DownloadTemporaryDocument(int User_Id, int Doc_Type, int Doc_Id)
        {
            using(var db = new AuthorizationDb())
            {
                var document = await db.Users_Documents.
                    Where(x=> x.User_Id==User_Id && x.Doc_Type==Doc_Type && x.Doc_Id==Doc_Id).
                    FirstOrDefaultAsync();
                if (document == null) return StatusCode(StatusCodes.Status204NoContent);
                return File(document.File_Buffer, document.Mime_Type, document.File_Name);
            }
        }

        [HttpDelete]
        [Route("Services/RemoveTemporaryDocument")]
        public async Task<ActionResult> RemoveTemporaryDocument(int User_Id, int Doc_Type, int Doc_Id)
        {
            using (var db = new AuthorizationDb())
            {
                try
                {
                    db.Users_Documents.Remove(new Users_Documents()
                    {
                        Doc_Id = Doc_Id,
                        Doc_Type = Doc_Type,
                        User_Id = User_Id,
                    });
                    await db.SaveChangesAsync();
                    return Ok();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return StatusCode(StatusCodes.Status204NoContent);
                }
                catch
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
        }

        [HttpPost]
        [Route("Services/SaveTemporaryDocument")]
        public async Task<ActionResult> SaveTemporaryDocument(IFormFile file, int User_Id, int Doc_Type)
        {
            if (file != null)
            {
                using (var db = new AuthorizationDb())
                {
                    try
                    {
                        var DocId = (await db.Users_Documents.
                                     Where(x => x.User_Id == User_Id && x.Doc_Type == Doc_Type).
                                     Select(x => (int?)x.Doc_Id).
                                     MaxAsync() ?? 0) + 1;

                        db.Users_Documents.Add(new Users_Documents()
                        {
                            Doc_Id = DocId,
                            Doc_Type = Doc_Type,
                            User_Id = User_Id,
                            File_Buffer = UploadedFileReader.ToArray(file),
                            File_Name = file.FileName,
                            Mime_Type = file.ContentType
                        });
                        await db.SaveChangesAsync();
                        return Ok("Doc_Id=" + DocId.ToString() +
                                  "&Doc_Type=" + Doc_Type.ToString() +
                                  "&User_Id=" + User_Id.ToString());

                    }
                    catch (Exception ex) {
                        if (db.IsDuplicateKey(ex)) return StatusCode(StatusCodes.Status409Conflict);
                        return StatusCode(StatusCodes.Status500InternalServerError);
                    }
                }
            }
            return Ok();
        }
    }
}
