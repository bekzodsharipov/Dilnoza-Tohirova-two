function formatUzTimestamp(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} - ${hh}:${min}`;
}

async function sendFormDataFromLocalStorage() {
  const raw = localStorage.getItem("formData");
  if (!raw) return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("formData JSON is broken:", e);
    return;
  }

  // ✅ Always generate (or use existing if you already saved it)
  const sanaSoat = data.SanaSoat || data.sanaSoat || formatUzTimestamp(new Date());

  const fd = new FormData();
  fd.append("sheetName", "Lead");
  fd.append("Ism", data.Ism || data.name || "");
  fd.append("Telefon raqam", data.TelefonRaqam || data.phone || "");
  fd.append("Royhatdan o'tgan vaqti", sanaSoat);

  if (data.sew_level) fd.append("Daraja", data.sew_level);
  if (data.sew_reason) fd.append("Sabab", data.sew_reason);
  if (data.sew_ready) fd.append("Tayyorlik", data.sew_ready);

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbxeDIKZK-yC-q5qxrAtdsmubi6_GgEjVRlSbhWJhVyAWEug6z8crAXMDn4gSmf4a4yeVg/exec",
      { method: "POST", body: fd }
    );

    if (!res.ok) throw new Error("API response not ok: " + res.status);

    localStorage.removeItem("formData");
    console.log("✅ Sent to Sheets");
  } catch (err) {
    console.error("❌ Error submitting form:", err);
    const el = document.getElementById("errorMessage");
    if (el) el.style.display = "block";
  }
}

window.addEventListener("load", sendFormDataFromLocalStorage);
