import{i as r,a as y,S as g}from"./vendor-D0cagnvz.js";const h="46136265-8c05b511bcb8d1129c580e4d3",u=document.getElementById("searchForm"),n=document.getElementById("gallery"),i=document.querySelector(".loader"),a=document.querySelector(".loadBtn");let c,d="",o=1;const f=40;async function p(t,s){const e=`https://pixabay.com/api/?key=${h}&q=${encodeURIComponent(t)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${f}&page=${s}`;try{return(await y.get(e)).data}catch{return r.error({title:"Error",message:"Something went wrong while fetching images. Please try again later."}),{hits:[],totalHits:0}}}function m(t){if(t.length===0&&o===1){r.error({title:"No Results",position:"topRight",message:"Sorry, there are no images matching your search query. Please try again!"});return}const s=t.map(e=>`
    <a href="${e.largeImageURL}" class="image-item">
      <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy">
      <div class="info">
        <div class="info-item"><p>Likes</p><p>${e.likes}</p></div>
        <div class="info-item"><p>Views</p><p>${e.views}</p></div>
        <div class="info-item"><p>Comments</p><p>${e.comments}</p></div>
        <div class="info-item"><p>Downloads</p><p>${e.downloads}</p></div>
      </div>
    </a>
  `).join("");n.insertAdjacentHTML("beforeend",s),c?c.refresh():c=new g(".image-item",{})}u.addEventListener("submit",async t=>{t.preventDefault();const s=document.getElementById("searchQuery").value.trim();if(!s){r.warning({title:"Warning",position:"topRight",message:"Please enter a search term."});return}d=s,o=1,i.style.display="block",a.style.display="none",n.innerHTML="";const{hits:e,totalHits:l}=await p(d,o);i.style.display="none",m(e),e.length>0&&n.children.length<l&&(a.style.display="block")});a.addEventListener("click",async()=>{o+=1,i.style.display="block";const{hits:t,totalHits:s}=await p(d,o);i.style.display="none",m(t),n.children.length>=s&&(a.style.display="none",r.info({title:"End of Results",message:"We're sorry, but you've reached the end of search results."})),v()});function v(){const{height:t}=n.firstElementChild.getBoundingClientRect();window.scrollBy({top:t*2,behavior:"smooth"})}
//# sourceMappingURL=search-Dhf3hluH.js.map
