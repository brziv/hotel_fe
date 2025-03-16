// Constants
const API_BASE_URL = "https://hotel-bed.onrender.com/api";

// State
const state = {
    goodsList: [],
    editGoodId: null,
    importDetailsList: [],
    servicesList: [],
    editServiceId: null,
    serviceGoodsList: [],
};

// DOM Elements
const domElements = {
    goodsTableBody: document.querySelector("#goods-table-body"),
    goodHistoryTable: document.querySelector("#good-history-table"),
    historyGoodName: document.querySelector("#history-good-name"),
    addGoodsForm: document.querySelector("#add-goods-form"),
    goodsNameInput: document.querySelector("#goods-name"),
    categoryInput: document.querySelector("#category"),
    unitInput: document.querySelector("#unit"),
    costPriceInput: document.querySelector("#cost-price"),
    sellingPriceInput: document.querySelector("#selling-price"),
    addGoodBtn: document.querySelector("#add-good-btn"),
    updateGoodBtn: document.querySelector("#update-good-btn"),

    importGoodsTableBody: document.querySelector("#import-goods-table-body"),
    addImportTable: document.querySelector("#add-import-table"),
    importDetailTable: document.querySelector("#import-detail-table"),
    importSupplierInput: document.querySelector("#import-supplier"),
    importGoodsSelect: document.querySelector("#import-goods-select"),
    importQuantityInput: document.querySelector("#import-quantity"),
    addImportDetailBtn: document.querySelector("#add-import-detail-btn"),
    finalizeImportBtn: document.querySelector("#finalize-import-btn"),

    importHistoryTableBody: document.querySelector("#import-history-table-body"),

    servicesTableBody: document.querySelector("#services-table-body"),
    addServiceTable: document.querySelector("#add-service-table"),
    serviceNameInput: document.querySelector("#service-name"),
    serviceGoodsSelect: document.querySelector("#service-goods-select"),
    serviceQuantityInput: document.querySelector("#service-quantity"),
    addServiceGoodBtn: document.querySelector("#add-service-good-btn"),
    finalizeServiceBtn: document.querySelector("#finalize-service-btn"),
};

// Initialization
document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    setupEventListeners();
    fetchInitialData();
}

// Event Listeners
function setupEventListeners() {
    domElements.addGoodsForm.addEventListener("submit", handleAddGood);
    domElements.goodsTableBody.addEventListener("click", handleGoodsTableActions);
    domElements.updateGoodBtn.addEventListener("click", handleUpdateGood);

    domElements.addImportDetailBtn.addEventListener("click", handleAddImportDetail);
    domElements.finalizeImportBtn.addEventListener("click", handleFinalizeImport);

    domElements.addServiceGoodBtn.addEventListener("click", handleAddServiceGood);
    domElements.finalizeServiceBtn.addEventListener("click", handleFinalizeService);
    domElements.servicesTableBody.addEventListener("click", handleServicesTableActions);
}

// Data Fetching
async function fetchInitialData() {
    await Promise.all([
        api.fetchGoods(),
        api.fetchImportGoods(),
        api.fetchImportHistory(),
        api.fetchServices(),
    ]);
}

// API Calls
const api = {
    fetchGoods: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Good/GetGoodList`);
            const data = await response.json();
            state.goodsList = data.data;
            renderGoodsTable();
            populateImportGoodsSelect(data.data);
            populateServiceGoodsSelect(data.data);
        } catch (error) {
            console.error("Error fetching goods:", error);
        }
    },

    fetchGoodHistory: async (goodId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailListByGood/${goodId}`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error fetching good history:", error);
            return [];
        }
    },

    fetchImportGoods: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGood/GetImportGoodList`);
            const data = await response.json();
            renderImportGoodsTable(data.data);
        } catch (error) {
            console.error("Error fetching import goods:", error);
        }
    },

    fetchImportDetails: async (importId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailListByImport/${importId}`);
            const data = await response.json();
            renderImportDetails(data.data);
        } catch (error) {
            console.error("Error fetching import details:", error);
        }
    },

    fetchImportHistory: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailList`);
            const data = await response.json();
            renderImportHistoryTable(data.data);
        } catch (error) {
            console.error("Error fetching import history:", error);
        }
    },

    fetchServices: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/Service/GetServiceList`);
            const data = await response.json();
            state.servicesList = data.data;
            renderServicesTable(data.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    },

    addGood: async (good) => {
        return await fetch(`${API_BASE_URL}/Good/InsertTblGood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(good),
        });
    },

    updateGood: async (good) => {
        return await fetch(`${API_BASE_URL}/Good/UpdateTblGood`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(good),
        });
    },

    deleteGood: async (id) => {
        return await fetch(`${API_BASE_URL}/Good/XoaTblGood?gGoodsId=${id}`, {
            method: "DELETE",
        });
    },

    insertImport: async (importData) => {
        return await fetch(`${API_BASE_URL}/ImportGood/InsertTblImportGood`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(importData),
        });
    },

    insertImportDetail: async (detailData) => {
        return await fetch(`${API_BASE_URL}/ImportGoodsDetail/InsertTblImportGoodsDetail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detailData),
        });
    },

    addService: async (service) => {
        return await fetch(`${API_BASE_URL}/Service/InsertTblService`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(service),
        });
    },

    deleteService: async (id) => {
        return await fetch(`${API_BASE_URL}/Service/XoaTblService?sServiceId=${id}`, {
            method: "DELETE",
        });
    },
};

// Event Handlers
async function handleAddGood(event) {
    event.preventDefault();
    const newGood = {
        gGoodsName: domElements.goodsNameInput.value.trim(),
        gCategory: domElements.categoryInput.value.trim(),
        gQuantity: 0,
        gUnit: domElements.unitInput.value.trim(),
        gCostPrice: parseFloat(domElements.costPriceInput.value),
        gSellingPrice: parseFloat(domElements.sellingPriceInput.value),
        gCurrency: "VND",
    };

    try {
        await api.addGood(newGood);
        await api.fetchGoods();
        domElements.addGoodsForm.reset();
    } catch (error) {
        console.error("Error adding good:", error);
    }
}

function handleGoodsTableActions(event) {
    const target = event.target;
    const goodId = target.dataset.goodId;

    if (target.classList.contains("update-good-btn")) {
        editGood(goodId);
    } else if (target.classList.contains("delete-good-btn")) {
        deleteGood(goodId);
    } else if (target.classList.contains("history-btn")) {
        showGoodHistory(goodId, target.dataset.goodName);
    }
}

function editGood(goodId) {
    const good = state.goodsList.find((g) => g.gGoodsId === goodId);
    if (!good) return;

    domElements.goodsNameInput.value = good.gGoodsName;
    domElements.categoryInput.value = good.gCategory;
    domElements.unitInput.value = good.gUnit;
    domElements.costPriceInput.value = good.gCostPrice;
    domElements.sellingPriceInput.value = good.gSellingPrice;

    state.editGoodId = goodId;
    domElements.addGoodBtn.style.display = "none";
    domElements.updateGoodBtn.style.display = "inline-block";
}

async function handleUpdateGood() {
    const good = state.goodsList.find((g) => g.gGoodsId === state.editGoodId);
    if (!good) return;

    good.gGoodsName = domElements.goodsNameInput.value.trim();
    good.gCategory = domElements.categoryInput.value.trim();
    good.gUnit = domElements.unitInput.value.trim();
    good.gCostPrice = parseFloat(domElements.costPriceInput.value);
    good.gSellingPrice = parseFloat(domElements.sellingPriceInput.value);
    good.gCurrency = "VND";

    try {
        await api.updateGood(good);
        await api.fetchGoods();
        domElements.addGoodsForm.reset();
        domElements.addGoodBtn.style.display = "inline-block";
        domElements.updateGoodBtn.style.display = "none";
        state.editGoodId = null;
    } catch (error) {
        console.error("Error updating good:", error);
    }
}

async function deleteGood(goodId) {
    if (confirm("Are you sure you want to delete this good?")) {
        try {
            const response = await api.deleteGood(goodId);
            if (!response.ok) throw new Error("Failed to delete good");
            await api.fetchGoods();
            alert("Good deleted successfully!");
        } catch (error) {
            console.error("Error deleting good:", error);
            alert("Failed to delete good");
        }
    }
}

async function showGoodHistory(goodId, goodName) {
    const history = await api.fetchGoodHistory(goodId);
    renderGoodHistoryTable(history, goodName);
}

function handleAddImportDetail() {
    const goodsId = domElements.importGoodsSelect.value;
    const quantity = parseInt(domElements.importQuantityInput.value);
    const selectedOption = domElements.importGoodsSelect.selectedOptions[0];
    const costPrice = parseFloat(selectedOption.dataset.cost);
    const goodName = selectedOption.text;

    if (!goodsId || !quantity || quantity <= 0) {
        alert("Please select a good and enter a valid quantity");
        return;
    }

    if (state.importDetailsList.some((detail) => detail.goodsId === goodsId)) {
        alert("This good is already added to the import");
        return;
    }

    state.importDetailsList.push({ goodsId, quantity, costPrice, goodName });
    renderAddImportTable();
    domElements.importQuantityInput.value = "";
}

function handleRemoveImportDetail(index) {
    state.importDetailsList.splice(index, 1);
    renderAddImportTable();
}

async function handleFinalizeImport() {
    if (state.importDetailsList.length === 0) {
        alert("Please add at least one item to import");
        return;
    }

    const totalPrice = state.importDetailsList.reduce(
        (sum, detail) => sum + detail.quantity * detail.costPrice,
        0
    );

    const importData = {
        igSupplier: domElements.importSupplierInput.value.trim(),
        igSumPrice: totalPrice,
        igCurrency: "VND",
        igImportDate: new Date().toISOString(),
    };

    try {
        const importResponse = await api.insertImport(importData);
        const importResult = await importResponse.json();
        const importId = importResult.data.igImportId;

        const detailPromises = state.importDetailsList.map((detail) => {
            const detailData = {
                igdImportId: importId,
                igdGoodsId: detail.goodsId,
                igdQuantity: detail.quantity,
                igdCostPrice: detail.costPrice,
            };
            return api.insertImportDetail(detailData);
        });

        await Promise.all(detailPromises);

        const quantityUpdates = state.importDetailsList.map((detail) => {
            const good = state.goodsList.find((g) => g.gGoodsId === detail.goodsId);
            good.gQuantity += detail.quantity;
            return api.updateGood(good);
        });

        await Promise.all(quantityUpdates);

        state.importDetailsList = [];
        domElements.importSupplierInput.value = "";
        renderAddImportTable();
        await Promise.all([api.fetchGoods(), api.fetchImportGoods(), api.fetchImportHistory()]);
        alert("Import successfully added!");
        bootstrap.Modal.getInstance(document.getElementById("import-modal")).hide();
    } catch (error) {
        console.error("Error finalizing import:", error);
        alert("Failed to add import");
    }
}

function handleAddServiceGood() {
    const goodsId = domElements.serviceGoodsSelect.value;
    const quantity = parseInt(domElements.serviceQuantityInput.value);
    const selectedOption = domElements.serviceGoodsSelect.selectedOptions[0];
    const goodName = selectedOption.text;
    const costPrice = parseFloat(selectedOption.dataset.cost);
    const sellingPrice = parseFloat(selectedOption.dataset.sellingPrice || 0);

    if (!goodsId || !quantity || quantity <= 0) {
        alert("Please select a good and enter a valid quantity");
        return;
    }

    if (state.serviceGoodsList.some((detail) => detail.goodsId === goodsId)) {
        alert("This good is already added to the service");
        return;
    }

    state.serviceGoodsList.push({ goodsId, quantity, goodName, costPrice, sellingPrice });
    renderServiceGoodsTable();
    domElements.serviceQuantityInput.value = "";
}

function handleRemoveServiceGood(index) {
    state.serviceGoodsList.splice(index, 1);
    renderServiceGoodsTable();
}

async function handleFinalizeService() {
    if (state.serviceGoodsList.length === 0) {
        alert("Please add at least one good to the service");
        return;
    }

    const totalCostPrice = state.serviceGoodsList.reduce(
        (sum, detail) => sum + detail.costPrice * detail.quantity,
        0
    );
    const totalSellPrice = state.serviceGoodsList.reduce(
        (sum, detail) => sum + detail.sellingPrice * detail.quantity,
        0
    );

    const serviceData = {
        sServiceName: domElements.serviceNameInput.value.trim(),
        sServiceCostPrice: totalCostPrice,
        sServiceSellPrice: totalSellPrice,
        serviceGoods: state.serviceGoodsList.map(detail => ({
            sgGoodsId: detail.goodsId,
            sgQuantity: detail.quantity
        }))
    };

    try {
        const response = await api.addService(serviceData);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        await api.fetchServices();
        state.serviceGoodsList = [];
        domElements.addServiceTable.reset();
        renderServiceGoodsTable();
        alert("Service added successfully!");
        bootstrap.Modal.getInstance(document.getElementById("service-modal")).hide();
    } catch (error) {
        console.error("Error adding service:", error);
        alert("Failed to add service: " + error.message);
    }
}

function handleServicesTableActions(event) {
    const target = event.target;
    const serviceId = target.dataset.serviceId;

    if (target.classList.contains("delete-service-btn")) {
        deleteService(serviceId);
    }
}

async function deleteService(serviceId) {
    if (confirm("Are you sure you want to delete this service?")) {
        try {
            const response = await api.deleteService(serviceId);
            if (!response.ok) throw new Error("Failed to delete service");
            await api.fetchServices();
            alert("Service deleted successfully!");
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service");
        }
    }
}

// Rendering Functions
function renderGoodsTable() {
    domElements.goodsTableBody.innerHTML = "";

    state.goodsList.forEach((good) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${good.gGoodsName}</td>
            <td>${good.gCategory}</td>
            <td>${good.gQuantity}</td>
            <td>${good.gUnit}</td>
            <td>${good.gCostPrice}</td>
            <td>${good.gSellingPrice}</td>
            <td>${good.gCurrency}</td>
            <td>
                <button class="history-btn btn btn-sm btn-info" data-good-id="${good.gGoodsId}" data-good-name="${good.gGoodsName}" data-bs-toggle="modal" data-bs-target="#good-history-modal">History</button>
                <button class="update-good-btn btn btn-sm btn-primary" data-good-id="${good.gGoodsId}">Update</button>
                <button class="delete-good-btn btn btn-sm btn-danger" data-good-id="${good.gGoodsId}">Delete</button>
            </td>
        `;
        domElements.goodsTableBody.appendChild(row);
    });
}

function renderGoodHistoryTable(history, goodName) {
    domElements.historyGoodName.textContent = goodName;
    domElements.goodHistoryTable.innerHTML = "";

    if (history && history.length > 0) {
        const sortedHistory = [...history].sort((a, b) => {
            return new Date(b.igImportDate) - new Date(a.igImportDate);
        });

        sortedHistory.forEach((record) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.igSupplier}</td>
                <td>${record.igdQuantity}</td>
                <td>${record.igdCostPrice}</td>
                <td>${new Date(record.igImportDate).toLocaleDateString()}</td>
            `;
            domElements.goodHistoryTable.appendChild(row);
        });
    } else {
        domElements.goodHistoryTable.innerHTML = '<tr><td colspan="4">No import history found</td></tr>';
    }
}

function renderImportGoodsTable(imports) {
    domElements.importGoodsTableBody.innerHTML = "";

    const sortedImport = [...imports].sort((a, b) => {
        return new Date(b.igImportDate) - new Date(a.igImportDate);
    });

    sortedImport.forEach((importGood) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${importGood.igSupplier}</td>
            <td>${importGood.igSumPrice}</td>
            <td>${importGood.igCurrency}</td>
            <td>${new Date(importGood.igImportDate).toLocaleString()}</td>
            <td>
                <button class="view-details-btn btn btn-sm btn-info" data-import-id="${importGood.igImportId}" data-bs-toggle="modal" data-bs-target="#import-detail-modal">View Details</button>
            </td>
        `;
        domElements.importGoodsTableBody.appendChild(row);
    });

    document.querySelectorAll(".view-details-btn").forEach((button) => {
        button.addEventListener("click", async () => {
            const importId = button.getAttribute("data-import-id");
            await api.fetchImportDetails(importId);
        });
    });
}

function populateImportGoodsSelect(goods) {
    domElements.importGoodsSelect.innerHTML = '<option value="">Select a good</option>';
    goods.forEach((good) => {
        domElements.importGoodsSelect.innerHTML += `
            <option value="${good.gGoodsId}" data-cost="${good.gCostPrice}">${good.gGoodsName}</option>
        `;
    });
}

function renderAddImportTable() {
    domElements.addImportTable.innerHTML = "";

    state.importDetailsList.forEach((detail, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${detail.goodName}</td>
            <td>${detail.quantity}</td>
            <td><button class="btn btn-danger btn-sm" onclick="handleRemoveImportDetail(${index})">Remove</button></td>
        `;
        domElements.addImportTable.appendChild(row);
    });
}

function renderImportDetails(imports) {
    domElements.importDetailTable.innerHTML = "";

    imports.forEach((importGood) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${importGood.gGoodsName}</td>
            <td>${importGood.igdQuantity}</td>
            <td>${importGood.igdCostPrice}</td>
        `;
        domElements.importDetailTable.appendChild(row);
    });
}

function renderImportHistoryTable(history) {
    domElements.importHistoryTableBody.innerHTML = "";

    if (history && history.length > 0) {
        const sortedHistory = [...history].sort((a, b) => {
            return new Date(b.igImportDate) - new Date(a.igImportDate);
        });

        sortedHistory.forEach((record) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.gGoodsName}</td>
                <td>${record.igdQuantity}</td>
                <td>${record.igdCostPrice}</td>
                <td>${record.igSupplier}</td>
                <td>${new Date(record.igImportDate).toLocaleString()}</td>
            `;
            domElements.importHistoryTableBody.appendChild(row);
        });
    }
}

function renderServicesTable(services) {
    domElements.servicesTableBody.innerHTML = "";

    services.forEach((service) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${service.sServiceName}</td>
            <td>${service.goodsInfo.split('\n').join('<br>')}</td>
            <td>${service.sServiceCostPrice.toLocaleString()} VND</td>
            <td>${service.sServiceSellPrice.toLocaleString()} VND</td>
            <td>
                <button class="delete-service-btn btn btn-sm btn-danger" data-service-id="${service.sServiceId}">Delete</button>
            </td>
        `;
        domElements.servicesTableBody.appendChild(row);
    });
}

function renderServiceGoodsTable() {
    const tableBody = document.querySelector("#service-goods-table-body");
    tableBody.innerHTML = "";

    state.serviceGoodsList.forEach((detail, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${detail.goodName}</td>
            <td>${detail.quantity}</td>
            <td>${(detail.costPrice * detail.quantity).toLocaleString()} VND</td>
            <td>${(detail.sellingPrice * detail.quantity).toLocaleString()} VND</td>
            <td><button class="btn btn-danger btn-sm" onclick="handleRemoveServiceGood(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function populateServiceGoodsSelect(goods) {
    domElements.serviceGoodsSelect.innerHTML = '<option value="">Select a good</option>';
    goods.forEach((good) => {
        domElements.serviceGoodsSelect.innerHTML += `
            <option value="${good.gGoodsId}" data-cost="${good.gCostPrice}" data-selling-price="${good.gSellingPrice}">${good.gGoodsName}</option>
        `;
    });
}