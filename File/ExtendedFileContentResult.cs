using Microsoft.AspNetCore.Mvc;
namespace [Application Name].File
{
    public class ExtendedFileContentResult: FileContentResult
    {
        public const string footprint = "footprint";
        public ExtendedFileContentResult(HttpContext Context, FileContent Content) : base(Content.Buffer, Content.MimeType)
        {
            Context.Response.Headers.Append(footprint, Content.Footprint);
            FileDownloadName = Content.FileName;
        }
    }
}
