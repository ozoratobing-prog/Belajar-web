// ===================================
// INTI: BUKA UNDANGAN & NAMA TAMU
// ===================================

const cover = document.getElementById('cover');
const mainContent = document.getElementById('mainContent');
const bukaBtn = document.getElementById('bukaUndangan');
const bgMusic = document.getElementById('bgMusic');

// Fungsi untuk mendapatkan nama tamu dari URL (?to=Nama)
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get('to');
    
    // Decoding URL, dan mengganti %20 atau + menjadi spasi
    if (name) {
        name = decodeURIComponent(name.replace(/\+/g, ' '));
    }
    
    // Tampilkan nama tamu, default jika tidak ada di URL
    document.querySelector('.guest-name').textContent = name || 'Tamu Undangan';
}

// Handler Tombol Buka Undangan
if (bukaBtn) {
    bukaBtn.addEventListener('click', () => {
        // 1. Sembunyikan cover dan tampilkan konten utama
        cover.classList.add('hidden');
        mainContent.classList.remove('hidden');

        // 2. Putar musik (dengan penanganan error)
        bgMusic?.play().catch(error => {
            console.warn("Gagal autoplay musik:", error);
            // Tombol musik tetap tersedia agar user bisa play manual
        });
        
        // 3. Update tombol musik
        document.getElementById('playMusic').textContent = '⏸ Pause Musik';
        
        // 4. Scroll ke konten
        document.body.style.overflow = 'auto';
    });
}

getGuestName(); // Panggil saat website dimuat

// ===================================
// NAVIGASI & SMOOTH SCROLL (SAMA SEPERTI KODE SEBELUMNYA)
// ===================================

document.querySelectorAll('.menu a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    try {
      document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.warn("Target scroll tidak ditemukan:", a.getAttribute('href'));
    }
  });
});

// ===================================
// COUNTDOWN (SAMA SEPERTI KODE SEBELUMNYA)
// ===================================

const targetDate = new Date("2025-10-25T10:00:00+07:00").getTime();
const countdownEl = document.getElementById('countdown');

function renderCountdown(distance) {
  if (!countdownEl) return;

  if (distance <= 0) {
    countdownEl.innerHTML = `<div class="box"><div class="value">💖</div><div class="label">Pernikahan telah usai!</div></div>`;
    return;
  }
  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const m = Math.floor((distance / (1000 * 60)) % 60);
  const s = Math.floor((distance / 1000) % 60);
  countdownEl.innerHTML = `
    <div class="box"><div class="value">${d}</div><div class="label">Hari</div></div>
    <div class="box"><div class="value">${h}</div><div class="label">Jam</div></div>
    <div class="box"><div class="value">${m}</div><div class="label">Menit</div></div>
    <div class="box"><div class="value">${s}</div><div class="label">Detik</div></div>
  `;
}
function updateCountdown() { renderCountdown(targetDate - Date.now()); }
setInterval(updateCountdown, 1000);
updateCountdown();

// ===================================
// AUDIO PLAYER (SAMA SEPERTI KODE SEBELUMNYA)
// ===================================
const playBtn = document.getElementById('playMusic');
let isPlaying = true; // Set true karena musik otomatis diputar saat Buka Undangan diklik

if (bgMusic && playBtn) {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            playBtn.textContent = '🎵 Putar Musik';
            isPlaying = false;
        } else {
            bgMusic.play().catch(e => console.error("Gagal putar musik:", e));
            playBtn.textContent = '⏸ Pause Musik';
            isPlaying = true;
        }
    });

    bgMusic.addEventListener('ended', () => {
        playBtn.textContent = '🎵 Putar Musik';
        isPlaying = false;
    });
}

// ===================================
// LIGHTBOX (Galeri Pop-up) (SAMA SEPERTI KODE SEBELUMNYA)
// ===================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll('.glight').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
    });
  });
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightboxClose.click();
  });
}


// ===================================
// KIRIM DOA (LocalStorage) (SAMA SEPERTI KODE SEBELUMNYA)
// *Catatan: Untuk website live, Anda harus menggunakan database bukan localStorage.
// ===================================
const doaForm = document.getElementById('doaForm');
const ucapanList = document.getElementById('ucapanList');
const STORAGE_DOA = 'doa_ucapan_v2';

function renderUcapan() {
  if (!ucapanList) return;
  ucapanList.innerHTML = '';
  const items = JSON.parse(localStorage.getItem(STORAGE_DOA) || '[]');
  items.slice().reverse().forEach(({ nama, pesan, ts }) => {
    const div = document.createElement('div');
    div.className = 'ucapan-item';
    const date = new Date(ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    div.innerHTML = `<strong>${nama}</strong> • <span class="muted">${date}</span><div>${pesan}</div>`;
    ucapanList.appendChild(div);
  });
}
if (doaForm) {
  doaForm.addEventListener('submit', e => {
    e.preventDefault();
    const nama = document.getElementById('namaDoa').value.trim();
    const pesan = document.getElementById('pesanDoa').value.trim();
    if (nama.length < 2 || pesan.length < 2) return;
    const items = JSON.parse(localStorage.getItem(STORAGE_DOA) || '[]');
    items.push({ nama, pesan, ts: Date.now() });
    localStorage.setItem(STORAGE_DOA, JSON.stringify(items));
    doaForm.reset();
    renderUcapan();
  });
}
renderUcapan();