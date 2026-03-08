namespace [Application Name].File
{
    public class FileContent
    {
        public byte[] Buffer { get; set; } = Array.Empty<byte>();
        public string FileName { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public string Footprint { get; set; } = string.Empty;
    }
}
