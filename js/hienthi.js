import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgUi4shgHFmyQpANBdnm3_tD5gE0QPsMg",
  authDomain: "webtailieu-8b1c0.firebaseapp.com",
  projectId: "webtailieu-8b1c0",
  storageBucket: "webtailieu-8b1c0.firebasestorage.app",
  messagingSenderId: "468165329777",
  appId: "1:468165329777:web:04801fb578dc0a205a6cd0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const khuVucHienThi = document.getElementById('khuVucChuaCard');
const thanhLocMonHoc = document.getElementById('locMonHoc'); 

if (khuVucHienThi) {
    async function loadTaiLieu() {
        try {
            // Lưu ý: Mình sắp xếp theo ngày tạo (cũ xếp sau, mới xếp trước)
            const q = query(collection(db, "tailieu"), orderBy("ngayTao", "asc"));
            const querySnapshot = await getDocs(q);
            
            if(querySnapshot.empty) {
                 khuVucHienThi.innerHTML = "<div class='loading-state'><p>Kho trống, up đồ lên đi sếp!</p></div>";
                 return;
            }

            let danhMucMonHoc = {};

            querySnapshot.forEach((doc) => {
                let baiHoc = doc.data();
                let tenMon = baiHoc.tenMon || "Chưa phân loại";

                if (!danhMucMonHoc[tenMon]) {
                    danhMucMonHoc[tenMon] = [];
                }
                danhMucMonHoc[tenMon].push(baiHoc);
            });

            let cacMonHoc = Object.keys(danhMucMonHoc).sort();

            let htmlGiaoDien = "";
            let htmlDropdown = `<option value="all">🌟 Tất cả môn học</option>`;

            cacMonHoc.forEach(mon => {
                htmlDropdown += `<option value="${mon}">${mon}</option>`;

                htmlGiaoDien += `<div class="category-section" data-mon="${mon}">`;
                htmlGiaoDien += `<h2 class="category-title">📂 ${mon}</h2>`;
                htmlGiaoDien += `<div class="container">`;

                danhMucMonHoc[mon].forEach(baiHoc => {
                    let nutVideo = baiHoc.linkVid 
                        ? `<a href="${baiHoc.linkVid}" target="_blank" class="btn vid-btn">🎥 Video</a>` 
                        : '';
                    
                    // KIỂM TRA XEM CÓ "BUỔI" KHÔNG, NẾU CÓ THÌ GẮN HUY HIỆU
                    let nhanBuoi = baiHoc.buoi 
                        ? `<span class="badge-buoi">${baiHoc.buoi}</span>` 
                        : '';

                    htmlGiaoDien += `
                        <div class="card">
                            ${nhanBuoi}
                            <p style="font-size: 1.1rem; color: #fff; margin-bottom: 1rem; margin-top: 5px; font-weight: bold;">${baiHoc.moTa}</p>
                            <div class="links">
                                <a href="${baiHoc.linkDoc}" target="_blank" class="btn doc-btn">📖 Tài Liệu</a>
                                ${nutVideo}
                            </div>
                        </div>
                    `;
                });

                htmlGiaoDien += `</div></div>`;
            });

            khuVucHienThi.innerHTML = htmlGiaoDien;

            if (thanhLocMonHoc) {
                thanhLocMonHoc.innerHTML = htmlDropdown;
                thanhLocMonHoc.addEventListener('change', (e) => {
                    let monDuocChon = e.target.value;
                    let tatCaKhuVuc = document.querySelectorAll('.category-section');
                    
                    tatCaKhuVuc.forEach(khuVuc => {
                        if (monDuocChon === 'all' || khuVuc.getAttribute('data-mon') === monDuocChon) {
                            khuVuc.style.display = 'block';
                        } else {
                            khuVuc.style.display = 'none';
                        }
                    });
                });
            }

        } catch (error) {
            console.error("Lỗi kéo data: ", error);
            khuVucHienThi.innerHTML = "<div class='loading-state'><p>Lỗi mất tiêu rồi!</p></div>";
        }
    }
    
    loadTaiLieu();
}