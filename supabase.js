/* =====================================================================
   하츠(Heartz) 팬페이지 — Supabase 설정 & 공용 함수
   ⬇⬇ 배포할 때 아래 2줄만 본인 프로젝트 값으로 바꾸면 됩니다 ⬇⬇
   (Supabase → Settings → API 에서 복사)
===================================================================== */
const SUPABASE_URL  = 'https://icrrimwxdjxtdhuyxngw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcnJpbXd4ZGp4dGRodXl4bmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzAyNjksImV4cCI6MjA5NzI0NjI2OX0.UTonh2rXKvWddyWv-ekTSt_ATy8z02neXfiXmy4L2Gg';   // anon public 키 (사이트에 넣어도 안전)

/* ---- Supabase 클라이언트 (설정 전이면 자동으로 기본값만 사용) ---- */
let db = null;
try {
  if (window.supabase && SUPABASE_URL.indexOf('{{') === -1) {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
} catch (e) { db = null; }

/* ---- 기본값(=DB 비었거나 미설정일 때 보여줄 예시. 관리자에서 저장하면 덮어씀) ---- */
const PROFILE_DEFAULTS = {
  name:'하츠', reading:'Heartz',
  concept:'별 · 하트 · 픽셀을 좋아하는 종합게임 ✦',
  debut:'2025.12.13', birthday:'06.14',
  fan_name:'별뭉이', content:'종합게임',
  motif:'별 · 하트 · 픽셀', signature:'별 3개 머리핀',
  agency:'개인세', personality:'편안 · 시크', song:'가끔 함',
  soop:'https://www.sooplive.com/station/ophillia',
  youtube:'https://www.youtube.com/@%ED%95%98%EC%B8%A0_HEARTZ',
  cafe:'https://cafe.naver.com/heartz1213',
  fancim:'https://fancim.me/celeb/profile.aspx?url=632616',
  fancimm:'https://fancimm.com/profile/547423',
  email:'heartzstar87@gmail.com',
  vod_url:'https://www.sooplive.com/station/ophillia/vod',
  soop_id:'ophillia', avatar:'',
  days:[0,1,2,3,5,6],
  sched_note:'월·화·수·금 저녁 8시 · 토·일 낮 1시 · 목요일 휴방'
};
// 일정(달력) — color: blue/cyan/mint/pink/lavender/amber/coral/gray
const SCHEDULE_DEFAULTS = [
  { date:'2026-06-17', time:'오전 8시 3분', title:'종합게임 ✦', type:'방송', color:'blue',  highlight:true },
  { date:'2026-06-18', time:'저녁 8시',     title:'마인크래프트', type:'방송', color:'cyan' },
  { date:'2026-06-19', time:'',            title:'휴방',        type:'휴방', color:'gray' },
  { date:'2026-06-20', time:'낮 1시',       title:'주말 종겜',    type:'방송', color:'mint' },
  { date:'2026-06-22', time:'저녁 8시',     title:'신규 게임 첫방', type:'방송', color:'coral', highlight:true },
];
const VODS_DEFAULTS = [
  { title:'브루저 잘하는 버추얼 어때?',   vdate:'2026-06-13', dur:'7:37:35', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
  { title:'꽁갈 CK + 소통',              vdate:'2026-06-12', dur:'8:33:39', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
  { title:'사랑 왕창 많이 받은 날 🤍',     vdate:'2026-06-11', dur:'8:37:11', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
  { title:'역시 주말 낮엔 하츠랑 놀아야지', vdate:'2026-06-09', dur:'6:09:14', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
];
// 업보 — 시청자 / 항목 / 카운트
const VIEWERS_DEFAULTS = [
  { id:1, nickname:'별뭉이',  soop_id:'', sort_order:1 },
  { id:2, nickname:'하츠사랑', soop_id:'', sort_order:2 },
  { id:3, nickname:'픽셀러',  soop_id:'', sort_order:3 },
];
const UPBO_TYPES_DEFAULTS = [
  { id:1, name:'노래 신청',       category:'일반',   sort_order:1 },
  { id:2, name:'게임 추천',       category:'일반',   sort_order:2 },
  { id:3, name:'생일 축하 이벤트', category:'이벤트', sort_order:3 },
];
const UPBO_COUNTS_DEFAULTS = [
  { viewer_id:1, type_id:1, count:3, updated_at:'2026-06-16' },
  { viewer_id:1, type_id:2, count:1, updated_at:'2026-06-16' },
  { viewer_id:2, type_id:3, count:2, updated_at:'2026-06-15' },
  { viewer_id:3, type_id:1, count:1, updated_at:'2026-06-14' },
];
const INQUIRIES_DEFAULTS = [
  { id:1, nickname:'별뭉이팬', message:'방송 항상 잘 보고 있어요! 노래 방송 또 해주세요 🤍', page:'프로필', created_at:'2026-06-16 21:30' },
  { id:2, nickname:'궁금이',   message:'합방 일정은 따로 공지되나요?',                     page:'프로필', created_at:'2026-06-15 18:02' },
  { id:3, nickname:'정정요청', message:'제 업보 카운트가 하나 빠진 것 같아요!',           page:'업보',   created_at:'2026-06-14 12:10' },
];

/* ---- 공용 함수 ---- */
async function getProfile(){
  if(!db) return { ...PROFILE_DEFAULTS };
  try{
    const { data } = await db.from('profile').select('data').eq('id',1);
    if(data && data[0] && data[0].data && Object.keys(data[0].data).length)
      return { ...PROFILE_DEFAULTS, ...data[0].data };
  }catch(e){ console.log('profile load', e); }
  return { ...PROFILE_DEFAULTS };
}
async function saveProfile(obj){
  if(!db) return false;
  try{ const { error } = await db.from('profile').upsert({ id:1, data:obj }); return !error; }
  catch(e){ console.log('profile save', e); return false; }
}
async function fetchAll(table, order, asc){
  if(!db) return null;
  try{
    let q = db.from(table).select('*');
    if(order) q = q.order(order, { ascending: asc !== false });
    const { data } = await q;
    return data || [];
  }catch(e){ console.log('fetch '+table, e); return null; }
}
async function insertRow(table, obj){
  if(!db) return false;
  try{ const { error } = await db.from(table).insert(obj); return !error; }
  catch(e){ console.log('insert '+table, e); return false; }
}
async function updateRow(table, id, obj){
  if(!db) return false;
  try{ const { error } = await db.from(table).update(obj).eq('id', id); return !error; }
  catch(e){ console.log('update '+table, e); return false; }
}
async function deleteRow(table, id){
  if(!db) return false;
  try{ const { error } = await db.from(table).delete().eq('id', id); return !error; }
  catch(e){ console.log('delete '+table, e); return false; }
}
/* 업보 카운트: 한 시청자의 카운트를 통째로 저장(기존 삭제 후 0보다 큰 것만 입력) */
async function setViewerCounts(viewerId, rows){
  if(!db) return false;
  try{
    await db.from('upbo_counts').delete().eq('viewer_id', viewerId);
    const today = new Date().toISOString().slice(0,10);
    const ins = rows.filter(function(r){ return r.count > 0; })
                    .map(function(r){ return { viewer_id:viewerId, type_id:r.type_id, count:r.count, updated_at:today }; });
    if(ins.length){ const { error } = await db.from('upbo_counts').insert(ins); return !error; }
    return true;
  }catch(e){ console.log('setViewerCounts', e); return false; }
}

/* SOOP 아이디 → 프사 주소 */
function soopAvatar(id){
  if(!id) return null; id = String(id).trim().toLowerCase();
  if(id.length < 2) return null;
  return 'https://profile.img.sooplive.co.kr/LOGO/'+id.slice(0,2)+'/'+id+'/'+id+'.jpg';
}

/* 다크모드 토글 */
function initTheme(){
  var KEY='heartz-theme';
  try{ if(localStorage.getItem(KEY)==='dark') document.body.classList.add('dark'); }catch(e){}
  var sw=document.getElementById('themeSwitch'); if(!sw) return;
  function refresh(){ sw.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙'; }
  sw.addEventListener('click', function(){
    document.body.classList.toggle('dark');
    try{ localStorage.setItem(KEY, document.body.classList.contains('dark') ? 'dark':'light'); }catch(e){}
    refresh();
  });
  refresh();
}

/* SOOP 등 iframe 삽입 시 높이 자동 전송 */
function initIframeResize(){
  if(window.parent === window) return;
  function send(){ try{ parent.postMessage({ frameHeight: document.body.scrollHeight }, '*'); }catch(e){} }
  window.addEventListener('load', send); window.addEventListener('resize', send);
  setTimeout(send, 600); setTimeout(send, 1500);
}

/* 날짜 'YYYY-MM-DD' → 'MM/DD (요일)' */
function fmtBadge(s){
  if(!s) return '';
  var d = new Date(s + 'T00:00:00'); if(isNaN(d)) return s;
  var w = ['일','월','화','수','목','금','토'][d.getDay()];
  return String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+' ('+w+')';
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
