

interface imgAtribute {
  src: string,
  alt: string
}
const makeImgSrcArray = (amount:number = 5) => {
  const arr = Array<imgAtribute>(amount);
  for (let index = 0; index < arr.length; index++) {
    const data: imgAtribute = {
      src: `image/image${index}.png`,
      alt: `car img no image${index}`
    }
    arr[index] = data;
  }
  return arr;
}

class ChiTietElement extends HTMLElement {

  displayChiTiet: boolean;
  detailTabs: NodeListOf<HTMLElement>;
  currentDisplayedDetailTab: number;

  constructor(templateParma:HTMLTemplateElement|undefined|null = undefined) {
    super();
    this.displayChiTiet = false;
    this.attachShadow({ mode: "open" });

    let template:HTMLTemplateElement|undefined|null = null;

    if(templateParma){
      template = templateParma
    }else{
      template = <HTMLTemplateElement>document.getElementById("chi-tiet-template");
    }

    const styleLinkElem = document.createElement("link");
    styleLinkElem.setAttribute("rel", "stylesheet");
    styleLinkElem.setAttribute("href", "/css/ChiTiet.css");

    let templateContent = template.content;
    this.shadowRoot?.appendChild(styleLinkElem);
    this.shadowRoot?.appendChild(templateContent.cloneNode(true));

    this.detailTabs = <NodeListOf<HTMLElement>>this.shadowRoot?.querySelectorAll(".js_vexere_detail_tab_item");
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
    })

  }

  addOpenDatailClickHandle() {
    const chiTietAction = this.shadowRoot?.querySelector(".vexere_info_action > h4");
    const chiTiet = <HTMLElement>this.shadowRoot?.querySelector(".vexere_detail_info_container");
    chiTiet.style.display = "none";

    chiTietAction?.addEventListener('click', () => {
        chiTietAction.innerHTML = ( !this.displayChiTiet ) ? `Thông tin chi tiết 🔼` : `Thông tin chi tiết 🔽`;
        this.displayChiTiet = !this.displayChiTiet;
        const chiTietElement = <HTMLElement>this.shadowRoot?.querySelector(".vexere_detail_info_container");
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
export default ChiTietElement;