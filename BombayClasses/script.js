const $ = id => document.getElementById(id);

/* ========= GENERATE RECEIPT ========= */

function generate(){
    let required = ['studentname','amount','paymentfor','standard'];
    let ok = true;

    required.forEach(id=>{
        let el = $(id);
        if(!el.value.trim()){
            el.classList.add('error');
            ok = false;
        } else el.classList.remove('error');
    });

    if(!ok) return alert("Fill required fields");

    let date = new Date().toLocaleDateString('en-GB');

    $("receipt").innerHTML = `
        <div class="title">BOMBAY COACHING CLASSES</div>
        <div class="center small">G101, Ashiyana Complex, Adajan Patiya, Surat</div>
        <div class="center small">Contact: 9819484931</div>
        <hr>
        <div class="line"><b>Date:</b> ${date}</div>
        <div class="line"><b>Student:</b> ${$("studentname").value}</div>
        <div class="line"><b>Standard:</b> ${$("standard").value}</div>
        <div class="line"><b>Payment For:</b> ${$("paymentfor").value}</div>
        <div class="line"><b>Amount:</b> ₹${$("amount").value}</div>
        <div class="line"><b>Mode:</b> ${$("mode").value}</div>
        <div class="line"><b>Received By:</b> ${$("receivedby").value}</div>
        <div class="line"><b>Note:</b> ${$("note").value}</div>
        <br><b>Thank you!</b>
    `;

    $("receipt").classList.remove("hidden");
}

/* ========= DOWNLOAD JPG ========= */

function downloadJPG(){
    let receipt = $("receipt");
    if(receipt.classList.contains("hidden"))
        return alert("Generate first");

    let filename = `${$("studentname").value}_${$("paymentfor").value}.jpg`;

    html2canvas(receipt).then(canvas=>{
        let a = document.createElement("a");
        a.download = filename;
        a.href = canvas.toDataURL("image/jpeg");
        a.click();
    });
}

/* ========= PRINT ========= */

function printReceipt(){
    let receipt = $("receipt");
    if(receipt.classList.contains("hidden"))
        return alert("Generate first");

    let w = window.open("");
    w.document.write(receipt.outerHTML);
    w.print();
    w.close();
}

/* ========= HISTORY (READ ONLY) ========= */

let fullHistory = [];
let historyIndex = 0;

async function openHistory(){
    let year = new Date().getFullYear();
    let url = `https://raw.githubusercontent.com/ahmedfarook/BombayClasses/main/history/${year}.json`;

    let panel = document.getElementById("historyPanel");
    panel.style.display = "block";
    panel.innerHTML = "Loading...";

    try {
        let response = await fetch(url);
        if(!response.ok) throw new Error("History not found");

        let data = await response.json();

        fullHistory = data.reverse();
        historyIndex = 0;

        renderHistoryTable();

    } catch (e){
        panel.innerHTML = "❌ No history found";
        console.error(e);
    }
}


function renderHistoryTable(){
    let panel = document.getElementById("historyPanel");

    let rows = fullHistory.slice(0, historyIndex + 5);
    historyIndex = rows.length;

    let html = `
    <h3>${new Date().getFullYear()} - History</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="border:1px solid #ccc;padding:6px;">#</th>
          <th style="border:1px solid #ccc;padding:6px;">Student</th>
         <!-- <th style="border:1px solid #ccc;padding:6px;">Std</th> -->
          <th style="border:1px solid #ccc;padding:6px;">Amount</th>
         <!-- <th style="border:1px solid #ccc;padding:6px;">For</th> -->
         <!-- <th style="border:1px solid #ccc;padding:6px;">Mode</th> -->
          <th style="border:1px solid #ccc;padding:6px;">Date</th>
          <th style="border:1px solid #ccc;padding:6px;">Receipt</th>
        </tr>
      </thead>
      <tbody>
    `;

    rows.forEach((x, i) => {
        html += `
        <tr>
          <td style="border:1px solid #ccc;padding:6px;">${i + 1}</td>
          <td style="border:1px solid #ccc;padding:6px;">${x.name}</td>
         <!-- <td style="border:1px solid #ccc;padding:6px;">${x.std}</td> -->
          <td style="border:1px solid #ccc;padding:6px;">₹${x.amt}</td>
         <!-- <td style="border:1px solid #ccc;padding:6px;">${x.for}</td> -->
         <!-- <td style="border:1px solid #ccc;padding:6px;">${x.PaymentMode || "-"}</td> -->
          <td style="border:1px solid #ccc;padding:6px;">${x.date}</td>
          <td style="border:1px solid #ccc;padding:6px;text-align:center;">
            ${
              x.file
              ? `<a href="https://raw.githubusercontent.com/ahmedfarook/BombayClasses/main/receipts/${x.file}"
                    target="_blank"
                    title="Open Receipt"
                    class="open-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M14 3H21V10" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 14L21 3" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 14V21H3V3H10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </a>`
              : "-"
            }
          </td>
        </tr>
        `;
    });

    html += `</tbody></table>`;

    if(historyIndex < fullHistory.length){
        html += `
        <button onclick="renderHistoryTable()"
        style="margin-top:10px;width:100%;padding:10px;
        background:#111;color:#fff;border:none;
        border-radius:8px;font-size:14px;cursor:pointer;">
        Show More
        </button>`;
    }

    panel.innerHTML = html;
}
