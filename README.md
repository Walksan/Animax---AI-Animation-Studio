# Animax - AI Animation Studio 🚀

Animax, doğal dil komutlarını (prompt) kullanarak saniyeler içinde özel HTML, CSS ve JavaScript animasyonları oluşturan yapay zeka destekli bir platformdur.

## ✨ Özellikler

- **AI Destekli Üretim:** Gemini AI kullanarak karmaşık animasyonları sadece tarif ederek oluşturun.
- **Canlı Önizleme:** Oluşturulan animasyonları anında tarayıcıda izleyin.
- **Kod Paneli:** Üretilen HTML, CSS ve JS kodlarını inceleyin ve kopyalayın.
- **Kullanıcı Sistemi:** Kayıt olun ve oluşturduğunuz animasyonları koleksiyonunuza kaydedin.
- **Misafir Modu:** Kayıt olmadan 3 adet deneme animasyonu oluşturun.
- **Modern Arayüz:** Karanlık mod odaklı, canlı ve kullanıcı dostu tasarım.

## 🛠️ Teknolojiler

- **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Node.js, Express, Better-SQLite3.
- **AI:** Google Gemini API.
- **Build Tool:** Vite.

## 🚀 Yerel Kurulum

Projeyi kendi bilgisayarınızda çalıştırmak için:

1.  **Depoyu kopyalayın:**
    ```bash
    git clone <github-repo-url>
    cd animax-studio
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Ortam değişkenlerini ayarlayın:**
    `.env` dosyası oluşturun ve Gemini API anahtarınızı ekleyin:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```
    Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🌐 Render.com'da Yayınlama (Deployment)

1.  GitHub'da yeni bir repository oluşturun ve kodları yükleyin.
2.  Render.com'da **New Web Service** oluşturun.
3.  Ayarlar:
    - **Build Command:** `npm install && npm run build`
    - **Start Command:** `npm start`
4.  **Environment Variables** kısmına `GEMINI_API_KEY` anahtarınızı ekleyin.

## 📄 Lisans

Bu proje Apache-2.0 lisansı ile korunmaktadır.
