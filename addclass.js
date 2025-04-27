document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("course-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Mencegah form refresh

        // Ambil nilai input
        const courseName = document.getElementById("course-name").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const thumbnailFile = document.getElementById("thumbnail").files[0];
        const videoHeaderFile = document.getElementById("video-header").files[0];
        const videoCoreFile = document.getElementById("video-core").files[0];

        // Cek apakah input kosong
        if (!courseName || !description || !price || !thumbnailFile || !videoHeaderFile || !videoCoreFile) {
            alert("Harap isi semua kolom dan pilih file!");
            return;
        }

        try {
            // Upload file ke Cloudinary
            const thumbnailUrl = await uploadToCloudinary(thumbnailFile, "image");
            const videoHeaderUrl = await uploadToCloudinary(videoHeaderFile, "video");
            const videoCoreUrl = await uploadToCloudinary(videoCoreFile, "video");

            // Simpan data ke Firebase dengan URL file dari Cloudinary
            const courseRef = database.ref("courses").push();
            await courseRef.set({
                name: courseName,
                description: description,
                price: price,
                thumbnailUrl: thumbnailUrl,
                videoHeaderUrl: videoHeaderUrl,
                videoCoreUrl: videoCoreUrl,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            alert("Course berhasil ditambahkan!");
            form.reset(); 
        } catch (error) {
            console.error("Gagal menyimpan:", error);
            alert("Terjadi kesalahan, coba lagi.");
        }
    });

    async function uploadToCloudinary(file, resourceType) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my_preset"); 
        formData.append("cloud_name", "ddu9nn95b");
        formData.append("resource_type", resourceType); 

        const response = await fetch(`https://api.cloudinary.com/v1_1/ddu9nn95b/${resourceType}/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data.secure_url; // Ambil URL file yang berhasil diupload
    }
});
