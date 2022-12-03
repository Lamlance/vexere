const makeImgSrcArray = (amount = 5) => {
    const arr = Array(amount);
    for (let index = 0; index < arr.length; index++) {
        const data = {
            src: `image/image${index}.png`,
            alt: `car img no image${index}`
        };
        arr[index] = data;
    }
    return arr;
};
const FromTo = {
    "from": [
        {
            "time": "12:30",
            "location": "Thị trấn Sapa"
        },
        {
            "time": "13:00",
            "location": "Văn phòng Sapa"
        }
    ],
    "to": [
        {
            "time": "19:30",
            "location": "Văn phòng 789 Giải Phóng"
        },
        {
            "time": "20:00",
            "location": "Ngã ba Kim Anh"
        },
        {
            "time": "20:05",
            "location": "(Ga Nội Địa) - Tầng 1, Sảnh A, Cột 9 - Sân bay Nội Bài"
        },
        {
            "time": "20:05",
            "location": "(Ga Quốc Tế) - Tầng 1, Cửa đến A1, Cột 9 - Sân bay Nội Bài"
        },
        {
            "time": "20:10",
            "location": "Văn Phòng Nội Bài"
        },
        {
            "time": "20:30",
            "location": "Văn phòng 7 Phạm Văn Đồng"
        },
        {
            "time": "21:00",
            "location": "Văn phòng 789 Giải Phóng"
        },
        {
            "time": "21:20",
            "location": "Văn phòng 114 Trần Nhật Duật"
        }
    ]
};
const Rating = [
    {
        "author": "Trung Long",
        "stars": 4,
        "desc": "Anh lái xe dễ thương",
        "date": "2022-11-13"
    },
    {
        "author": "Lê Hiếu",
        "stars": 2,
        "desc": "Không cho khách dừng nghỉ dọc đường ăn uống như các nhà xe khác nên thôi gian đến sớm hơn 1 h Nên chọn xe khác nghe tiếng đã lâu đi 1 lần sẽ không bao giờ đi nữa",
        "date": "2022-11-13"
    },
    {
        "author": "Võ Phi Long",
        "stars": 1,
        "desc": "Gọi 2 lần đến tổng đài để hỏi xe trung chuyển, đảm bảo sẽ có xe đến đón nhưng sát giờ mình gọi lại lần 3 thì báo là không đưa xe đón và tự bắt xe đến ncơ sở",
        "date": "2022-11-11"
    },
    {
        "author": "Võ Phi Long",
        "stars": 3,
        "desc": "Nên nâng cấp cabin, giường nằm không okie nh",
        "date": "2022-11-09"
    },
    {
        "author": "Nguyen Thuy Linh",
        "stars": 5,
        "desc": "Xe tốt chất lượng cao, lái xe nhiệt tình, xe chạy đúng giờ đúng tuyết, rất an toàn và an tâm",
        "date": "2022-10-18"
    },
    {
        "author": "Đào Trúc Linh",
        "stars": 3,
        "desc": "Nhân viên nhà xe dễ thương, nhiệt tình. Xe có ghế nằm thoải mái, có chăn, máy điều hoà tốt, chạy tương đối êm. Tuy nhiên, xe chạy rất trễ so với lịch. Theo lịch 22h30 xe chạy nhưng đén 23h15 xe mới tới. Việc chờ đợi có em bé nhỏ như vậy là bất tiện.",
        "date": "2022-10-05"
    }
];
const Utility = {
    "toilet": {
        "title": "🚽 Toilet",
        "desc": "Nhà vệ sinh trên xe"
    },
    "disinfect": {
        "title": "🧼 Khử khuẩn",
        "desc": "Nhà xe có thực hiện phun khử trùng xe nhằm bảo vệ an toàn cho hành khách mùa Covid"
    },
    "soap": {
        "title": "🧴 Nước rửa tay",
        "desc": "Nhà xe có trang bị nước rửa tay diệt khuẩn trước khi lên xe và trong xe"
    },
    "temperature": {
        "title": "🌡️ Đo thân nhiệt",
        "desc": "Hành khách sẽ được đo thân nhiệt trước khi lên xe để xác định không nghi nhiễm/ lan truyền vi rút Covid cho hành khách khác."
    },
    "mask": {
        "title": "😷 Khuyến cáo đeo khẩu trang",
        "desc": "Có đảm bảo khuyến cáo tất cả hành khách đeo khẩu trang khi lên xe"
    },
    "water": {
        "title": "🥤 Nước uống",
        "desc": "Nhà xe có phục vụ nước cho hành khách."
    },
    "hammer": {
        "title": "🔨 Búa phá kính",
        "desc": "Dùng để phá kính ô tô thoát hiểm trong trường hợp khẩn cấp."
    },
    "tv": {
        "title": "📺 Tivi",
        "desc": "Trên xe có trang bị tivi LED"
    },
    "charger": {
        "title": "🔌 Sạc điện thoại",
        "desc": "Trên xe có ổ USB để cắm sạc"
    },
    "ac": {
        "title": "❄️ Điều hòa",
        "desc": "Trên xe có ổ USB để cắm sạc"
    },
    "wifi": {
        "title": "📶 Wifi",
        "desc": "Trên xe có wifi miễn phí"
    }
};
class ChiTietElement extends HTMLElement {
    constructor(templateParma = undefined) {
        super();
        this.displayChiTiet = false;
        this.attachShadow({ mode: "open" });
        let template = null;
        if (templateParma) {
            template = templateParma;
        }
        else {
            template = document.getElementById("chi-tiet-template");
        }
        const styleLinkElem = document.createElement("link");
        styleLinkElem.setAttribute("rel", "stylesheet");
        styleLinkElem.setAttribute("href", "/css/ChiTiet.css");
        let templateContent = template.content;
        this.shadowRoot?.appendChild(styleLinkElem);
        this.shadowRoot?.appendChild(templateContent.cloneNode(true));
        this.detailTabs = this.shadowRoot?.querySelectorAll(".js_vexere_detail_tab_item");
        this.currentDisplayedDetailTab = 0;
        this.addDetailImage();
        this.addOpenDatailClickHandle();
        this.addDetailTabClickHandle();
    }
    addDetailImage() {
        const imgDisplayWrapper = this.shadowRoot?.querySelector(".vexere_bus_image_slider_display");
        const imgDatas = makeImgSrcArray();
        imgDatas.forEach((item) => {
            const imgDivWrap = document.createElement("div");
            const image = document.createElement("img");
            image.src = item.src;
            image.alt = item.alt;
            imgDivWrap.className = "vexere_bus_image_slider_display_img";
            imgDivWrap.appendChild(image);
            imgDisplayWrapper?.appendChild(imgDivWrap);
        });
    }
    addOpenDatailClickHandle() {
        const chiTietAction = this.shadowRoot?.querySelector(".vexere_info_action > h4");
        const chiTiet = this.shadowRoot?.querySelector(".vexere_detail_info_container");
        chiTiet.style.display = "none";
        chiTietAction?.addEventListener('click', () => {
            chiTietAction.innerHTML = (!this.displayChiTiet) ? `Thông tin chi tiết 🔼` : `Thông tin chi tiết 🔽`;
            this.displayChiTiet = !this.displayChiTiet;
            const chiTietElement = this.shadowRoot?.querySelector(".vexere_detail_info_container");
            chiTietElement.style.display = (this.displayChiTiet) ? "" : "none";
        });
    }
    addDetailTabClickHandle() {
        this.detailTabs.forEach((ele, index) => {
            ele.style.display = (index != 0) ? "none" : "";
        });
    }
}
customElements.define("chi-tiet-element", ChiTietElement);
const body = document.body;
Array(5).fill(0).forEach(() => {
    const chiTietElement = document.createElement("chi-tiet-element");
    body.appendChild(chiTietElement);
});
export default ChiTietElement;
;
