const API_BASE_URL = "http://localhost:5222/api";

document.addEventListener("DOMContentLoaded", function () {
    const goodsTableBody = document.querySelector("#goodsTableBody");
    const addGoodsForm = document.querySelector("#addGoodsForm");
    const goodsNameInput = document.querySelector("#goodsName");
    const categoryInput = document.querySelector("#category");
    const unitInput = document.querySelector("#unit");
    const costPriceInput = document.querySelector("#costPrice");
    const sellingPriceInput = document.querySelector("#sellingPrice");
    const addGoodBtn = document.querySelector("#addGoodBtn");
    const goodUpdateBtn = document.querySelector("#goodUpdateBtn");

    const importGoodsTableBody = document.querySelector("#importGoodsTableBody");
    const supplierInput = document.querySelector("#supplier");
    const goodsSelect = document.querySelector("#goodsSelect");
    const quantityInput = document.querySelector("#quantity");
    const addImportDetailBtn = document.querySelector("#addImportDetailBtn");
    const finalizeImportBtn = document.querySelector("#finalizeImportBtn");
    const importDetailsTable = document.querySelector("#importDetailsTable");

    let goods = [];
    let editGoodIndex = null;
    let importDetails = [];

    addGoodsForm.addEventListener("submit", addGood);
    fetchGoods();
    fetchImportGoods();

    async function fetchGoods() {
        try {
            const response = await fetch(`${API_BASE_URL}/Good/GetGoodList`);
            const data = await response.json();
            goods = data.data;
            renderGoodsTable();
            populateGoodsDropdown(data.data);
        } catch (error) {
            console.error("Error fetching goods:", error);
        }
    }

    function renderGoodsTable() {
        goodsTableBody.innerHTML = "";
        goods.forEach((good) => {
            let row = `
                <tr>
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
                    </td>
                </tr>`;
            goodsTableBody.innerHTML += row;
        });
    }

    function populateGoodsDropdown(goods) {
        goodsSelect.innerHTML = "<option value=''>Select a good</option>";
        goods.forEach(good => {
            goodsSelect.innerHTML += `<option value="${good.gGoodsId}" data-cost="${good.gCostPrice}">${good.gGoodsName}</option>`;
        });
    }
    
    async function addGood(event) {
        event.preventDefault();
        const good = {
            gGoodsName: goodsNameInput.value,
            gCategory: categoryInput.value,
            gQuantity: 0,
            gUnit: unitInput.value,
            gCostPrice: parseFloat(costPriceInput.value),
            gSellingPrice: parseFloat(sellingPriceInput.value),
            gCurrency: "VND"
        };
        try {
            await fetch(`${API_BASE_URL}/Good/InsertTblGood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(good)
            });
            fetchGoods();
            addGoodsForm.reset();
        } catch (error) {
            console.error("Error adding good:", error);
        }
    }

    async function updateGood(good) {
        try {
            await fetch(`${API_BASE_URL}/Good/UpdateTblGood`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(good)
            });
            fetchGoods();
        } catch (error) {
            console.error("Error updating good:", error);
        }
    }

    window.deleteGood = function (id) {
        if (confirm("Bạn có chắc chắn muốn xóa hàng này không?")) {
            deleteGood(id);
        }
    };

    async function deleteGood(id) {
        try {
            await fetch(`${API_BASE_URL}/Good/XoaTblGood?gGoodsId=${id}`, { method: "DELETE" });
            fetchGoods();
        } catch (error) {
            console.error("Error deleting good:", error);
        }
    }

    window.editGood = function (goodId) {
        let good = goods.find(g => g.gGoodsId === goodId);
        if (!good) return;

        goodsNameInput.value = good.gGoodsName;
        categoryInput.value = good.gCategory;
        unitInput.value = good.gUnit;
        costPriceInput.value = good.gCostPrice;
        sellingPriceInput.value = good.gSellingPrice;

        editGoodIndex = goodId;
        addGoodBtn.style.display = "none";
        goodUpdateBtn.style.display = "inline-block";
    };

    goodUpdateBtn.addEventListener("click", async function () {
        let goodsName = goodsNameInput.value.trim();
        let goodCategory = categoryInput.value.trim();
        let goodUnit = unitInput.value.trim();
        let goodCost = costPriceInput.value.trim();
        let goodSell = sellingPriceInput.value.trim();

        let good = goods.find(g => g.gGoodsId === editGoodIndex);
        if (!good) return;

        good.gGoodsName = goodsName;
        good.gCategory = goodCategory;
        good.gUnit = goodUnit;
        good.gCostPrice = parseFloat(goodCost);
        good.gSellingPrice = parseFloat(goodSell);
        good.gCurrency = "VND";

        await updateGood(good);
        addGoodsForm.reset();
        addGoodBtn.style.display = "inline-block";
        goodUpdateBtn.style.display = "none";
        editGoodIndex = null;
    });

    addImportDetailBtn.addEventListener("click", addImportDetail);
    finalizeImportBtn.addEventListener("click", finalizeImport);

    function addImportDetail() {
        const goodsId = goodsSelect.value;
        const quantity = parseInt(quantityInput.value);
        const selectedOption = goodsSelect.selectedOptions[0];
        const costPrice = parseFloat(selectedOption.dataset.cost);
        const goodName = selectedOption.text;

        if (!goodsId || !quantity || quantity <= 0) {
            alert("Please select a good and enter a valid quantity");
            return;
        }

        // Check if good already exists in import details
        const existingDetail = importDetails.find(detail => detail.goodsId === goodsId);
        if (existingDetail) {
            alert("This good is already added to the import");
            return;
        }

        const detail = {
            goodsId: goodsId,
            quantity: quantity,
            costPrice: costPrice,
            goodName: goodName
        };

        importDetails.push(detail);
        renderImportDetailsTable();
        quantityInput.value = ""; // Reset quantity input
    }

    function renderImportDetailsTable() {
        importDetailsTable.innerHTML = "";
        importDetails.forEach((detail, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${detail.goodName}</td>
                <td>${detail.quantity}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeImportDetail(${index})">Remove</button>
                </td>
            `;
            importDetailsTable.appendChild(row);
        });
    }

    window.removeImportDetail = function(index) {
        importDetails.splice(index, 1);
        renderImportDetailsTable();
    };

    async function finalizeImport() {
        if (importDetails.length === 0) {
            alert("Please add at least one good to the import");
            return;
        }
    
        const supplier = supplierInput.value.trim();
        if (!supplier) {
            alert("Please enter a supplier");
            return;
        }
    
        const totalPrice = importDetails.reduce((sum, detail) => 
            sum + (detail.quantity * detail.costPrice), 0);
    
        const importData = {
            IgSupplier: supplier,
            IgSumPrice: totalPrice,
            IgCurrency: "VND",
            IgImportDate: new Date().toISOString()
        };
    
        console.log("Sending importData:", JSON.stringify(importData));
    
        try {
            const importResponse = await fetch(`${API_BASE_URL}/ImportGood/InsertTblImportGood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(importData)
            });
    
            if (!importResponse.ok) {
                const errorData = await importResponse.json();
                console.error("Import error:", errorData);
                throw new Error("Failed to save import");
            }
    
            const importResult = await importResponse.json();
            console.log("Full importResult:", JSON.stringify(importResult));
            const importId = importResult.data.igImportId; // Fixed to match response key
            console.log("Received importId from server:", importId);
    
            if (!importId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(importId)) {
                throw new Error("Invalid or missing import ID from server");
            }
    
            const detailPromises = importDetails.map(async detail => {
                const detailData = {
                    IgdImportId: importId,
                    IgdGoodsId: detail.goodsId,
                    IgdQuantity: detail.quantity,
                    IgdCostPrice: detail.costPrice
                };
                console.log("Sending detailData:", JSON.stringify(detailData));
                const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/InsertTblImportGoodsDetail`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(detailData)
                });
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error("Detail insert error:", errorData);
                        throw new Error("Failed to save detail");
                    });
                }
                return response;
            });
    
            const quantityPromises = importDetails.map(detail => {
                const good = goods.find(g => g.gGoodsId === detail.goodsId);
                good.gQuantity += detail.quantity;
                return fetch(`${API_BASE_URL}/Good/UpdateTblGood`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(good)
                });
            });
    
            await Promise.all([...detailPromises, ...quantityPromises]);
    
            importDetails = [];
            supplierInput.value = "";
            renderImportDetailsTable();
            fetchGoods();
            fetchImportGoods();
    
            const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
            modal.hide();
    
            alert("Import saved successfully!");
        } catch (error) {
            console.error("Error finalizing import:", error);
            alert("Error saving import. Please try again.");
        }
    }

    async function fetchImportGoods() {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGood/GetImportGoodList`);
            const data = await response.json();
            renderImportGoodsTable(data.data);
        } catch (error) {
            console.error("Error fetching import goods:", error);
        }
    }

    function renderImportGoodsTable(imports) {
        importGoodsTableBody.innerHTML = "";
        imports.forEach(importGood => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${importGood.igSupplier}</td>
                <td>${importGood.igSumPrice}</td>
                <td>${importGood.igCurrency}</td>
                <td>${new Date(importGood.igImportDate).toLocaleDateString()}</td>
                <td>
                    <button class="view-details-btn" data-import-id="${importGood.igImportId}" data-bs-toggle="modal" data-bs-target="#importDetailsModal">
                        View Details
                    </button>
                </td>
            `;
            importGoodsTableBody.appendChild(row);
        });

        document.querySelectorAll(".view-details-btn").forEach(button => {
            button.addEventListener("click", function () {
                const importId = this.getAttribute("data-import-id");
                fetchImportGoodsDetails(importId);
            });
        });
    }
    
    async function fetchImportGoodsDetails(importId) {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailList/${importId}`);
            const data = await response.json();
            renderImportDetails(data.data);
        } catch (error) {
            console.error("Error fetching import details:", error);
        }
    }
});