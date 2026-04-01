const codeFooter = `
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-info">
                <h3><i class="fas fa-rocket"></i> Kho Tài Liệu Học Tập</h3>
                <p>Tài liệu trên web được tổng hợp từ nhiều nguồn khác nhau nhằm mục đích chia sẻ kiến thức và hỗ trợ học tập. Nếu có bất kỳ vấn đề nào liên quan đến bản quyền, vui lòng liên hệ trực tiếp với mình để được xử lý nhé!</p>
                <p class="wish-text"><i class="fas fa-star"></i> Chúc các bạn ôn tập hiệu quả và thi thật tốt! <i class="fas fa-star"></i></p>
            </div>
            <div class="footer-contact">
                <h3><i class="fas fa-headset"></i> Liên Hệ & Hỗ Trợ</h3>
                <p><i class="fas fa-envelope email-icon"></i> Email: <a href="mailto:trthanhliem08@gmail.com">trthanhliem08@gmail.com</a></p>
                <p><i class="fab fa-facebook fb-icon"></i> Facebook: <a href="https://facebook.com/trthanhliem.1610" target="_blank">Tr Thanh Liem</a></p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; Copyright 2026 by TrThanhLiem. All rights reserved.</p>
        </div>
    </footer>
`;

const choDeFooter = document.getElementById('khuVucFooter');
if (choDeFooter) {
    choDeFooter.innerHTML = codeFooter;
}