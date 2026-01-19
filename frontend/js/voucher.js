// ================= CUSTOMER SESSION =================
const customer = JSON.parse(localStorage.getItem("customer"));
const userId = customer?._id || null;

// ================= OPEN VOUCHER WALLET =================
function openVoucherWallet() {
  if (!userId) {
    alert("Please log in to view your vouchers.");
    return;
  }

  fetch(`/api/vouchers/${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch vouchers");
      return res.json();
    })
    .then(renderVoucherList)
    .catch((err) => {
      console.error("Voucher fetch error:", err);
      alert("Unable to load vouchers. Please try again.");
    });
}

// ================= RENDER VOUCHERS =================
function renderVoucherList(vouchers) {
  const list = document.getElementById("voucherList");
  const emptyText = document.getElementById("noVoucherText");

  list.innerHTML = "";

  if (!Array.isArray(vouchers) || vouchers.length === 0) {
    emptyText.classList.remove("d-none");
    showVoucherModal();
    return;
  }

  emptyText.classList.add("d-none");

  vouchers.forEach((voucher) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <strong>${voucher.code}</strong><br />
        <small class="text-muted">
          ${formatVoucherValue(voucher)}
        </small>
      </div>
      <button
        class="btn btn-sm btn-success"
        data-id="${voucher._id}"
        data-value="${voucher.value}"
        data-type="${voucher.discountType}"
      >
        Use
      </button>
    `;

    li.querySelector("button").addEventListener("click", () =>
      applyVoucher(voucher)
    );

    list.appendChild(li);
  });

  showVoucherModal();
}

// ================= FORMAT VOUCHER =================
function formatVoucherValue(voucher) {
  return voucher.discountType === "fixed"
    ? `₱${voucher.value} OFF`
    : `${voucher.value}% OFF`;
}

// ================= APPLY VOUCHER =================
function applyVoucher(voucher) {
  localStorage.setItem(
    "appliedVoucher",
    JSON.stringify({
      voucherId: voucher._id,
      value: voucher.value,
      type: voucher.discountType,
    })
  );

  closeVoucherModal();
  alert("Voucher applied successfully!");
}

// ================= MODAL CONTROLS =================
function showVoucherModal() {
  const modalEl = document.getElementById("voucherModal");
  new bootstrap.Modal(modalEl).show();
}

function closeVoucherModal() {
  const modalEl = document.getElementById("voucherModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}
