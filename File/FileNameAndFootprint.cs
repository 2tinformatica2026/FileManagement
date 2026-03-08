using System.Text.Json.Serialization;

namespace [Application Name].File
{
    public class FileNameAndFootprint
    {
        public FileNameAndFootprint() { }
        public FileNameAndFootprint(string FileName, string Footstring) { filename = FileName; footprint = Footstring; }
        [JsonPropertyName("filename")]
        public string filename { get; set; } = string.Empty;
        [JsonPropertyName(ExtendedFileContentResult.footprint)]
        public string footprint { get; set; } = string.Empty;
    }
}
