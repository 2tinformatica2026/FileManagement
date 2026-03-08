using System.Security.Cryptography;

namespace [Application Name].cryptografy
{
    public class AesEncryption
    {
        //key size = 32 byte; IV size = 16 byte;
        private static byte[] m_key = { 12, 23, 34, 45, 56, 67, 78, 89, 90, 101, 112, 123, 134, 145, 156, 167, 178, 189, 190, 201, 212, 223, 234, 245, 125, 69, 77, 128, 99, 36, 29, 3 };
        private static byte[] m_iv = { 66, 59, 12, 70, 65, 44, 38, 89, 75, 99, 80, 21, 5, 7, 11, 9 };
        public static string Encrypted(string plainText)
        {
            using (Aes myAes = Aes.Create())
            {
                myAes.Key = m_key;
                myAes.IV = m_iv;
                ICryptoTransform encryptor = myAes.CreateEncryptor(myAes.Key, myAes.IV);
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        return Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }
        }
        public static string Decrypted(string plainText)
        {
            // Create an Aes object
            // with the specified key and IV.
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = m_key;
                aesAlg.IV = m_iv;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(plainText)))
                {

                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}