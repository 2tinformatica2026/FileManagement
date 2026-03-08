using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace [Application Name].Models.Supplier
{
    public class SuppliersDocumentsKey
    {
        public enum documentType
        {
            CompanyPresentation = 1,
            ProductsList = 2,
            CompanyOrganization = 3,
        }
        public SuppliersDocumentsKey(int SupplierID, documentType DocumentType) { this.SupplierID = SupplierID; this.DocumentType = (int)DocumentType; }
        [JsonPropertyName("DocumentType")]
        public int DocumentType { get; set; }
        [JsonPropertyName("SupplierID")]
        public int SupplierID { get; set; }
        public static string JsonKey(int SupplierID, documentType DocumentType)
        {
            return JsonConvert.SerializeObject(new SuppliersDocumentsKey(SupplierID, DocumentType));
        }
    }
}
