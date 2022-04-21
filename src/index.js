import '../lib/xmlToJSON.js'
import {u} from '../u.js'

const get = (target) => {
  return document.querySelector(target);
};

const ul = u
const pageNo = 1
const numOfRows = 10
const type = 'json'
const cityCode = '37050'

// popup content information
const $info2 = get(".popup");
const createInfoElement2 = (items, routeno) => {
  let arr = []
  items.forEach(e => { 
      arr.push(e.nodenm)
    });
    const $popupList = document.createElement("div");
    const $contnets = document.createElement("div");
    $popupList.classList.add("content_area");
    $contnets.classList.add("contents");
    $popupList.innerHTML = `
      <li class = 'BusNum'>${routeno}</li>
    `;
    for(let i=0; i< arr.length; i++){
      let $InnerNodeId = document.createElement("div");
      $InnerNodeId.classList.add("nodeid")
      let data = arr[i]
      $InnerNodeId.innerHTML =`${data}
      `
      $contnets.appendChild($InnerNodeId)
      $popupList.appendChild($contnets)
    }
    return $popupList;
}

const renderAllinfoPopup = (items, routeno) => {
  $info2.innerHTML += "";
      const InfoElement2 = createInfoElement2(items,routeno);
      $info2.appendChild(InfoElement2); 
  };

const fetchDataPopup = (url,routeno) => {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(info => {
    const json = JSON.parse(info.contents)
    const items = json.response.body.items.item
    renderAllinfoPopup(items, routeno)
  })
  .then((error) => console.log(error));
};

//arrive information
const $info = get(".bus-info");
const $title = get('h2')
const createInfoElement = (idx, items) => {
  const arrprevstationcnt = items[idx]['arrprevstationcnt']
  const arrtime = items[idx]['arrtime']
  const nodenm = items[idx]['nodenm']
  const routeno = String(items[idx]['routeno'])
  const routeid = String(items[idx]['routeid'])
  const $busInfo = document.createElement("div");

  $busInfo.classList.add("bus-item");
  $busInfo.innerHTML = `
    <div class = 'bus-number'>${routeno}번</div>
    <li class = 'destination'>${nodenm}</li>
    <li>남은정류장 수 : ${arrprevstationcnt} 개</li>
    <li>도착예정시간 : ${Math.ceil(arrtime/60)} 분</li> 
  `;

  const $dimmed_layer = get('.dimmed-layer')
  const $nodeBtn = get('.nodeBtn')
  const $popup  = get('.popup')
  
  $nodeBtn.addEventListener("click",()=>{
    routeno
    $dimmed_layer.classList.add("display")
    $popup.classList.add("show")
    $dimmed_layer.addEventListener("click",()=>{
      $dimmed_layer.classList.remove("display")
      $popup.classList.remove("show")
      $info2.innerHTML =''
    })

    let routeId = routeid
    const API_URL2 = 
    'http://apis.data.go.kr/1613000/BusRouteInfoInqireService/getRouteAcctoThrghSttnList?serviceKey='+ul+'&pageNo='+pageNo+'&numOfRows='+60+'&_type='+type+'&cityCode='+cityCode+'&routeId='+routeId
    fetchDataPopup(API_URL2, routeno)
  })
  return $busInfo;
}

// item lenght only one case
const createInfoElement_oneItem = (items) => {
  const arrprevstationcnt = items['arrprevstationcnt']
  const arrtime = items['arrtime']
  const nodenm = items['nodenm']
  const routeno = String(items['routeno'])
  const routeid = String(items['routeid'])
  const $busInfo = document.createElement("div");

  $busInfo.classList.add("bus-item");
  $busInfo.innerHTML = `
    <div class = 'bus-number'>${routeno}번</div>
    <li class = 'destination'>${nodenm}</li>
    <li>남은정류장 수 : ${arrprevstationcnt} 개</li>
    <li>도착예정시간 : ${Math.ceil(arrtime/60)} 분</li> 
  `;

  const $dimmed_layer = get('.dimmed-layer')
  const $nodeBtn = get('.nodeBtn')
  const $popup  = get('.popup')
  
  $nodeBtn.addEventListener("click",()=>{
    routeno
    $dimmed_layer.classList.add("display")
    $popup.classList.add("show")
    $dimmed_layer.addEventListener("click",()=>{
      $dimmed_layer.classList.remove("display")
      $popup.classList.remove("show")
      $info2.innerHTML =''
    })

    let routeId = routeid
    const API_URL2 = 
    'http://apis.data.go.kr/1613000/BusRouteInfoInqireService/getRouteAcctoThrghSttnList?serviceKey='+ul+'&pageNo='+pageNo+'&numOfRows='+60+'&_type='+type+'&cityCode='+cityCode+'&routeId='+routeId
    fetchDataPopup(API_URL2, routeno)
  })
  return $busInfo;
}

const renderAllinfo = (items, start, end) => {
  $info.innerHTML += "";
  $title.innerHTML = `
  ${start} <img src="../img/right-arrow.png" alt="arrow"> ${end}
  `

  if (items.length === undefined){
    const InfoElement = createInfoElement_oneItem(items);
    $info.appendChild(InfoElement);
  }

  // sort arrtime
  for (let i = 0; i < items.length; i++){
    let idx = i;
    let $sortItems = items.sort(function(a,b){
      return a['arrtime'] - b['arrtime']
    })
    const InfoElement = createInfoElement(idx, $sortItems);
    $info.appendChild(InfoElement); 
  }
};

const renderAllinfo130 = (items, start, end) => {
  let  routeList = [] 
  let  nodeList = [] 

  for (let i = 0; i < items.length; i++){
    routeList.push(String(items[i]['routeid']))
    nodeList.push(String(items[i]['nodeid']))
  }
    
    for (let i = 0; i < routeList.length; i++){
      const routeId = routeList[i] 
      const API_URL_now = 
      'http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoBusLcList?serviceKey='+ul+'&cityCode='+cityCode+'&routeId='+routeId+'&numOfRows='+numOfRows+'&pageNo='+pageNo+'&_type='+type
      getDataNow(API_URL_now, start, end, routeId)
    }
}

const getDataNow = (url, start, end, routeId)=>{
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(info => {
    const json = JSON.parse(info.contents)
    const items = json.response.body.items.item

    if (items === undefined){
      renderAllinfo_none(start, end)
    }
    let nodenm = items['nodenm']
    let routenm = items['routenm']
    let routeid = routeId

    renderAllinfo_pos(items, start, end, nodenm, routenm, routeid)
  })
  .then((error) => console.log(error));
}

const renderAllinfo_pos = (items, start, end, nodenm, routenm, routeid) =>{
  $info.innerHTML += "";
  $title.innerHTML = `
  ${start} <img src="../img/right-arrow.png" alt="arrow"> ${end}
  `

  if (items === undefined){
    const InfoElement = createInfoElement_oneItem(items);
    $info.appendChild(InfoElement);
  }
  const InfoElement = createInfoElement_pos(nodenm, routenm, routeid);
  $info.appendChild(InfoElement); 
}

const createInfoElement_pos = (nodenm, routenm, routeid) =>{

  const Routenm = nodenm
  const busNum = routenm
  const $busInfo = document.createElement("div");

  if (routenm === undefined || routeid === undefined){
    //pass
  } else{
    $busInfo.classList.add("bus-item");
    $busInfo.innerHTML = `
      <div class = 'bus-number'>${busNum}번</div>
      <div class = 'current_position'>
      <li class = 'current_pos'>현재버스위치</li>
      <li>${Routenm}</li>    
      </div>
  
    `;
  
    const $dimmed_layer = get('.dimmed-layer')
    const $nodeBtn = get('.nodeBtn')
    const $popup  = get('.popup')
    
    $nodeBtn.addEventListener("click",()=>{
      // routeno
      $dimmed_layer.classList.add("display")
      $popup.classList.add("show")
      $dimmed_layer.addEventListener("click",()=>{
        $dimmed_layer.classList.remove("display")
        $popup.classList.remove("show")
        $info2.innerHTML =''
      })
  
      let routeId = routeid
      const API_URL2 = 
      'http://apis.data.go.kr/1613000/BusRouteInfoInqireService/getRouteAcctoThrghSttnList?serviceKey='+ul+'&pageNo='+pageNo+'&numOfRows='+60+'&_type='+type+'&cityCode='+cityCode+'&routeId='+routeId
      fetchDataPopup(API_URL2, busNum)
    })
    return $busInfo;
  }
}

// none item arrive case 
const createInfoElement_none = () => {
  const $busInfo = document.createElement("div");

  $busInfo.classList.add("bus-item");
  $busInfo.innerHTML = `
    <p class = 'noneDisplay'>도착정보없음</p>
  `;
  return $busInfo;
}

const renderAllinfo_none = (start, end) => {
  $info.innerHTML = "";
  $title.innerHTML = `
  ${start} <img src="../img/right-arrow.png" alt="arrow"> ${end}
`
  const InfoElement = createInfoElement_none();
  $info.appendChild(InfoElement); 
};

// 오성예식장 > 공대 filtering
const fetchData92 = (url, start, end) => {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(info => {
    const json = JSON.parse(info.contents)
    const items = json.response.body.items.item
    if (items === undefined){
      renderAllinfo_none(start, end)
    }
    
    for (let i = 0; i < items.length; i++){
      let item = []
      let routeNum = String(items[i]['routeno'])
      if (routeNum === '193-2' || routeNum === '190' || routeNum === '191' || 
      routeNum === '192' || routeNum ===  '193' || routeNum === '195' || 
      routeNum === '196' || routeNum === '57' || routeNum === '5200'){
        item.push(items[i])
        renderAllinfo(item, start, end)
      } else {
//         renderAllinfo_none(start, end)
        console.log('Err! 도착정보없음')
      }
    }
  })
  .then((error) => console.log(error));
};

// 구미종합터미널 > 공대 flitering
const fetchData91 = (url, start, end) => {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(info => {
    const json = JSON.parse(info.contents)
    const items = json.response.body.items.item
    if (items === undefined){
      renderAllinfo_none(start, end)
    }

    for (let i = 0; i < items.length; i++){
      let item = []
      let routeNum = String(items[i]['routeno'])
      if (routeNum === '900'){
        item.push(items[i])
        renderAllinfo(item, start, end)
      } else {
//         renderAllinfo_none(start, end)
        console.log('Err! 도착정보없음')
      }
    }
  })
  .then((error) => console.log(error));
};

// 옥계 > 공대 flitering
const fetchData130 = (url, start, end) => {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(info => {
    const json = JSON.parse(info.contents)
    const items = json.response.body.items.item
    if (items === undefined){
      renderAllinfo_none(start, end)
    }
    renderAllinfo130(items, start, end)
  })
  .then((error) => console.log(error));
};

const fetchData = (url, start, end) => {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(info => {
    const json = JSON.parse(info.contents)
    const items = json.response.body.items.item
    if (items === undefined){
      renderAllinfo_none(start, end)
    }
    renderAllinfo(items, start, end)
  })
  .then((error) => console.log(error));
};

const init = (start, end, nodeid) => {
  window.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < nodeid.length; i++){
      const nodeId = nodeid[i] 
      const API_URL = 
      'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?serviceKey='+ul+'&cityCode='+cityCode+'&nodeId='+nodeId+'&numOfRows='+numOfRows+'&pageNo='+pageNo+'&_type='+type
      if(nodeId ==='GMB92'){   //오성예식장 > 공대
        fetchData92(API_URL, start, end);
      }else if (nodeId ==='GMB91'){   //구미종합버스터미널 앞 > 공대
        fetchData91(API_URL, start, end);    
      }else if (nodeId ==='GMB130'){  // 옥계, 터미널 등 외부 > 학교
        fetchData130(API_URL, start, end)
      }else{  // 공대 > 옥계, 터미널 등
        fetchData(API_URL, start, end);   
      }
    }
  });
};

export {init}
