const canvas = document.getElementById('paperCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('statusText');
let animationInterval;

const noiseCanvas = document.createElement('canvas');
noiseCanvas.width = 250;
noiseCanvas.height = 250;
const noiseCtx = noiseCanvas.getContext('2d');
for (let i = 0; i < 800; i++) {
    noiseCtx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.12)";
    noiseCtx.fillRect(Math.random() * 250, Math.random() * 250, 2, 2);
}
const paperTexturePattern = ctx.createPattern(noiseCanvas, 'repeat');

const textSnippets = [
    { before: "di dalam keheningan malam yang panjang, ia akhirnya menemukan arti dari", after: "yang selama ini dicari di balik tumpukan buku tua di sudut ruangan." },
    { before: "sebab tanpa adanya", after: "yang kuat, segala rencana besar hanyalah barisan kalimat tanpa makna." },
    { before: "ia menatap jendela yang berembun sambil merenungkan kembali makna", after: "dalam perjalanan hidup yang penuh tanda tanya." },
    { before: "LAPORAN KHUSUS — Para pengamat ekonomi menilai bahwa tingkat", after: "pasar global mengalami lonjakan signifikan pada kuartal akhir tahun ini." },
    { before: "Dalam konferensi pers kemarin, ditekankan bahwa", after: "menjadi faktor penentu keberhasilan transformasi industri kreatif." },
    { before: "EDISI PAGI: Sejumlah pakar menyimpulkan bahwa krisis", after: "dapat diatasi melalui pembaruan sistem secara menyeluruh." },
    { before: "Bab IV: Seni Mengendalikan Pikiran. Ketika Anda melatih", after: "setiap hari, gangguan dari luar perlahan kehilangan kekuatannya." },
    { before: "Prinsip dasar dari efisiensi adalah memusatkan seluruh", after: "pada satu titik krusial sebelum melangkah ke tahap berikutnya." },
    { before: "Kebiasaan kecil yang dilakukan berulang kali akan membentuk", after: "yang sulit digoyahkan oleh situasi apa pun." },
    { before: "[Ref. 104] Secara historis, konsep mengenai", after: "telah tercatat dalam berbagai manuskrip kuno sejak abad pertengahan." },
    { before: "Penelitian empiris menunjukkan korelasi positif antara", after: "dengan peningkatan daya ingat jangka panjang pada subjek uji." },
    { before: "Pada halaman terakhir manuskrip itu tertulis jelas bahwa", after: "adalah satu-satunya kunci untuk membuka pintu rahasia masa depan." },
    { before: "Tajuk Rencana: Masyarakat modern sering kali melupakan esensi", after: "di tengah derasnya arus informasi yang datang silih berganti." },
    { before: "Catatan Kaki 12: Fenomena", after: "telah diamati oleh berbagai ilmuwan sejak awal revolusi industri." },
    { before: "Tidak ada pencapaian besar yang lahir tanpa pengorbanan dan", after: "yang ditempa melalui proses panjang penuh kegagalan." },
    { before: "KOLOM OPINI — Mengapa generasi sekarang membutuhkan", after: "lebih dari sekadar kecepatan dalam mengambil keputusan strategis." }
];

const fillerParagraphs = [
    "Perkembangan gagasan manusia selalu berawal dari pengamatan mendalam terhadap pola-pola kecil yang sering terabaikan oleh mata telanjang dalam kehidupan sehari-hari.",
    "Halaman demi halaman arsip mencatat perubahan zaman yang begitu cepat, menuntut setiap individu untuk terus memperbarui cara pandang serta ketajaman analisisnya.",
    "Dalam literatur klasik maupun modern, struktur narasi dibangun untuk menuntun pembaca memahami inti persoalan secara bertahap namun tetap menyisakan ruang perenungan.",
    "Catatan kaki dan kutipan dari berbagai sumber menunjukkan bahwa konsistensi merupakan jembatan utama antara teori abstrak dan penerapan nyata di lapangan.",
    "Arsip cetakan lama memiliki karakteristik tipografi yang khas, di mana setiap huruf dicetak menggunakan pelat logam di atas lembaran serat kayu alami.",
    "Perubahan struktur sosial sering kali tercermin melalui tajuk rencana surat kabar yang terbit pada masa peralihan era industri menuju era informasi.",
    "Setiap paragraf disusun mengikuti kaidah penulisan baku guna menjaga keakuratan data sejarah yang tersimpan di perpustakaan nasional.",
    "Ketelitian dalam membaca tanda baca serta konteks kalimat menjadi syarat mutlak sebelum menarik kesimpulan dari sebuah dokumen resmi.",
    "Sebagian besar naskah kuno mengalami perubahan warna kertas akibat proses oksidasi alami selama puluhan tahun penyimpanan.",
    "Jurnal ilmiah edisi terbaru menyoroti pentingnya menjaga keseimbangan antara inovasi teknologi dan pelestarian nilai-nilai literasi."
];

const fonts = [
    "Georgia", "Times New Roman", "Courier New", "Palatino", 
    "Baskerville", "Garamond", "Bookman Old Style", "Trebuchet MS", 
    "Verdana", "Arial", "Lucida Console", "Impact", "Cambria", "Didot"
];

const paperPalettes = [
    { bg: "#f4efe6", text: "#22201e", border: "#cfc5b4", type: "novel" },
    { bg: "#e6e2d8", text: "#1a1a1a", border: "#b8b2a6", type: "newspaper" },
    { bg: "#fbf9f5", text: "#2c2a29", border: "#dcd7cd", type: "book" },
    { bg: "#dfd5c5", text: "#2b2118", border: "#bba990", type: "archive" },
    { bg: "#1f1f1f", text: "#e8e8e8", border: "#444444", type: "darkprint" },
    { bg: "#f0f4f8", text: "#102a43", border: "#bcccdc", type: "lined" },
    { bg: "#fdf6e3", text: "#332d25", border: "#d3c6aa", type: "journal" },
    { bg: "#eceae4", text: "#1c1c1c", border: "#a3a098", type: "columns" }
];

const highlightColors = ["#ffeb3b", "#00e5ff", "#aeea00", "#ff6e40", "#ea80fc", "#ffd54f"];

function generateDenseText(count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        let p = fillerParagraphs[Math.floor(Math.random() * fillerParagraphs.length)];
        result.push(p);
    }
    return result.join(" ");
}
function drawDynamicFrame(keyword) {
    const bgMode = document.getElementById('bgModeSelect').value;
    const hlMode = document.getElementById('highlightModeSelect').value;

    const palette = paperPalettes[Math.floor(Math.random() * paperPalettes.length)];
    const font = fonts[Math.floor(Math.random() * fonts.length)];
    const fontSize = Math.floor(Math.random() * 14) + 32;
    const angle = (Math.random() - 0.5) * 0.22;
    const jitterX = (Math.random() - 0.5) * 28;
    const jitterY = (Math.random() - 0.5) * 28;

    ctx.fillStyle = bgMode === "greenscreen" ? "#00b140" : palette.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate((canvas.width / 2) + jitterX, (canvas.height / 2) + jitterY);
    ctx.rotate(angle);

    const pageW = Math.floor(Math.random() * 250) + 950;
    const pageH = Math.floor(Math.random() * 300) + 1550;

    if (bgMode !== "greenscreen") {
        ctx.fillStyle = palette.bg;
        ctx.fillRect(-pageW / 2, -pageH / 2, pageW, pageH);

        if (paperTexturePattern) {
            ctx.fillStyle = paperTexturePattern;
            ctx.fillRect(-pageW / 2, -pageH / 2, pageW, pageH);
        }
    } else {
        const cropW = Math.floor(Math.random() * 120) + 640;
        const cropH = Math.floor(Math.random() * 250) + 1150;
        ctx.fillStyle = palette.bg;
        ctx.fillRect(-cropW / 2, -cropH / 2, cropW, cropH);
        if (paperTexturePattern) {
            ctx.fillStyle = paperTexturePattern;
            ctx.fillRect(-cropW / 2, -cropH / 2, cropW, cropH);
        }
        ctx.beginPath();
        ctx.rect(-cropW / 2, -cropH / 2, cropW, cropH);
        ctx.clip();
    }

    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;

    if (palette.type === "lined") {
        ctx.strokeStyle = "rgba(100, 149, 237, 0.22)";
        ctx.lineWidth = 1;
        for (let ly = -pageH / 2; ly < pageH / 2; ly += 38) {
            ctx.beginPath();
            ctx.moveTo(-pageW / 2, ly);
            ctx.lineTo(pageW / 2, ly);
            ctx.stroke();
        }
    } else if (palette.type === "columns") {
        ctx.beginPath();
        ctx.moveTo(0, -pageH / 2);
        ctx.lineTo(0, pageH / 2);
        ctx.stroke();
    }

    const snippet = textSnippets[Math.floor(Math.random() * textSnippets.length)];
    const denseBefore = generateDenseText(7);
    const denseAfter = generateDenseText(7);

    const fullBefore = (denseBefore + " " + snippet.before).split(" ");
    const fullAfter = (snippet.after + " " + denseAfter).split(" ");

    ctx.font = `bold ${fontSize}px ${font}`;
    const kwWidth = ctx.measureText(keyword).width;
    const spaceWidth = ctx.measureText(" ").width;
    const lineHeight = fontSize * 1.48;
    const limitX = (pageW / 2) - 20;

    ctx.textBaseline = "middle";

    if (hlMode === "stabilo") {
        const hlColor = highlightColors[Math.floor(Math.random() * highlightColors.length)];
        ctx.fillStyle = hlColor;
        ctx.fillRect((-kwWidth / 2) - 6, (-fontSize / 2) - 4, kwWidth + 12, fontSize + 8);
        ctx.fillStyle = "#000000";
        ctx.fillText(keyword, -kwWidth / 2, 0);
    } else if (hlMode === "subtle") {
        ctx.fillStyle = palette.text;
        ctx.fillText(keyword, -kwWidth / 2, 0);
        ctx.strokeStyle = palette.type === "darkprint" ? "#ffeb3b" : "#d32f2f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-kwWidth / 2, (fontSize / 2) + 4);
        ctx.lineTo(kwWidth / 2, (fontSize / 2) + 4);
        ctx.stroke();
    } else {
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = palette.text;
        ctx.fillText(keyword, -kwWidth / 2, 0);
    }

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = palette.text;
    let curX = (kwWidth / 2) + spaceWidth;
    let curY = 0;

    for (let word of fullAfter) {
        let wWidth = ctx.measureText(word).width + spaceWidth;
        if (curX + wWidth > limitX) {
            curX = -limitX + (Math.random() * 15);
            curY += lineHeight;
        }
        if (curY > (pageH / 2) - 20) break;
        ctx.fillText(word, curX, curY);
        curX += wWidth;
    }

    curX = (-kwWidth / 2) - spaceWidth;
    curY = 0;

    for (let i = fullBefore.length - 1; i >= 0; i--) {
        let word = fullBefore[i];
        let wWidth = ctx.measureText(word).width + spaceWidth;
        if (curX - wWidth < -limitX) {
            curX = limitX - (Math.random() * 15);
            curY -= lineHeight;
        }
        if (curY < (-pageH / 2) + 20) break;
        ctx.fillText(word, curX - wWidth + spaceWidth, curY);
        curX -= wWidth;
    }

    ctx.restore();
}

function startPreview() {
    clearInterval(animationInterval);
    const keyword = document.getElementById('keywordInput').value.trim() || "Fokus";
    const speed = parseInt(document.getElementById('speedSelect').value);
    
    drawDynamicFrame(keyword);
    statusText.innerText = "▶️ Memutar pratinjau halaman penuh terpotong...";
    
    animationInterval = setInterval(() => {
        drawDynamicFrame(keyword);
    }, speed);
}

function stopPreview() {
    clearInterval(animationInterval);
    statusText.innerText = "⏹️ Pratinjau dihentikan.";
}

function recordVideo() {
    clearInterval(animationInterval);
    const keyword = document.getElementById('keywordInput').value.trim() || "Fokus";
    const speed = parseInt(document.getElementById('speedSelect').value);
    
    statusText.innerText = "🔴 Merekam video 5 detik... Tunggu hingga unduhan otomatis muncul.";
    
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cutout-${keyword}.webm`;
        a.click();
        statusText.innerText = "✅ Selesai! Video berhasil diunduh.";
    };

    mediaRecorder.start();
    drawDynamicFrame(keyword);
    
    animationInterval = setInterval(() => {
        drawDynamicFrame(keyword);
    }, speed);

    setTimeout(() => {
        clearInterval(animationInterval);
        mediaRecorder.stop();
    }, 5000);
}

window.onload = () => drawDynamicFrame("Fokus");
