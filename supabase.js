/* =====================================================================
   하츠(Heartz) 팬페이지 — Supabase 설정 & 공용 함수
   ⬇⬇ 배포할 때 아래 2줄만 본인 프로젝트 값으로 바꾸면 됩니다 ⬇⬇
   (Supabase → Settings → API 에서 복사)
===================================================================== */
const SUPABASE_URL  = 'https://{{SUPABASE프로젝트ID}}.supabase.co';
const SUPABASE_ANON = '{{SUPABASE_ANON_KEY}}';   // anon public 키 (사이트에 넣어도 안전)

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
  vod_url:'https://www.sooplive.com/station/ophillia/vod',
  soop_id:'ophillia', avatar:'',
  days:[0,1,2,3,5,6],                 // 켜진 방송 요일 (0=일 … 6=토, 목 휴방)
  sched_note:'월·화·수·금 저녁 8시 · 토·일 낮 1시 · 목요일 휴방'
};
const EVENTS_DEFAULTS = [
  { edate:'2026-06-17', title:'오늘 저녁 8시 종합게임 ✦', type:'방송' },
  { edate:'2026-06-20', title:'낮 1시 마인크래프트',       type:'방송' },
  { edate:'2026-06-22', title:'신규 게임 첫방',            type:'특별' },
];
const VODS_DEFAULTS = [
  { title:'브루저 잘하는 버추얼 어때?',   vdate:'2026-06-13', dur:'7:37:35', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
  { title:'꽁갈 CK + 소통',              vdate:'2026-06-12', dur:'8:33:39', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
  { title:'사랑 왕창 많이 받은 날 🤍',     vdate:'2026-06-11', dur:'8:37:11', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
  { title:'역시 주말 낮엔 하츠랑 놀아야지', vdate:'2026-06-09', dur:'6:09:14', thumb:'', link:'https://www.sooplive.com/station/ophillia/vod' },
];
const WORK_DEFAULTS = [
  { title:'롤 다이아 찍으면 노래방송 1시간', status:'진행중', note:'별뭉이들이랑 약속함!' },
  { title:'마크 집 완성하면 집들이 방송',     status:'진행중', note:'' },
  { title:'팔로워 1000명 기념 종겜데이',     status:'완료',   note:'고마워요 🤍' },
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
  try{
    const { error } = await db.from('profile').upsert({ id:1, data:obj });
    return !error;
  }catch(e){ console.log('profile save', e); return false; }
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

/* SOOP 아이디 → 프사 주소 */
function soopAvatar(id){
  if(!id) return null; id = String(id).trim().toLowerCase();
  if(id.length < 2) return null;
  return 'https://profile.img.sooplive.co.kr/LOGO/'+id.slice(0,2)+'/'+id+'/'+id+'.jpg';
}

/* 다크모드 토글 (배포 시 기억됨 / 미리보기에선 자동 무시) */
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

/* SOOP 등 iframe 삽입 시 높이 자동 전송(여백/잘림 방지) */
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
  var mm = String(d.getMonth()+1).padStart(2,'0');
  var dd = String(d.getDate()).padStart(2,'0');
  return mm+'/'+dd+' ('+w+')';
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
