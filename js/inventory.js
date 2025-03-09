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
    const importDetailsTableBody = document.querySelector("#importDetailsTableBody");
    const supplierInput = document.querySelector("#supplier");
    const goodsSelect = document.querySelector("#goodsSelect");
    const quantityInput = document.querySelector("#quantity");

    let goods = [];
    let editGoodIndex = null;
    let importDetails = [];

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
        goods.forEach((good, index) => {
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
        const goodsSelect = document.querySelector("#goodsSelect");
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

    goodUpdateBtn.addEventListener("click", function () {
        let goodsName = goodsNameInput.value.trim();
        let goodCategory = categoryInput.value.trim();
        let goodUnit = unitInput.value.trim();
        let goodCost = costPriceInput.value.trim();
        let goodSell = sellingPriceInput.value.trim();

        const good = {
            gGuestId: goods[editGoodIndex].gGoodsId,
            gGoodsName: goodsName,
            gCategory: goodCategory,
            gUnit: goodUnit,
            gCostPrice: goodCost,
            gSellingPrice: goodSell
        };

        updateGood(good);
        addGoodsForm.reset();
        addGoodBtn.style.display = "inline-block";
        goodUpdateBtn.style.display = "none";
        editGoodIndex = null;
    });

    window.deleteGood = function (index) {
        if (confirm("Bạn có chắc chắn muốn xóa hàng này không?")) {
            deleteGood(index);
        }
    };

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
            const row = `
                <tr>
                    <td>${importGood.igSupplier}</td>
                    <td>${importGood.igSumPrice}</td>
                    <td>${importGood.igCurrency}</td>
                    <td>${new Date(importGood.igImportDate).toLocaleDateString()}</td>
                    <td><button onclick="viewImportDetails('${importGood.igImportId}')">View Details</button></td>
                </tr>`;
            importGoodsTableBody.innerHTML += row;
        });
    }

    async function viewImportDetails(importId) {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailList`);
            const data = await response.json();
            const details = data.data.filter(detail => detail.igdImportId === importId);
            renderImportDetails(details);
        } catch (error) {
            console.error("Error fetching import details:", error);
        }
    }

    function renderImportDetails(details) {
        importDetailsTableBody.innerHTML = "";
        details.forEach(detail => {
            const row = `
                <tr>
                    <td>${detail.igdGoodsId}</td>
                    <td>${detail.igdQuantity}</td>
                    <td>${detail.igdCostPrice}</td>
                </tr>`;
            importDetailsTableBody.innerHTML += row;
        });
    }

    function addImportDetail() {
        const quantity = parseInt(quantityInput.value);
        const goodId = goodsSelect.value;
        const goodName = goodsSelect.options[goodsSelect.selectedIndex].text;
        const costPrice = parseFloat(goodsSelect.options[goodsSelect.selectedIndex].getAttribute("data-cost"));

        if (!goodId || !quantity || quantity <= 0) {
            alert("Please select a valid good and quantity.");
            return;
        }

        importDetails.push({ igdGoodsId: goodId, igdQuantity: quantity, igdCostPrice: costPrice });

        renderImportDetailsTable();
        quantityInput.value = "";
    }

    function renderImportDetailsTable() {
        const tableBody = document.querySelector("#importDetailsTable");
        tableBody.innerHTML = "";
        importDetails.forEach(detail => {
            const goodName = document.querySelector(`#goodsSelect option[value="${detail.igdGoodsId}"]`).text;
            tableBody.innerHTML += `
                <tr>
                    <td>${goodName}</td>
                    <td>${detail.igdQuantity}</td>
                    <td>
                        <button class="btn btn-danger" onclick="removeImportDetail('${detail.igdGoodsId}')">Remove</button>
                    </td>
                </tr>`;
        });
    }

    function removeImportDetail(goodId) {
        importDetails = importDetails.filter(detail => detail.igdGoodsId !== goodId);
        renderImportDetailsTable();
    }

    async function finalizeImport() {
        const supplier = supplierInput.value;
        const totalSum = importDetails.reduce((sum, detail) => sum + (detail.igdCostPrice * detail.igdQuantity), 0);

        const newImport = {
            igSupplier: supplier,
            igSumPrice: totalSum,
            igCurrency: "VND",
            igImportDate: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_BASE_URL}/ImportGood/InsertTblImportGood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newImport)
            });
            const data = await response.json();
            const currentImportId = data.data.igImportId;

            for (const detail of importDetails) {
                detail.igdImportId = currentImportId;
                await fetch(`${API_BASE_URL}/ImportGoodsDetail/InsertTblImportGoodsDetail`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(detail)
                });
            }

            fetchGoods();
            fetchImportGoods();
            fetchImportGoodsDetails();
            document.querySelector("#importForm").reset();
            document.querySelector("#importDetailsTable").innerHTML = "";
            importDetails = [];
            document.querySelector("a[href='#goods']").click();
        } catch (error) {
            console.error("Error finalizing import:", error);
        }
    }

    async function fetchImportGoodsDetails() {
        try {
            const response = await fetch(`${API_BASE_URL}/ImportGoodsDetail/GetImportGoodsDetailList`);
            const data = await response.json();
            renderImportDetails(data.data);
        } catch (error) {
            console.error("Error fetching import goods details:", error);
        }
    }

    addGoodsForm.addEventListener("submit", addGood);
    fetchGoods();
    fetchImportGoods();
    fetchImportGoodsDetails();
});