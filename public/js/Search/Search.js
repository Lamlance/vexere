import ChiTietElement from "../ChiTiet/ChiTiet.js";
const Don = [
    {
        Name: "Sapa",
        Sub: [
            "Văn Phòng Sapa",
            "Thị trấn Sapa",
            "Bến xe Sapa",
            "Trạm dừng nghỉ Cốc San",
            "Khu biệt thự nghĩ dưỡng SapaJade Hills",
            "Thạch Sơn",
            "Điện biên phủ",
            "Điện máy xanh",
            "06 Vườn Treo",
            "Văn Phòng Mường Hoa"
        ]
    }
];
const Tra = [
    {
        Name: "Sóc Sơn",
        Sub: [
            "Ga Nội Địa",
            "Văn phòng Nội Bài",
            "Ngã ba Kim Anh",
            "Ga quốc tế",
            "Ngã tư Nội Bài",
            "Sân bay Nội Bài",
            "Bãi đỗ xe cảng Nội Địa"
        ]
    },
    {
        Name: "Cầu giấy",
        Sub: [
            "Văn Phòng 7 Phạm Văn Đồng",
            "120 Trần Quốc Hoàn",
            "Đại Học Ngoại Ngữ Hà Nội",
            "Cổng Big C Thăng Long",
            "Đại học Ngoại Ngữ"
        ]
    },
    {
        Name: "Hoàn Kiếm",
        Sub: [
            "Văn Phòng 114 Trần Nhật Luật",
            "160 Trần Quang Khải",
            "Khác sạn khu vực Phố Cổ",
            "Văn Phòng Hà Nội",
            "Ngã tự Phố Vọng",
            "Quận Hoàn Kiếm",
            "Phố cổ Hà Nội",
            "05 Hàng Muối"
        ]
    }
];
const NhaXe = [
    "Bảo Yến",
    "Dream Transport Limousine",
    "Daily Limousine",
    "Đức Minh Travel",
    "Fancipan Express Bus",
    "G80 Open Tour",
    "Green Bus",
    "Hà Sơn (Hà Tĩnh - Sapa)"
];
const LoaiXe = [
    "Limousine",
    "Giường nằm",
    "Ghế ngồi"
];
const SoCho = [
    12,
    40,
    22,
    30
];
const TuyenGio = [
    {
        from: "22:28",
        to: "3:43"
    },
    {
        from: "22:28",
        to: "4:28"
    },
    {
        from: "23:00",
        to: "5:00"
    },
    {
        from: "23:30",
        to: "4:20"
    },
    {
        from: "13:30",
        to: "19:20"
    },
    {
        from: "12:30",
        to: "18:20"
    }
];
const searchResultDisplay = document.getElementById("search_result_display");
const deatailTemplate = document.getElementById("chi-tiet-template");
console.log(searchResultDisplay, deatailTemplate);
Array(15).fill(0).forEach(() => {
    searchResultDisplay?.appendChild(new ChiTietElement(deatailTemplate));
});
//Label giá vé (price label)
function priceLabelFunction() {
    const priceLabel = document.querySelector("#price-label");
    const minPriceSlider = document.querySelector(".range-input > #min-price-slider");
    const maxPriceSlider = document.querySelector(".range-input > #max-price-slider");
    const updatePriceLabel = () => {
        console.log("Bang");
        const minPrice = minPriceSlider.valueAsNumber.toLocaleString("en-US", { style: "currency", currency: "VND" });
        const maxPrice = maxPriceSlider.valueAsNumber.toLocaleString("en-US", { style: "currency", currency: "VND" });
        priceLabel.innerText = `Giá từ ${minPrice} VND tới ${maxPrice} VND`;
    };
    if (!(priceLabel && minPriceSlider && maxPriceSlider)) {
        return;
    }
    minPriceSlider.addEventListener("input", updatePriceLabel);
    maxPriceSlider.addEventListener("input", updatePriceLabel);
    updatePriceLabel();
}
priceLabelFunction();
class TwoLevelCheckBox extends HTMLElement {
    constructor(CheckBoxData) {
        super();
        this.displayChild = false;
        this.checkBoxData = CheckBoxData;
        this.attachShadow({ mode: "open" });
        let template = document.getElementById("two-level-checkbox-template");
        if (!template) {
            return;
        }
        const styleLinkElem = document.createElement("link");
        styleLinkElem.setAttribute("rel", "stylesheet");
        styleLinkElem.setAttribute("href", "/css/Search.css");
        let templateContent = template.content;
        this.shadowRoot?.appendChild(styleLinkElem);
        this.shadowRoot?.appendChild(templateContent.cloneNode(true));
        const parentSpan = this.shadowRoot?.querySelector(".js-parent-container > .js-parent-name");
        parentSpan.innerText = this.checkBoxData.Name;
        this.createChild();
        const parentInput = this.shadowRoot?.querySelector(".js-parent-container > input[type=checkbox]");
        parentInput.oninput = (ev) => {
            const checkStatus = parentInput.checked;
            const allChildLi = this.shadowRoot?.querySelectorAll(".js-child-ul > li > label > input");
            allChildLi.forEach((li) => {
                li.checked = checkStatus;
            });
        };
    }
    createChild() {
        const openChild = this.shadowRoot?.querySelector(".js-parent-open");
        const childUl = this.shadowRoot?.querySelector(".js-child-ul");
        childUl.style.display = "none";
        openChild.onclick = (ev) => {
            openChild.innerText = (this.displayChild) ? `▶️` : `🔽`;
            const display = (this.displayChild) ? "none" : "";
            childUl.style.display = display;
            this.displayChild = !this.displayChild;
        };
        this.checkBoxData.Sub.forEach((item) => {
            const li = document.createElement("li");
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "checkbox";
            label.appendChild(input);
            label.innerHTML += item;
            li.appendChild(label);
            childUl?.appendChild(li);
        });
    }
}
customElements.define("two-level-checkbox", TwoLevelCheckBox);
function DiemDonCheckBoxes() {
    const formCheckBoxes = document.getElementById("from-check-boxes");
    Don.forEach((item) => {
        const new2LvlCheckBox = new TwoLevelCheckBox(item);
        formCheckBoxes?.appendChild(new2LvlCheckBox);
    });
}
DiemDonCheckBoxes();
function DiemTraCheckBoxes() {
    const toCheckBox = document.getElementById('to-check-boxes');
    Tra.forEach((item) => {
        const new2LvlCheckBox = new TwoLevelCheckBox(item);
        toCheckBox?.appendChild(new2LvlCheckBox);
    });
}
DiemTraCheckBoxes();
function PopulateSearchResult() {
    const allResult = document.querySelectorAll("#search_result_display > chi-tiet-element");
    allResult.forEach((result) => {
        if (result.shadowRoot) {
            const name = result.shadowRoot.querySelector(".js-bus-house-name");
            name.innerText = NhaXe[Math.floor(Math.random() * NhaXe.length)];
            const type = result.shadowRoot.querySelector(".js-bus-type");
            type.innerText = LoaiXe[Math.floor(Math.random() * LoaiXe.length)];
            const seatAmount = result.shadowRoot.querySelector(".js-seat-amount");
            const seats = SoCho[Math.floor(Math.random() * SoCho.length)];
            seatAmount.innerText = `${seats.toFixed(0)} chỗ`;
            const fromTime = result.shadowRoot.querySelector(".js-from-time");
            const toTime = result.shadowRoot.querySelector(".js-to-time");
            const randTime = TuyenGio[Math.floor(Math.random() * TuyenGio.length)];
            fromTime.innerText = randTime.from;
            toTime.innerText = randTime.to;
            const fromLocation = result.shadowRoot.querySelector(".js-from-location");
            const toLocation = result.shadowRoot.querySelector(".js-to-location");
            const diemDon = Don[Math.floor(Math.random() * Don.length)];
            const diemTra = Tra[Math.floor(Math.random() * Tra.length)];
            fromLocation.innerText = `${diemDon.Name} - ${diemDon.Sub[Math.floor(Math.random() * diemDon.Sub.length)]}`;
            toLocation.innerText = `${diemTra.Name} - ${diemTra.Sub[Math.floor(Math.random() * diemTra.Sub.length)]}`;
            const emptySeat = result.shadowRoot.querySelector(".js-empty-seat");
            emptySeat.innerText = `${Math.floor(Math.random() * seats) + 1} chỗ còn trống`;
        }
    });
}
PopulateSearchResult();
function AdjustEmptySeat() {
    const buttons = document.querySelectorAll("#filter_by_empty_seat_action > button");
    const seatValue = document.querySelector("#filter_by_empty_seat_action > span");
    buttons.forEach((btn) => {
        btn.onclick = (ev) => {
            const change = Number.parseInt(btn.value) ? Number.parseInt(btn.value) : 0;
            const currVal = Number.parseInt(seatValue.innerText);
            console.log(currVal);
            const newVal = (isNaN(currVal) || (currVal + change) < 0 || (currVal + change) >= 20) ? currVal : (Number.parseInt(seatValue.innerText) + change);
            seatValue.innerText = newVal.toFixed(0);
        };
    });
    console.log(buttons);
}
AdjustEmptySeat();
