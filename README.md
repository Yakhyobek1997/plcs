# PLCS Monitor

`plcs-monitor.html` faylini brauzerda oching. Build yoki server talab qilinmaydi.

## Tuzilishi

- `plcs-monitor.html` ? kirish fayli va sahifa konteynerlari.
- `assets/css/styles.css` ? umumiy uslublar.
- `assets/images/logo.png` ? logotip.
- `assets/js/` ? yordamchi funksiyalar, demo ma?lumotlar, grafiklar, autentifikatsiya, navigatsiya va ishga tushirish.
- `pages/login.js` ? login sahifasi.
- `pages/dashboard/` ? kartalar, jadval, NOC, xarita va fokus panellari.
- `pages/detail/` ? leakage, elektr sifati, yuklama, statistika, hisobot va AI sahifalari.

Sahifalar dinamik ma?lumot va umumiy holatdan foydalangani uchun alohida JavaScript render fayllari sifatida ajratilgan. `script` teglarining yuklanish tartibini saqlang; `app.js` oxirida keladi. Statik uslublar CSS faylida, dinamik grafik o?lchamlari va ranglari render kodida joylashgan.

Demo login: `admin` yoki `customer`; parol: `demo1234`.
