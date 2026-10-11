-- Bỏ màu nền cam nhạt (#FFD9C7) của ảnh sản phẩm, chỉ giữ 3 màu: #E9E7DF, #DCE9B0, #D5DBF3.
update products set tint = '#DCE9B0' where id = 'nails-01' and tint = '#FFD9C7';
update products set tint = '#D5DBF3' where id = 'nails-02' and tint = '#FFD9C7';
-- Sản phẩm khác còn màu cũ (nếu có) chuyển sang màu trung tính.
update products set tint = '#E9E7DF' where tint = '#FFD9C7';
