const canvas = document.getElementById('paperCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('statusText');
let animationInterval;

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
    { before: "Penelitian empiris menunjukkan korelasi positif antara", after: "dengan peningkatan daya ingat jangka panjang pada subjek uji." }
];

const fillerParagraphs = [
    "Perkembangan gagasan manusia selalu berawal dari pengamatan mendalam terhadap pola-pola kecil yang sering terabaikan oleh mata telanjang dalam kehidupan sehari-hari.",
    "Halaman demi halaman arsip mencatat perubahan zaman yang begitu cepat, menuntut setiap individu untuk terus memperbarui cara pandang serta ketajaman analisisnya.",
    "Dalam literatur klasik maupun modern, struktur narasi dibangun untuk menuntun pembaca memahami inti persoalan secara bertahap namun tetap menyisakan ruang perenungan.",
    "Catatan kaki dan kutipan dari berbagai sumber menunjukkan bahwa konsistensi merupakan jembatan utama antara teori abstrak dan penerapan nyata di lapangan.",
    "Arsip cetakan lama memiliki karakteristik tipografi yang khas, di mana setiap huruf dicetak menggunakan pelat logam di atas lembaran serat kayu alami.",
    "Perubahan struktur sosial sering kali tercermin melalui tajuk rencana surat kabar yang terbit pada masa peralihan era industri menuju era informasi."
];

const fonts = ["Georgia", "Times New Roman", "Courier New", "Palatino", "Baskerville", "Garamond"];

const paperPalettes = [
    { bg: "#f4efe6", text: "#22201e", border: "#cfc5b4", type: "novel" },
    { bg: "#e6e2d8", text: "#1a1a1a", border: "#b8b2a6", type: "newspaper" },
    { bg: "#fbf9f5", text: "#2c2a29", border: "#dcd7cd", type: "book" },
    { bg: "#dfd5c5", text: "#2b2118", border: "#bba990", type: "archive" },
    { bg: "#1f1f1f", text: "#e8e8e8", border: "#444444", type: "darkprint" }
];

const highlightColors = ["#ffeb3b", "#00e5ff", "#aeea00", "#ff6e40", "#ea80fc"];

function drawTornPaper(x, y, w, h, fillStyle, strokeStyle, hasShadow = true) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    
    if (hasShadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 28;
        ctx.shadowOffsetX = (Math.random() - 0.5) * 24;
        ctx.shadowOffsetY = 14;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);

    const step = 16;
    for (let curX = x; curX <= x + w; curX += step) {
        let jitterY = y + (Math.random() - 0.5) * 9;
        ctx.lineTo(curX, jitterY);
    }
    
    for (let curY = y; curY <= y + h; curY += step * 2) {
        let jitterX = (x + w) + (Math.random() - 0.5) * 5;
        ctx.lineTo(jitterX, curY);
    }

    for (let curX = x + w; curX >= x; curX -= step) {
        let jitterY = (y + h) + (Math.random() - 0.5) * 9;
        ctx.lineTo(curX, jitterY);
    }

    for (let curY = y + h; curY >= y; curY -= step * 2) {
        let jitterX = x + (Math.random() - 0.5) * 5;
        ctx.lineTo(jitterX, curY);
    }

    ctx.closePath();
    ctx.fill();
    
    ctx.shadowColor = "transparent";
    ctx.stroke();
    ctx.restore();
}
function drawDynamicFrame(keyword) {
    const bgMode = document.getElementById('bgModeSelect').value;

    if (bgMode === "greenscreen") {
        ctx.fillStyle = "#00b140";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#121110";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (let b = 0; b < 2; b++) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.45);
        const bgPal = paperPalettes[Math.floor(Math.random() * paperPalettes.length)];
        const offsetX = (Math.random() - 0.5) * 140;
        const offsetY = (Math.random() - 0.5) * 200;
        drawTornPaper(-310 + offsetX, -420 + offsetY, 620, 840, bgPal.bg, bgPal.border, bgMode !== "greenscreen");
        ctx.restore();
    }

    const palette = paperPalettes[Math.floor(Math.random() * paperPalettes.length)];
    const font = fonts[Math.floor(Math.random() * fonts.length)];
    const fontSize = Math.floor(Math.random() * 16) + 34;
    const angle = (Math.random() - 0.5) * 0.16;
    const jitterX = (Math.random() - 0.5) * 35;
    const jitterY = (Math.random() - 0.5) * 35;

    ctx.save();
    ctx.translate((canvas.width / 2) + jitterX, (canvas.height / 2) + jitterY);
    ctx.rotate(angle);

    const paperW = Math.floor(Math.random() * 150) + 550;
    const paperH = Math.floor(Math.random() * 360) + 400;
    
    drawTornPaper(-paperW / 2, -paperH / 2, paperW, paperH, palette.bg, palette.border, bgMode !== "greenscreen");

    for (let i = 0; i < 1400; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.18)";
        ctx.fillRect((Math.random() - 0.5) * paperW, (Math.random() - 0.5) * paperH, 2, 2);
    }

    ctx.fillStyle = palette.border;
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;

    if (palette.type === "newspaper") {
        ctx.beginPath();
        ctx.moveTo(-paperW/2 + 30, -paperH/2 + 38);
        ctx.lineTo(paperW/2 - 30, -paperH/2 + 38);
        ctx.stroke();
    } else if (palette.type === "book" || palette.type === "novel") {
        ctx.font = "italic 16px Georgia";
        ctx.fillText("Hal. " + Math.floor(Math.random() * 300 + 12), paperW/2 - 90, -paperH/2 + 32);
    }

    const snippet = textSnippets[Math.floor(Math.random() * textSnippets.length)];
    const extraBefore = fillerParagraphs[Math.floor(Math.random() * fillerParagraphs.length)];
    const extraAfter = fillerParagraphs[Math.floor(Math.random() * fillerParagraphs.length)];

    const fullBefore = (extraBefore + " " + snippet.before).split(" ");
    const fullAfter = (snippet.after + " " + extraAfter).split(" ");

    ctx.font = `bold ${fontSize}px ${font}`;
    const kwWidth = ctx.measureText(keyword).width;
    const lineHeight = fontSize * 1.55;
    const marginX = 45;

    const hlColor = highlightColors[Math.floor(Math.random() * highlightColors.length)];
    ctx.fillStyle = hlColor;
    ctx.fillRect((-kwWidth / 2) - 8, (-fontSize / 2) - 4, kwWidth + 16, fontSize + 10);

    ctx.fillStyle = "#000000";
    ctx.textBaseline = "middle";
    ctx.fillText(keyword, -kwWidth / 2, 0);

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = palette.text;
    let curX = (kwWidth / 2) + 12;
    let curY = 0;

    for (let word of fullAfter) {
        let wWidth = ctx.measureText(word + " ").width;
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
        let wWidth = ctx.measureText(word + " ").width;
        if (curX - wWidth < -paperW / 2 + marginX) {
            curX = paperW / 2 - marginX;
            curY -= lineHeight;
        }
        if (curY < (-paperH / 2) + 45) break;
        ctx.fillText(word, curX - wWidth + ctx.measureText(" ").width, curY);
        curX -= wWidth;
    }

    ctx.restore();
}

function startPreview() {
    clearInterval(animationInterval);
    const keyword = document.getElementById('keywordInput').value.trim() || "Fokus";
    const speed = parseInt(document.getElementById('speedSelect').value);
    
    drawDynamicFrame(keyword);
    statusText.innerText = "▶️ Memutar pratinjau potongan kertas dinamis...";
    
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
    
    statusText.innerText = "🔴 Sedang merekam video selama 5 detik... Mohon tunggu.";
    
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
        statusText.innerText = "✅ Selesai! Video berhasil diunduh ke perangkat Anda.";
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
