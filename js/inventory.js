// Constants
const API_BASE_URL = "http://localhost:5222/api";

// Main execution
document.addEventListener("DOMContentLoaded", initializeApp);

// State
let state = {
    goods: [],
    editGoodIndex: null,
    importDetails: []
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
    importDetailAddTable: document.querySelector("#importDetailAddTable"),
    importDetailViewTable: document.querySelector("#importDetailViewTable"),
    importHistoryTableBody: document.querySelector("#importHistoryTableBody"),
    importHistoryTableForGood: document.querySelector("#importHistoryTableForGood"),
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
            populateGoodsDropdown(data.data);
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

    fetchImportGoodsDetails: async function (importId) {
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
    renderImportDetailAddTable();
    elements.quantityInput.value = "";
}

window.removeImportDetail = function (index) {
    state.importDetails.splice(index, 1);
    renderImportDetailAddTable();
};

async function finalizeImport() {
    if (state.importDetails.length === 0) {
        alert("Please add at least one good to the import");
        return;
    }

    const supplier = elements.supplierInput.value.trim();
    if (!supplier) {
        alert("Please enter a supplier");
        return;
    }

    const totalPrice = state.importDetails.reduce((sum, detail) =>
        sum + (detail.quantity * detail.costPrice), 0);

    const importData = {
        IgSupplier: supplier,
        IgSumPrice: totalPrice,
        IgCurrency: "VND",
        IgImportDate: new Date().toISOString()
    };

    try {
        const importResponse = await api.insertImport(importData);
        if (!importResponse.ok) {
            const errorData = await importResponse.json();
            throw new Error("Failed to save import: " + JSON.stringify(errorData));
        }

        const importResult = await importResponse.json();
        const importId = importResult.data.igImportId;

        const detailPromises = state.importDetails.map(async detail => {
            const detailData = {
                IgdImportId: importId,
                IgdGoodsId: detail.goodsId,
                IgdQuantity: detail.quantity,
                IgdCostPrice: detail.costPrice
            };
            const response = await api.insertImportDetail(detailData);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("Failed to save detail: " + JSON.stringify(errorData));
            }
            return response;
        });

        const quantityPromises = state.importDetails.map(async detail => {
            const good = state.goods.find(g => g.gGoodsId === detail.goodsId);
            good.gQuantity += detail.quantity;
            return await api.updateGood(good);
        });

        await Promise.all([...detailPromises, ...quantityPromises]);

        state.importDetails = [];
        elements.supplierInput.value = "";
        renderImportDetailAddTable();
        await Promise.all([api.fetchGoods(), api.fetchImportGoods()]);

        const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
        modal?.hide();
        alert("Import saved successfully!");
    } catch (error) {
        console.error("Error finalizing import:", error);
        alert("Error saving import: " + error.message);
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
                <button onclick="editGood('${good.gGoodsId}')">Update</button>
                <button onclick="deleteGood('${good.gGoodsId}')">Delete</button>
                <button class="btn btn-sm btn-info view-history-btn" 
                    data-good-id="${good.gGoodsId}" 
                    data-good-name="${good.gGoodsName}"
                    data-bs-toggle="modal" 
                    data-bs-target="#importHistoryModal">History</button>
            </td>
        `;
        elements.goodsTableBody.appendChild(row);
    });

    document.querySelectorAll(".view-history-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const goodId = this.getAttribute("data-good-id");
            const goodName = this.getAttribute("data-good-name");
            const history = await api.fetchImportHistoryForGood(goodId);
            renderImportHistoryTableForGood(history, goodName);
        });
    });
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
                <button class="view-details-btn" data-import-id="${importGood.igImportId}" 
                    data-bs-toggle="modal" data-bs-target="#importDetailModal">
                    View Details
                </button>
            </td>
        `;
        elements.importGoodsTableBody.appendChild(row);
    });

    document.querySelectorAll(".view-details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const importId = button.getAttribute("data-import-id");
            api.fetchImportGoodsDetails(importId);
        });
    });
}

function renderImportDetails(imports) {
    elements.importDetailViewTable.innerHTML = "";
    imports.forEach(importGood => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${importGood.goodsName}</td>
            <td>${importGood.quantity}</td>
            <td>${importGood.costPrice}</td>
        `;
        elements.importDetailViewTable.appendChild(row);
    });
}

function renderImportDetailAddTable() {
    elements.importDetailAddTable.innerHTML = "";
    state.importDetails.forEach((detail, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${detail.goodName}</td>
            <td>${detail.quantity}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeImportDetail(${index})">Remove</button>
            </td>
        `;
        elements.importDetailAddTable.appendChild(row);
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

function renderImportHistoryTableForGood(history, goodName) {
    elements.historyGoodName.textContent = goodName;
    elements.importHistoryTableForGood.innerHTML = "";

    if (history && history.length > 0) {
        history.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${goodName}</td>
                <td>${record.igdQuantity}</td>
                <td>${record.igdCostPrice}</td>
                <td>${new Date(record.importDate).toLocaleDateString()}</td>
            `;
            elements.importHistoryTableForGood.appendChild(row);
        });
    } else {
        elements.importHistoryTableForGood.innerHTML =
            '<tr><td colspan="4">No import history found</td></tr>';
    }
}

function populateGoodsDropdown(goods) {
    elements.goodsSelect.innerHTML = "<option value=''>Select a good</option>";
    goods.forEach(good => {
        elements.goodsSelect.innerHTML +=
            `<option value="${good.gGoodsId}" data-cost="${good.gCostPrice}">${good.gGoodsName}</option>`;
    });
}