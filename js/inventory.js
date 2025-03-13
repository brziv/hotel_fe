// Constants
const API_BASE_URL = "http://localhost:5222/api";

// Main execution
document.addEventListener("DOMContentLoaded", initializeApp);

// State
let state = {
    goods: [],
    editGoodIndex: null,
    importDetails: [],
};

// DOM Elements
const elements = {
    goodsTableBody: document.querySelector("#goodsTableBody"),
    addGoodsForm: document.querySelector("#addGoodsForm"),
    goodsNameInput: document.querySelector("#goodsName"),
    categoryInput: document.querySelector("#category"),
    unitInput: document.querySelector("#unit"),
    costPriceInput: document.querySelector("#costPrice"),
    sellingPriceInput: document.querySelector("#sellingPrice"),
    addGoodBtn: document.querySelector("#addGoodBtn"),
    goodUpdateBtn: document.querySelector("#goodUpdateBtn"),
    importGoodsTableBody: document.querySelector("#importGoodsTableBody"),
    supplierInput: document.querySelector("#supplier"),
    goodsSelect: document.querySelector("#goodsSelect"),
    quantityInput: document.querySelector("#quantity"),
    addImportDetailBtn: document.querySelector("#addImportDetailBtn"),
    finalizeImportBtn: document.querySelector("#finalizeImportBtn"),
    addImportTable: document.querySelector("#addImportTable"),
    importDetailTable: document.querySelector("#importDetailTable"),
    importHistoryTableBody: document.querySelector("#importHistoryTableBody"),
    goodHistoryTable: document.querySelector("#goodHistoryTable"),
    historyGoodName: document.querySelector("#historyGoodName")
};

// Initialization
function initializeApp() {
    setupEventListeners();
    fetchInitialData();
}

function setupEventListeners() {
    elements.addGoodsForm.addEventListener("submit", addGood);
    elements.goodUpdateBtn.addEventListener("click", updateGoodHandler);
    elements.addImportDetailBtn.addEventListener("click", addImportDetail);
    elements.finalizeImportBtn.addEventListener("click", finalizeImport);
}

async function fetchInitialData() {
    await Promise.all([
        api.fetchGoods(),
        api.fetchImportGoods(),
        api.fetchImportHistory()
    ]);
}

// API Calls
const api = {
    fetchGoods: async function () {
        try {
            const response = await fetch(`${API_BASE_URL}/Good/GetGoodList`);
            const data = await response.json();
            state.goods = data.data;
            renderGoodsTable();
            addGoodsToSelect(data.data);
        } catch (error) {
            console.error("Error fetching goods:", error);
        }
    },

    fetchImportGoods: async function () {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGood/GetImportGoodList`);
            const data = await response.json();
            renderImportGoodsTable(data.data);
        } catch (error) {
            console.error("Error fetching import goods:", error);
        }
    },

    fetchImportHistory: async function () {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailList`);
            const data = await response.json();
            renderImportHistoryTable(data.data);
        } catch (error) {
            console.error("Error fetching full import history:", error);
        }
    },

    fetchImportHistoryForGood: async function (goodId) {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailListByGood/${goodId}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error fetching import history:", error);
            return [];
        }
    },

    fetchImportDetails: async function (importId) {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailListByImport/${importId}`);
            const data = await response.json();
            renderImportDetails(data.data);
        } catch (error) {
            console.error("Error fetching import details:", error);
        }
    },

    addGood: async function (good) {
        return await fetch(`${API_BASE_URL}/Good/InsertTblGood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(good)
        });
    },

    updateGood: async function (good) {
        return await fetch(`${API_BASE_URL}/Good/UpdateTblGood`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(good)
        });
    },

    deleteGood: async function (id) {
        return await fetch(`${API_BASE_URL}/Good/XoaTblGood?gGoodsId=${id}`, {
            method: "DELETE"
        });
    },

    insertImport: async function (importData) {
        return await fetch(`${API_BASE_URL}/ImportGood/InsertTblImportGood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(importData)
        });
    },

    deleteImportDetail: async function (id) {
        return await fetch(`${API_BASE_URL}/ImportGoodsDetail/XoaTblImportGoodsDetail?igdId=${id}`, {
            method: "DELETE"
        });
    },

    insertImportDetail: async function (detailData) {
        return await fetch(`${API_BASE_URL}/ImportGoodsDetail/InsertTblImportGoodsDetail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detailData)
        });
    }
};

// Goods Management
async function addGood(event) {
    event.preventDefault();
    const good = {
        gGoodsName: elements.goodsNameInput.value,
        gCategory: elements.categoryInput.value,
        gQuantity: 0,
        gUnit: elements.unitInput.value,
        gCostPrice: parseFloat(elements.costPriceInput.value),
        gSellingPrice: parseFloat(elements.sellingPriceInput.value),
        gCurrency: "VND"
    };

    try {
        await api.addGood(good);
        await api.fetchGoods();
        elements.addGoodsForm.reset();
    } catch (error) {
        console.error("Error adding good:", error);
    }
}

window.editGood = function (goodId) {
    const good = state.goods.find(g => g.gGoodsId === goodId);
    if (!good) return;

    elements.goodsNameInput.value = good.gGoodsName;
    elements.categoryInput.value = good.gCategory;
    elements.unitInput.value = good.gUnit;
    elements.costPriceInput.value = good.gCostPrice;
    elements.sellingPriceInput.value = good.gSellingPrice;

    state.editGoodIndex = goodId;
    elements.addGoodBtn.style.display = "none";
    elements.goodUpdateBtn.style.display = "inline-block";
};

async function updateGoodHandler() {
    const good = state.goods.find(g => g.gGoodsId === state.editGoodIndex);
    if (!good) return;

    good.gGoodsName = elements.goodsNameInput.value.trim();
    good.gCategory = elements.categoryInput.value.trim();
    good.gUnit = elements.unitInput.value.trim();
    good.gCostPrice = parseFloat(elements.costPriceInput.value);
    good.gSellingPrice = parseFloat(elements.sellingPriceInput.value);
    good.gCurrency = "VND";

    try {
        await api.updateGood(good);
        await api.fetchGoods();
        elements.addGoodsForm.reset();
        elements.addGoodBtn.style.display = "inline-block";
        elements.goodUpdateBtn.style.display = "none";
        state.editGoodIndex = null;
    } catch (error) {
        console.error("Error updating good:", error);
    }
}

window.deleteGood = async function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa hàng này không?")) {
        try {
            await api.deleteGood(id);
            await api.fetchGoods();
        } catch (error) {
            console.error("Error deleting good:", error);
        }
    }
};

// Import Management
function addImportDetail() {
    const goodsId = elements.goodsSelect.value;
    const quantity = parseInt(elements.quantityInput.value);
    const selectedOption = elements.goodsSelect.selectedOptions[0];
    const costPrice = parseFloat(selectedOption.dataset.cost);
    const goodName = selectedOption.text;

    if (!goodsId || !quantity || quantity <= 0) {
        alert("Please select a good and enter a valid quantity");
        return;
    }

    if (state.importDetails.find(detail => detail.goodsId === goodsId)) {
        alert("This good is already added to the import");
        return;
    }

    state.importDetails.push({ goodsId, quantity, costPrice, goodName });
    renderAddImportTable();
    elements.quantityInput.value = "";
}

window.removeImportDetail = function (index) {
    state.importDetails.splice(index, 1);
    renderAddImportTable();
};

async function finalizeImport() {
    if (state.importDetails.length === 0) {
        alert("Please add at least one item to import");
        return;
    }

    const totalPrice = state.importDetails.reduce((sum, detail) =>
        sum + (detail.quantity * detail.costPrice), 0);

    const importData = {
        igSupplier: elements.supplierInput.value.trim(),
        igSumPrice: totalPrice,
        igCurrency: "VND",
        igImportDate: new Date().toISOString()
    };

    try {
        const importResponse = await api.insertImport(importData);
        const importResult = await importResponse.json();
        const importId = importResult.data.igImportId;

        const detailPromises = state.importDetails.map(detail => {
            const detailData = {
                igdImportId: importId,
                igdGoodsId: detail.goodsId,
                igdQuantity: detail.quantity,
                igdCostPrice: detail.costPrice
            };
            return api.insertImportDetail(detailData);
        });

        await Promise.all(detailPromises);

        const quantityUpdates = state.importDetails.map(detail => {
            const good = state.goods.find(g => g.gGoodsId === detail.goodsId);
            good.gQuantity += detail.quantity;
            return api.updateGood(good);
        });

        await Promise.all(quantityUpdates);

        state.importDetails = [];
        elements.supplierInput.value = "";
        renderAddImportTable();
        await Promise.all([
            api.fetchGoods(),
            api.fetchImportGoods(),
            api.fetchImportHistory()
        ]);

        alert("Import successfully added!");
        document.getElementById("importModalLabel").textContent = "New Import";
        bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
    } catch (error) {
        console.error("Error finalizing import:", error);
        alert("Failed to add import");
    }
}

// Rendering Functions
function renderGoodsTable() {
    elements.goodsTableBody.innerHTML = "";
    state.goods.forEach(good => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${good.gGoodsName}</td>
            <td>${good.gCategory || "N/A"}</td>
            <td>${good.gQuantity}</td>
            <td>${good.gUnit}</td>
            <td>${good.gCostPrice}</td>
            <td>${good.gSellingPrice}</td>
            <td>${good.gCurrency}</td>
            <td>
                <button class="history-btn btn btn-sm btn-info" 
                    data-good-id="${good.gGoodsId}" 
                    data-good-name="${good.gGoodsName}"
                    data-bs-toggle="modal" 
                    data-bs-target="#goodHistoryModal">
                    History
                </button>
                <button class="update-good-btn btn btn-sm btn-primary" onclick="editGood('${good.gGoodsId}')">
                    Update
                </button>
                <button class="delete-good-btn btn btn-sm btn-danger" onclick="deleteGood('${good.gGoodsId}')">
                    Delete
                </button>
            </td>
        `;
        elements.goodsTableBody.appendChild(row);
    });

    document.querySelectorAll(".history-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const goodId = this.getAttribute("data-good-id");
            const goodName = this.getAttribute("data-good-name");
            const history = await api.fetchImportHistoryForGood(goodId);
            renderGoodHistoryTable(history, goodName);
        });
    });
}

function addGoodsToSelect(goods) {
    elements.goodsSelect.innerHTML = "<option value=''>Select a good</option>";
    goods.forEach(good => {
        elements.goodsSelect.innerHTML +=
            `<option value="${good.gGoodsId}" data-cost="${good.gCostPrice}">${good.gGoodsName}</option>`;
    });
}

function renderGoodHistoryTable(history, goodName) {
    elements.historyGoodName.textContent = goodName;
    elements.goodHistoryTable.innerHTML = "";

    if (history && history.length > 0) {
        history.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.supplier}</td>
                <td>${record.igdQuantity}</td>
                <td>${record.igdCostPrice}</td>
                <td>${new Date(record.importDate).toLocaleString()}</td>
            `;
            elements.goodHistoryTable.appendChild(row);
        });
    } else {
        elements.goodHistoryTable.innerHTML =
            '<tr><td colspan="4">No import history found</td></tr>';
    }
}

function renderImportGoodsTable(imports) {
    elements.importGoodsTableBody.innerHTML = "";
    imports.forEach(importGood => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${importGood.igSupplier}</td>
            <td>${importGood.igSumPrice}</td>
            <td>${importGood.igCurrency}</td>
            <td>${new Date(importGood.igImportDate).toLocaleString()}</td>
            <td>
                <button class="view-details-btn btn btn-sm btn-info" data-import-id="${importGood.igImportId}" 
                    data-bs-toggle="modal" data-bs-target="#importDetailModal">
                    View Details
                </button>
            </td>
        `;
        elements.importGoodsTableBody.appendChild(row);
    });

    document.querySelectorAll(".view-details-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const importId = button.getAttribute("data-import-id");
            await api.fetchImportDetails(importId);
        });
    });
}

function renderAddImportTable() {
    elements.addImportTable.innerHTML = "";
    state.importDetails.forEach((detail, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${detail.goodName}</td>
            <td>${detail.quantity}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeImportDetail(${index})">Remove</button>
            </td>
        `;
        elements.addImportTable.appendChild(row);
    });
}

function renderImportDetails(imports) {
    elements.importDetailTable.innerHTML = "";
    imports.forEach(importGood => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${importGood.goodsName}</td>
            <td>${importGood.igdQuantity}</td>
            <td>${importGood.igdCostPrice}</td>
        `;
        elements.importDetailTable.appendChild(row);
    });
}

function renderImportHistoryTable(history) {
    elements.importHistoryTableBody.innerHTML = "";
    if (history && history.length > 0) {
        history.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.goodsName}</td>
                <td>${record.igdQuantity}</td>
                <td>${record.igdCostPrice}</td>
                <td>${record.supplier}</td>
                <td>${new Date(record.importDate).toLocaleString()}</td>
            `;
            elements.importHistoryTableBody.appendChild(row);
        });
    }
}