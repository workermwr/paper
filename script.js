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

function drawTornPaper(x, y, w, h, fillStyle, strokeStyle, hasShadow = true) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    
    if (hasShadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 8;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);

    const step = 28;
    for (let curX = x; curX <= x + w; curX += step) {
        ctx.lineTo(curX, y + (Math.random() - 0.5) * 9);
    }
    for (let curY = y; curY <= y + h; curY += step * 2) {
        ctx.lineTo((x + w) + (Math.random() - 0.5) * 6, curY);
    }
    for (let curX = x + w; curX >= x; curX -= step) {
        ctx.lineTo(curX, (y + h) + (Math.random() - 0.5) * 9);
    }
    for (let curY = y + h; curY >= y; curY -= step * 2) {
        ctx.lineTo(x + (Math.random() - 0.5) * 6, curY);
    }

    ctx.closePath();
    ctx.fill();
    
    ctx.shadowColor = "transparent";
    ctx.stroke();
    ctx.restore();
}
function drawDynamicFrame(keyword) {
    const bgMode = document.getElementById('bgModeSelect').value;
    const hlMode = document.getElementById('highlightModeSelect').value;

    if (bgMode === "greenscreen") {
        ctx.fillStyle = "#00b140";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#100f0e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (let b = 0; b < 2; b++) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.55);
        const bgPal = paperPalettes[Math.floor(Math.random() * paperPalettes.length)];
        const offsetX = (Math.random() - 0.5) * 180;
        const offsetY = (Math.random() - 0.5) * 240;
        drawTornPaper(-320 + offsetX, -430 + offsetY, 640, 860, bgPal.bg, bgPal.border, false);
        ctx.restore();
    }

    const palette = paperPalettes[Math.floor(Math.random() * paperPalettes.length)];
    const font = fonts[Math.floor(Math.random() * fonts.length)];
    const fontSize = Math.floor(Math.random() * 18) + 32;
    const angle = (Math.random() - 0.5) * 0.18;
    const jitterX = (Math.random() - 0.5) * 32;
    const jitterY = (Math.random() - 0.5) * 32;

    ctx.save();
    ctx.translate((canvas.width / 2) + jitterX, (canvas.height / 2) + jitterY);
    ctx.rotate(angle);

    const paperW = Math.floor(Math.random() * 160) + 540;
    const paperH = Math.floor(Math.random() * 400) + 380;
    
    drawTornPaper(-paperW / 2, -paperH / 2, paperW, paperH, palette.bg, palette.border, bgMode !== "greenscreen");

    if (paperTexturePattern) {
        ctx.fillStyle = paperTexturePattern;
        ctx.fillRect(-paperW / 2, -paperH / 2, paperW, paperH);
    }

    ctx.fillStyle = palette.border;
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;

    if (palette.type === "newspaper") {
        ctx.beginPath();
        ctx.moveTo(-paperW/2 + 30, -paperH/2 + 38);
        ctx.lineTo(paperW/2 - 30, -paperH/2 + 38);
        ctx.stroke();
        ctx.font = "bold 14px Courier New";
        ctx.fillText("ARCHIVES • VOL " + Math.floor(Math.random() * 90 + 10), -paperW/2 + 30, -paperH/2 + 26);
    } else if (palette.type === "book" || palette.type === "novel") {
        ctx.font = "italic 16px Georgia";
        ctx.fillText("Hal. " + Math.floor(Math.random() * 450 + 15), paperW/2 - 95, -paperH/2 + 32);
    } else if (palette.type === "lined") {
        ctx.strokeStyle = "rgba(100, 149, 237, 0.25)";
        ctx.lineWidth = 1;
        for (let ly = -paperH/2 + 40; ly < paperH/2 - 30; ly += 36) {
            ctx.beginPath();
            ctx.moveTo(-paperW/2 + 25, ly);
            ctx.lineTo(paperW/2 - 25, ly);
            ctx.stroke();
        }
    } else if (palette.type === "columns") {
        ctx.beginPath();
        ctx.moveTo(0, -paperH/2 + 25);
        ctx.lineTo(0, paperH/2 - 25);
        ctx.stroke();
    } else if (palette.type === "journal") {
        ctx.strokeRect(-paperW/2 + 20, -paperH/2 + 20, paperW - 40, paperH - 40);
    }

    const snippet = textSnippets[Math.floor(Math.random() * textSnippets.length)];
    const extraBefore = fillerParagraphs[Math.floor(Math.random() * fillerParagraphs.length)];
    const extraAfter = fillerParagraphs[Math.floor(Math.random() * fillerParagraphs.length)];

    const fullBefore = (extraBefore + " " + snippet.before).split(" ");
    const fullAfter = (snippet.after + " " + extraAfter).split(" ");

    ctx.font = `bold ${fontSize}px ${font}`;
    const kwWidth = ctx.measureText(keyword).width;
    const spaceWidth = ctx.measureText(" ").width;
    const lineHeight = fontSize * 1.55;
    const marginX = 45;

    ctx.textBaseline = "middle";

    if (hlMode === "stabilo") {
        const hlColor = highlightColors[Math.floor(Math.random() * highlightColors.length)];
        ctx.fillStyle = hlColor;
        ctx.fillRect((-kwWidth / 2) - 8, (-fontSize / 2) - 4, kwWidth + 16, fontSize + 10);
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
    let curX = (kwWidth / 2) + 12;
    let curY = 0;

    for (let word of fullAfter) {
        let wWidth = ctx.measureText(word).width + spaceWidth;
        if (curX + wWidth > paperW / 2 - marginX) {
            curX = -paperW / 2 + marginX;
            curY += lineHeight;
        }
        if (curY > (paperH / 2) - 45) break;
        ctx.fillText(word, curX, curY);
        curX += wWidth;
    }

    curX = (-kwWidth / 2) - 12;
    curY = 0;

    for (let i = fullBefore.length - 1; i >= 0; i--) {
        let word = fullBefore[i];
        let wWidth = ctx.measureText(word).width + spaceWidth;
        if (curX - wWidth < -paperW / 2 + marginX) {
            curX = paperW / 2 - marginX;
            curY -= lineHeight;
        }
        if (curY < (-paperH / 2) + 45) break;
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
    statusText.innerText = "▶️ Memutar pratinjau kecepatan tinggi (Anti-Lag)...";
    
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
