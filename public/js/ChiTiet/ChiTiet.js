"use strict";
const makeImgSrcArray = () => {
    const arr = Array(5);
    for (let index = 0; index < arr.length; index++) {
        const data = {
            src: `image/image${index}.png`,
            alt: `car img no image${index}`
        };
        arr[index] = data;
    }
    return arr;
};
class ChiTietElement extends HTMLElement {
    constructor() {
        var _a, _b, _c;
        super();
        this.displayChiTiet = false;
        this.attachShadow({ mode: "open" });
        let template = document.getElementById("chi-tiet-template");
        const styleLinkElem = document.createElement("link");
        styleLinkElem.setAttribute("rel", "stylesheet");
        styleLinkElem.setAttribute("href", "/css/ChiTiet.css");
        let templateContent = template.content;
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(styleLinkElem);
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(templateContent.cloneNode(true));
        this.detailTabs = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelectorAll(".js_vexere_detail_tab_item");
        this.currentDisplayedDetailTab = 0;
        this.addDetailImage();
        this.addOpenDatailClickHandle();
        this.addDetailTabClickHandle();
    }
    addDetailImage() {
        var _a;
        const imgDisplayWrapper = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".vexere_bus_image_slider_display");
        const imgDatas = makeImgSrcArray();
        imgDatas.forEach((item) => {
            const imgDivWrap = document.createElement("div");
            const image = document.createElement("img");
            image.src = item.src;
            image.alt = item.alt;
            imgDivWrap.className = "vexere_bus_image_slider_display_img";
            imgDivWrap.appendChild(image);
            imgDisplayWrapper === null || imgDisplayWrapper === void 0 ? void 0 : imgDisplayWrapper.appendChild(imgDivWrap);
        });
    }
    addOpenDatailClickHandle() {
        var _a, _b;
        const chiTietAction = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".vexere_info_action > h4");
        const chiTiet = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector(".vexere_detail_info_container");
        chiTiet.style.display = "none";
        chiTietAction === null || chiTietAction === void 0 ? void 0 : chiTietAction.addEventListener('click', () => {
            var _a;
            this.displayChiTiet = !this.displayChiTiet;
            const chiTietElement = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".vexere_detail_info_container");
            chiTietElement.style.display = (this.displayChiTiet) ? "" : "none";
        });
    }
    addDetailTabClickHandle() {
        var _a;
        this.detailTabs.forEach((ele, index) => {
            ele.style.display = (index != 0) ? "none" : "";
        });
        const buttons = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".vexere_detail_info_select_tab > button");
        if (buttons) {
            buttons.forEach((btn) => {
                btn.addEventListener("click", (event) => {
                    const btnClickValue = Number.parseInt(event.target.value);
                    if (!isNaN(btnClickValue) && btnClickValue < this.detailTabs.length) {
                        this.detailTabs.forEach((ele, index) => {
                            ele.style.display = "none";
                        });
                        this.detailTabs[btnClickValue].style.display = "";
                    }
                });
            });
        }
    }
}
customElements.define("chi-tiet-element", ChiTietElement);
const body = document.body;
Array(5).fill(0).forEach(() => {
    const chiTietElement = document.createElement("chi-tiet-element");
    body.appendChild(chiTietElement);
});
