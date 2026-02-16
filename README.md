# FileManagement
Upload, Download file using convenient javascript classes

Requires Bootstrap 5.X 


        // services
        [HttpDelete]
        public IActionResult DeleteUploadedFile(int FileId)
        {
           //do something
           return Ok();
        }

        [HttpPost]
        public IActionResult FileUpload(IFormFile file)
        {
            if (file != null)
            {
                var buffer = [Application Name].FileUpload.UploadedFiles.ToArray(file);
                //do something
            }
            //return StatusCode(StatusCodes.Status500InternalServerError);
            return Ok();
        }

        [HttpGet]
        public IActionResult FileDownload(int ProductId, int DocumentId)
        {
            try
            {
                using (var db = new [some database].Database())
                {
                    var document = (from pd in db.productsDocuments
                                    where pd.ProductID == ProductId && pd.DocumentID == DocumentId
                                    select new
                                    {
                                        FileName = pd.FileName,
                                        MimeType = pd.MimeType,
                                        Buffer = pd.Buffer,
                                    }).FirstOrDefault();
                    if (document != null)
                    {
                        return File(document.Buffer, document.MimeType, document.FileName);
                    }
                    else return StatusCode(StatusCodes.Status204NoContent);
                }

            }
            catch { return StatusCode(StatusCodes.Status500InternalServerError); }
        }


Razor page

<div class="row">
    <div class="col-7 col-md-5 col-lg-4">
        <label>File Upload</label>
        <div class="input-group" data-fileupload data-url="/Home/FileUpload" data-delete-url="/home/DeleteUploadedFile">
            <input type="file" class="form-control" />
            <span class="form-control border border-1 rounded rounded-2 d-none" data-file-name></span>
            <span class="bi bi-exclamation mt-auto mb-auto p-0 fs-4 text-danger d-none"></span>
            <span class="mt-auto mb-auto ms-2 d-none" data-progress-bar></span>
            <img class="hourglass hourglass-sm ddropdown-hourglass d-none" />
            <span class="mt-auto mb-auto ms-2 btn btn-close d-none" data-abort></span>
            <span class="btn bi bi-download fs-5 ms-1 p-0 d-none" data-download></span>
            <span class="mt-auto mb-auto ms-1 p-0 btn bi bi-trash d-none" data-delete></span>
        </div>
    </div>

    <div class="col-7 col-md-5 col-lg-4">
        <label>File Download</label>
        <div class="input-group" data-filedownload data-url="/Home/FileDownload?ProductId=77&DocumentId=1&">
            <input type="text" readonly class="form-control me-1 bg-white" value="film.avi" />
            <span class="bi bi-exclamation mt-auto mb-auto p-0 fs-4 text-danger d-none"></span>
            <span class="btn bi bi-download fs-5 mt-auto mb-auto ms-1 p-0" data-download></span>
            <span class="mt-auto mb-auto d-none" data-progress-bar></span>
            <img class="hourglass hourglass-sm d-none" />
            <span class="btn btn-close mt-auto mb-auto d-none" data-abort></span>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-7 col-md-5 col-lg-4">
        <table class="table">
            <thead>
                <tr>
                    <th>file name</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>film.avi</td>
                    <td>
                        <div class="text-end" data-filedownload data-url="/Home/FileDownload?ProductId=77&DocumentId=1&">
                            <span class="bi bi-exclamation mt-auto mb-auto p-0 fs-4 text-danger d-none"></span>
                            <span class="btn bi bi-download fs-5 mt-auto mb-auto ms-1 p-0" data-download></span>
                            <span class="mt-auto mb-auto d-none" data-progress-bar></span>
                            <img class="hourglass hourglass-sm ddropdown-hourglass d-none" />
                            <span class="btn btn-close mt-auto mb-auto d-none" data-abort></span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


@section Scripts{
    <script type="text/javascript">
        new FileDownload();
        new FileUpload();
    </script>
}

        

![example](https://github.com/user-attachments/assets/90dfb45f-6daa-493c-a957-09ba27482471)

The two specialized javascript classes handle both the progression bar and the cancellation of the ajax call.
