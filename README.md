# FileManagement
Upload, Download file using convenient javascript classes

Requires Bootstrap 5.X 


        // services
        [HttpDelete]
        public IActionResult DeleteUploadedFile()
        {
           return Ok();
        }

        [HttpPost]
        public IActionResult FileUpload(IFormFile file)
        {
            if (file != null)
            {
                var buffer = Northwind.FileUpload.UploadedFiles.ToArray(file);
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





The two specialized javascript classes handle both the progression bar and the cancellation of the ajax call.
