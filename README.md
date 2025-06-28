**🎵 HustleHouse - Music Streaming Web App**

Tech Stack: MongoDB, Express.js, React.js, Node.js, Cloudinary

🚀 **Key Features:**

✅ User Features:

Account Creation & Login: New users can register instantly and securely log in.

Music Streaming: Stream songs with real-time audio controls including play, pause, seek, and volume adjustment.

User Dashboard: Browse all available songs, search and filter tracks.

Responsive UI: Clean, mobile-friendly interface for seamless music discovery and playback.

🔧 Admin Features:

Song Upload System: Admins can upload songs with metadata (title, artist, album, genre).

Cloudinary Integration: All audio files are stored securely in Cloudinary and streamed via secure URLs.

Song Management: Admins can view, edit, or delete uploaded songs.



🧰 **Tech Stack & Architecture:**

Frontend: React.js + Tailwind CSS for responsive UI, Axios for API calls, built-in audio player for streaming.

Backend: Node.js + Express.js with RESTful APIs, Multer for uploads, Cloudinary for cloud-based song storage.

Database: MongoDB Atlas with Mongoose for schema modeling.

🔐 **Authentication & Security:**

Secure login using JWT and bcrypt.

 Role-based access (user/admin) for controlled functionality.

**📁 Folder Structure (Basic):**


![image](https://github.com/user-attachments/assets/8d99c947-8a72-4b5e-894a-14d1206e48bb)


![image](https://github.com/user-attachments/assets/4f18cf26-c2de-4391-ac11-8e196b9de135)




**NOTE** - 
+ Replace sample.env to .env In Backend Root Folder.
+ Replace DB_String with Your DB Connecting String From MONGODB ATLAS Driver Connect in Backend/Database/Db.js.
+ Also Replace Cloudinary Details in Backend/Index.js for cloud_name: "Cloud Name",api_key: "Api Key",api_secret: "Api Secret Key".

