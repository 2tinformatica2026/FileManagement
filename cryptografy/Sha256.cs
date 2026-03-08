using System.Security.Cryptography;
using System.Text;

namespace [Application Name].cryptografy
{
    public class Sha256
    {
        public static string Sha256base64string(string s)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashValue;
                UTF8Encoding objUtf8 = new UTF8Encoding();
                hashValue = sha256.ComputeHash(objUtf8.GetBytes(s));
                return Convert.ToBase64String(hashValue);
            }
        }
        public static string Sha256base64string(byte[] s)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashValue;
                UTF8Encoding objUtf8 = new UTF8Encoding();
                hashValue = sha256.ComputeHash(s);
                return Convert.ToBase64String(hashValue);
            }
        }
    }
}
