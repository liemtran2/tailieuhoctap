import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

let idBaiDangSua = null;
const danhSachNode = document.getElementById('danhSachTaiLieu');

async function loadDanhSach() {
    if (!danhSachNode) return;
    danhSachNode.innerHTML = "<p>⏳ Đang lấy danh sách...</p>";
    
    const q = query(collection(db, "tailieu"), orderBy("ngayTao", "desc"));
    const snapshot = await getDocs(q);
    
    danhSachNode.innerHTML = "";
    if (snapshot.empty) {
        danhSachNode.innerHTML = "<p>Chưa có bài nào hết.</p>";
        return;
    }

    snapshot.forEach(docSnap => {
        let baiHoc = docSnap.data();
        // Xử lý cái nhãn buổi học cho danh sách admin dễ nhìn
        let nhanBuoiAdmin = baiHoc.buoi ? `<span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${baiHoc.buoi}</span>` : '';

        danhSachNode.innerHTML += `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="color: #cbd5e0;">
                    <strong style="color: #00c6ff; font-size: 1.1rem;">${baiHoc.tenMon}</strong> ${nhanBuoiAdmin} - ${baiHoc.moTa}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sua" data-id="${docSnap.id}" data-ten="${baiHoc.tenMon}" data-buoi="${baiHoc.buoi || ''}" data-mota="${baiHoc.moTa}" data-linkdoc="${baiHoc.linkDoc}" data-linkvid="${baiHoc.linkVid || ''}" style="background: #f39c12; border: none; padding: 6px 12px; border-radius: 4px; color: white; cursor: pointer;">✏️ Sửa</button>
                    <button class="btn btn-xoa" data-id="${docSnap.id}" style="background: #e74c3c; border: none; padding: 6px 12px; border-radius: 4px; color: white; cursor: pointer;">🗑️ Xóa</button>
                </div>
            </div>
        `;
    });
}

danhSachNode.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-xoa')) {
        if (confirm("Chắc chắn muốn xóa bài này chứ bro?")) {
            let id = e.target.getAttribute('data-id');
            await deleteDoc(doc(db, "tailieu", id));
            loadDanhSach(); 
        }
    }
    
    if (e.target.classList.contains('btn-sua')) {
        document.getElementById('tenMon').value = e.target.getAttribute('data-ten');
        document.getElementById('buoiHoc').value = e.target.getAttribute('data-buoi');
        document.getElementById('moTa').value = e.target.getAttribute('data-mota');
        document.getElementById('linkTaiLieu').value = e.target.getAttribute('data-linkdoc');
        document.getElementById('linkVideo').value = e.target.getAttribute('data-linkvid');
        
        idBaiDangSua = e.target.getAttribute('data-id');
        document.getElementById('nutLuuTaiLieu').innerText = "🔄 Cập Nhật Lại";
        document.getElementById('nutLuuTaiLieu').style.background = "linear-gradient(135deg, #f39c12 0%, #d35400 100%)";
        window.scrollTo(0, 0);
    }
});

const nutLuu = document.getElementById('nutLuuTaiLieu');
if (nutLuu) {
    nutLuu.addEventListener('click', async () => {
        let ten = document.getElementById('tenMon').value;
        let buoi = document.getElementById('buoiHoc').value;
        let mota = document.getElementById('moTa').value;
        let linkDoc = document.getElementById('linkTaiLieu').value;
        let linkVid = document.getElementById('linkVideo').value;

        if (ten === "" || linkDoc === "") {
            alert("Bro điền thiếu tên môn hoặc link tài liệu rồi!"); return;
        }

        nutLuu.innerText = "⏳ Đang xử lý...";

        try {
            if (idBaiDangSua) {
                await updateDoc(doc(db, "tailieu", idBaiDangSua), {
                    tenMon: ten, buoi: buoi, moTa: mota, linkDoc: linkDoc, linkVid: linkVid
                });
                alert("Sửa thành công gòi nha!");
                idBaiDangSua = null; 
                nutLuu.style.background = "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)";
            } else {
                await addDoc(collection(db, "tailieu"), {
                    tenMon: ten, buoi: buoi, moTa: mota, linkDoc: linkDoc, linkVid: linkVid, ngayTao: new Date() 
                });
                alert("Đăng bài thành công!");
            }
            
            document.getElementById('tenMon').value = "";
            document.getElementById('buoiHoc').value = "";
            document.getElementById('moTa').value = "";
            document.getElementById('linkTaiLieu').value = "";
            document.getElementById('linkVideo').value = "";
            nutLuu.innerText = "💾 Đẩy Lên Firebase";
            loadDanhSach();

        } catch (error) {
            console.error("Lỗi: ", error);
            alert("Bị lỗi rồi, check F12 nha!");
            nutLuu.innerText = "💾 Đẩy Lên Firebase";
        }
    });
}

loadDanhSach();