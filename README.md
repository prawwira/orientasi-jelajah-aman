## Status Data: Cache Segar, Cache Basi, dan First-Run Offline

**Cache segar** adalah data cuaca tersimpan yang umurnya kurang dari 30 menit,
sehingga aplikasi langsung memakainya tanpa memanggil internet. **Cache basi**
adalah data tersimpan yang sudah lebih tua dari 30 menit dan dipakai hanya
sebagai cadangan ketika internet gagal, sedangkan **first-run offline** terjadi
saat belum ada data tersimpan sama sekali dan internet juga tidak ada, sehingga
aplikasi hanya bisa menampilkan pesan error dengan tombol Coba Lagi. Label
status data penting karena pengguna berhak tahu apakah angka suhu yang tampil
benar-benar terbaru atau salinan lama, agar tidak salah mengambil keputusan
berdasarkan data yang sudah usang.
