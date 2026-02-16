namespace [Application Name].FileUpload
{
    public class UploadedFiles
    {
        public static MemoryStream ToMemoryStream(IFormFile file)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                file.CopyTo(ms);
                return ms;
            }

        }
        public static byte[] ToArray(IFormFile file)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                file.CopyTo(ms);
                return ms.ToArray();
            }
        }
        public static string KeyValue(IFormCollection request, string Key)
        {
            return request[Key].ToString();
        } 
    }
}
