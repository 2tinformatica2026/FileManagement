using System.Security.Cryptography;
using System.Text;

namespace [Application Name].cryptografy
{
    public class RsaEncryption
    {
        public void KeysGenerator(ref string privateKeyBase64String, ref string publicKeyBase64String)
        {
            var cryptoServiceProvider = new RSACryptoServiceProvider(2048);
            privateKeyBase64String = Convert.ToBase64String(cryptoServiceProvider.ExportCspBlob(true));
            publicKeyBase64String = Convert.ToBase64String(cryptoServiceProvider.ExportCspBlob(false));
        }
        public static string Encrypted(string textToEncrypt, string publicKeyBase64String)
        {
            var bytesToEncrypt = Encoding.UTF8.GetBytes(textToEncrypt);

            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                try
                {
                    rsa.ImportCspBlob(Convert.FromBase64String(publicKeyBase64String));
                    var encryptedData = rsa.Encrypt(bytesToEncrypt, true);
                    var base64Encrypted = Convert.ToBase64String(encryptedData);
                    return base64Encrypted;
                }
                finally
                {
                    rsa.PersistKeyInCsp = false;
                }
            }
        }
        public static string Decrypted(string textToDecrypt, string privateKeyBase64String)
        {
            using (var rsa = new RSACryptoServiceProvider(2048))
            {
                try
                {
                    // server decrypting data with private key
                    rsa.ImportCspBlob(Convert.FromBase64String(privateKeyBase64String));
                    var resultBytes = Convert.FromBase64String(textToDecrypt);
                    var decryptedBytes = rsa.Decrypt(resultBytes, true);
                    var decryptedData = Encoding.UTF8.GetString(decryptedBytes);
                    return decryptedData.ToString();
                }
                finally
                {
                    rsa.PersistKeyInCsp = false;
                }
            }
        }
        public static byte[] Signed(string message, string privateKeyBase64String)
        {
            byte[] result;
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.ImportCspBlob(Convert.FromBase64String(privateKeyBase64String));
            byte[] toSign = Encoding.Unicode.GetBytes(message);
            result = rsa.SignData(toSign, "SHA256");
            return result;
        }
        public static string SignedIntoBase64String(string message, string privateKeyBase64String)
        {
            return Convert.ToBase64String(Signed(message, privateKeyBase64String));
        }
        public static bool Verified(string message, byte[] signature, string publicKeyBase64String)
        {
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.ImportCspBlob(Convert.FromBase64String(publicKeyBase64String));
            byte[] toVerify = Encoding.Unicode.GetBytes(message);
            return rsa.VerifyData(toVerify, "SHA256", signature);
        }
        public static bool VerifiedFromBase64String(string message, string Base64Stringsignature, string publicKeyBase64String)
        {
            return Verified(message, Convert.FromBase64String(Base64Stringsignature), publicKeyBase64String);
        }
    }
}
