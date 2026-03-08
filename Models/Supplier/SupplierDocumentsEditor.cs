namespace [Application Name].Models.Supplier
{
    public class SupplierDocumentsEditor
    {
        public SupplierDocumentsEditor() { }
        public SupplierDocumentsEditor(int SupplierID, string CompanyName) { this.SupplierID = SupplierID; this.CompanyName = CompanyName; }
        public int SupplierID { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string InsertUrl { get; } = "/home/AddSupplierDocument";
        public string DownloadUrl { get; } = "/home/DownloadSupplierDocument";
        public string DeleteUrl { get; } = "/home/DeleteSupplierDocument";
        public string FileNameUrl { get; } = "/home/FileNameAndFootprintSupplierDocument";
        public string JsonKey(SuppliersDocumentsKey.documentType docType)
        {
            return SuppliersDocumentsKey.JsonKey(SupplierID, docType);
        }
    }
}
