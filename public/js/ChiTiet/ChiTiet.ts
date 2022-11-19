//Chi tiet template maker
interface imgAtribute{
  src:string,
  alt:string
}
const makeImgSrcArray = ()=>{
  const arr = Array<imgAtribute>(5);
  for (let index = 0; index < arr.length; index++) {
    const data:imgAtribute = {
      src: `image/image${index}.png`,
      alt: `car img no image${index}`
    }
    arr[index] = data;
  }
  return arr;
}

class ChiTietElement extends HTMLElement {

  displayChiTiet:boolean;
  detailTabs: NodeListOf<HTMLElement>;
  currentDisplayedDetailTab:number;

  constructor() {
    super();
    this.displayChiTiet = false;
    this.attachShadow({ mode: "open" });
    
    let template = <HTMLTemplateElement>document.getElementById("chi-tiet-template");

    const styleLinkElem = document.createElement("link");
    styleLinkElem.setAttribute("rel", "stylesheet");
    styleLinkElem.setAttribute("href", "/css/ChiTiet.css");


    let templateContent = template.content;
    this.shadowRoot?.appendChild(styleLinkElem);
    this.shadowRoot?.appendChild(templateContent.cloneNode(true));
    
    this.detailTabs = <NodeListOf<HTMLElement>> this.shadowRoot?.querySelectorAll(".vexere_chitiet_tab_item");
    this.currentDisplayedDetailTab = 0;
    

    this.addDetailImage();
    this.addOpenDatailClickHandle();
    this.addDetailTabClickHandle();
  }

  addDetailImage(){
    const imgDisplayWrapper = this.shadowRoot?.querySelector(".vexere_hinhxe_slider_display");
    const imgDatas = makeImgSrcArray();

    imgDatas.forEach((item)=>{
      const imgDivWrap = document.createElement("div");
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;

      imgDivWrap.className = "vexere_hinhxe_slider_display_img";
      imgDivWrap.appendChild(image);

      imgDisplayWrapper?.appendChild(imgDivWrap);
    })

  }

  addOpenDatailClickHandle(){
    const chiTietAction =  this.shadowRoot?.querySelector(".vexere_thongtin_action > h4");
    const chiTiet = <HTMLElement> this.shadowRoot?.querySelector(".vexere_bang_chi_tiet") ;
    chiTiet.style.display = "none";

    chiTietAction?.addEventListener('click',()=>{
      this.displayChiTiet = !this.displayChiTiet;
      const chiTietElement = <HTMLElement> this.shadowRoot?.querySelector(".vexere_bang_chi_tiet") ;
      chiTietElement.style.display = (this.displayChiTiet) ? "" : "none";
    });
  }

  addDetailTabClickHandle(){
    this.detailTabs.forEach((ele,index)=>{
      if(index != 0){
        ele.style.display = "none";
      }
    });

    const buttons = this.shadowRoot?.querySelectorAll(".vexere_chitiet_tab > button") ;
    if(buttons){
      buttons.forEach((btn)=>{
        btn.addEventListener("click",(event)=>{
          const btnClickValue = Number.parseInt((<HTMLButtonElement>event.target).value);
          if(!isNaN(btnClickValue) && btnClickValue < this.detailTabs.length){
            this.detailTabs.forEach((ele,index)=>{
              ele.style.display = "none";
            });
            this.detailTabs[btnClickValue].style.display = "";
          }
        });
      })
    }
  }

}

customElements.define("chi-tiet-element",ChiTietElement);

const body = document.body;
Array<number>(5).fill(0).forEach(()=>{
  const chiTietElement = document.createElement("chi-tiet-element");
  body.appendChild(chiTietElement);
});
