(()=>{var T="openchamber.sdk",S=1;var ot=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [data-oc-scrolling] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [data-oc-scrolling] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [data-oc-scrolling]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [data-oc-scrolling] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function so(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let n=new WeakMap;e.addEventListener("scroll",(a)=>{let i=a.target===e?r:a.target;if(!(i instanceof Element))return;if(!i.hasAttribute("data-oc-scrolling"))i.setAttribute("data-oc-scrolling","");let E=n.get(i);if(E!==void 0)clearTimeout(E);n.set(i,setTimeout(()=>{n.delete(i),i.removeAttribute("data-oc-scrolling")},1000))},{capture:!0,passive:!0})}var pr=`(${so.toString()})(document);`;var rt=128,nt=65536;var Ce=128;var Ue=65536;var st=8000,it=192000,at=120000;var io=(e)=>{let r=[],n=0,a=0;return{push:(i)=>{r.push(i),a+=i.length;while(a-n>e&&r.length>1){let E=r.shift();a-=E?.length??0,n=0}},pull:(i)=>{let E=0;while(E<i.length&&r.length>0){let A=r[0],k=Math.min(i.length-E,A.length-n);if(i.set(A.subarray(n,n+k),E),E+=k,n+=k,n>=A.length)r.shift(),a-=A.length,n=0}i.fill(0,E)},clear:()=>{r.length=0,n=0,a=0},get size(){return a-n}}};var po=/^[a-z][a-z0-9-]{0,39}$/;var ao=(e)=>Object(e)===e&&!Array.isArray(e),ct=(e,r)=>Object.keys(e).every((n)=>r.includes(n)),co=(e)=>String(e)===e&&e.length>=1&&e.length<=60,lo=(e)=>String(e)===e&&e.length>=1&&e.length<=80,uo=(e)=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let n of e){if(!ao(n)||!po.test(n.id)||!co(n.label))return!1;if(n.disabled!==void 0&&n.disabled!==!0&&n.disabled!==!1)return!1;if(r.has(n.id))return!1;if(r.add(n.id),n.kind==="button"){if(!ct(n,["kind","id","label","disabled"]))return!1;continue}if(n.kind!=="select"||!ct(n,["kind","id","label","value","options","disabled"]))return!1;if(!lo(n.value)||!Array.isArray(n.options)||n.options.length<1||n.options.length>16)return!1;let a=new Set;for(let i of n.options){if(!ao(i)||!ct(i,["value","label"])||!lo(i.value)||!co(i.label)||a.has(i.value))return!1;a.add(i.value)}if(!a.has(n.value))return!1}return!0};var _o=["{id}","{segment}","{segments+}"];var jr=new Set(_o);var Eo=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Yr=new Set(Eo);var Me=20000000,Ne=256;var dt=(e)=>("bytes"in e)?e.bytes.byteLength:e.content.length,To=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let n=0;n<e.bytes.byteLength;n+=1)if(e.bytes[n]!==r.bytes[n])return!1;return!0};var So=/^[A-Za-z0-9_-]{1,80}$/;var fo=["left","right","top","bottom"];var mo=(e,r=0,n={remaining:16000})=>{if(--n.remaining<0||r>=32)return!1;if(e===null)return!0;let a=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let i of a)if(!mo(i,r+1,n))return!1;return!0},lt=(e)=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every((r)=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(lt);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(lt)}return String(e)===e||Number.isFinite(e)},pt=(e)=>{try{if(String(e.id)!==e.id||!So.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!fo.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!mo(e.data)||!lt(e.data))return!1;return JSON.stringify(e.data).length<=16000}catch{return!1}};var ho=/^[0-9a-f]{7,64}$/i,Ao=(e)=>ho.test(e),ut=255,Oo=(e,r,n)=>({openCommit:(a)=>Ao(a)?e({channel:T,v:S,type:"open-commit",id:r(),payload:{sha:a}}):n("Commit id must be 7 to 64 hex characters."),openWalkthrough:({base:a})=>{let i=a.trim();if(!i||i.length>ut)return n(`Base must contain 1 to ${ut} characters.`);return e({channel:T,v:S,type:"open-walkthrough",id:r(),payload:{base:i}})}});var Et=2000;var xo=["file","directory","other","missing"],Tt=(e)=>Boolean(e&&"sessionId"in e),St=(e)=>Boolean(e&&"sent"in e&&!("sessionId"in e));var we=500,Le=32000,Ro=16000,bo=128,Io=200,ko=2000,yo=16000,vo=80,Co=200,Uo=16000;var Mo=2000;var ft=20000,Pe=1024,Ge=2000000;var De=64000,He=8000,mt=4000;var ht=960000;var No=999,wo=1e4,fe=500,Lo=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Po=["stopped","starting","ready","failed"],_r=new Set(Lo),Go=(e)=>_r.has(e),Do=(e)=>e&&Go(e)?e:"HOST_REJECTED",se=(e)=>{if(e===void 0)return!1;if(e===null||e===!0||e===!1)return!0;if(String(e)===e)return!0;if(Number(e)===e)return Number.isFinite(e);if(Array.isArray(e))return e.every(se);if(Object(e)===e)return Object.values(e).every(se);return!1},Ho=(e)=>se(e)&&JSON.stringify(e).length<=Uo,go=(e)=>e?.trim().slice(0,Co)??"",ie=(e)=>{let r=e.id.trim().slice(0,bo),n=e.title.trim().slice(0,Io),a=e.url.trim().slice(0,ko),i=e.text?.trim().slice(0,yo),E=e.author?.trim().slice(0,vo),A=e.kind==="pull"?"pull":"issue",k={providerId:e.providerId.trim(),id:r,title:n||r,url:a,kind:A};if(i)k.text=i;if(E)k.author=E;if(A==="pull"){let H=go(e.branches?.head),B=go(e.branches?.base);if(H&&B)k.branches={head:H,base:B}}if(Ho(e.data))k.data=e.data;return k},At=(e)=>{let r=ie(e);if(e.projectId)r.projectId=e.projectId;if(e.navigation)r.navigation=e.navigation;if(e.worktree)r.worktree=e.worktree;return r},Ot=(e)=>{let r={text:e.text.trim().slice(0,Ro)};if(e.send)r.send=!0;return r},gt=(e)=>{if(e===null||!Number.isFinite(e))return null;return Math.min(No,Math.max(0,Math.round(e)))},xt=(e)=>{if(!Number.isFinite(e))return 0;return Math.min(wo,Math.max(0,Math.ceil(e)))};var ae=(e)=>e.length>0&&e.length<=Pe&&!e.includes("\x00")&&!e.includes("\\");var Xe=(e)=>{if(!e.startsWith("/")||e.includes("\x00")||e.includes("\\")||e.includes("://"))return!1;if(e.length>Mo)return!1;return!e.split("/").some((n)=>n==="."||n==="..")},Er=new Set(Po),Rt=(e)=>Boolean(e&&"status"in e&&Er.has(String(e.status))&&!("body"in e)),Ve=(e)=>Boolean(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),bt=(e)=>Boolean(e&&"content"in e&&String(e.content)===e.content),It=(e)=>Boolean(e&&"written"in e&&e.written===!0),kt=(e)=>Boolean(e&&"entries"in e&&Array.isArray(e.entries)),Tr=new Set(xo),yt=(e)=>Boolean(e&&"kind"in e&&"size"in e&&Tr.has(String(e.kind))&&Number.isFinite(e.size)),vt=(e)=>Boolean(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),Sr=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late","microphone-audio","microphone-ended"]),fr=(e)=>Object(e)===e?e:null,_t=(e)=>String(e)===e&&e.length>0,mr=(e)=>{if(!_t(e.id))return null;if(e.ok===!0){let r={channel:T,v:S,type:"result",id:e.id,ok:!0};if(Object(e.payload)===e.payload)r.payload=e.payload;return r}if(e.ok===!1&&_t(e.error))return{channel:T,v:S,type:"result",id:e.id,ok:!1,error:e.error,code:Do(_t(e.code)?e.code:void 0)};return null},Ct=(e)=>{let r=fr(e);if(!r||r.channel!==T||r.v!==S)return null;if(r.type==="result")return mr(r);if(!Sr.has(String(r.type))||Object(r.payload)!==r.payload)return null;return r};var Xo=(e)=>("key"in e)&&("metaKey"in e)&&("ctrlKey"in e),hr=(e)=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s";class l extends Error{code;constructor(e,r){super(r);this.name="HostRequestError",this.code=e}}var Vo=()=>Promise.reject(new l("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),$e=()=>Promise.reject(new l("BAD_PATH",`File path must be 1 to ${Pe} characters without NUL or backslash.`)),Fe=(e)=>{if(e===void 0)return;if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new l("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0},_=(e)=>(e.value+=1,`oc-${e.value}`),Ut=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new l("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let n=e.acceptSource??((t)=>t===r.parent),a=e.requestTimeoutMs??ft,i=new Set,E=new Set,A=new Set,k=new Set,H=new Set,B=new Set,le=new Set,Oe=new Set,ge=new Set,xe=new Set,Re=new Set,ee=new Set,Ye=[],pe=null,ue=null,be=new Set,Ie=new Set,_e=null,Ee=null,Qe=!1,te=new Map,oe=new Map,re=new Map,V=!1,u={value:0},p=null,K=null,Te=!1,Se=!1,zt=null,G=null,jt=(t)=>{if(!t)return null;return{sessionId:t.id,phase:t.busy?"started":"completed"}},N=(t)=>{r.parent.postMessage(t,"*")},Jt=()=>{if(V||r.parent===r||ee.size===0||p?.features?.lateGenerateResults!==!0)return;N({channel:T,v:S,type:"generate-late-listen"})},O=(t,o)=>{for(let d of t)try{d(o)}catch(c){console.error(c)}},Yt=(t)=>{if(!(t instanceof MessageEvent))return;if(!n(t.source))return;let o=Ct(t.data);if(!o)return;if(o.type==="workspace"){let c=oe.get(o.payload.subscriptionId);if(c)O([c],o.payload.snapshot);return}if(o.type==="shells"){let c=re.get(o.payload.subscriptionId);if(c)O([c],o.payload.snapshot);return}if(o.type==="microphone-audio"){G?.queue.push(o.payload.samples);return}if(o.type==="microphone-ended"){let c=G;if(!c)return;G=null,c.release(),O(c.endedListeners,o.payload.reason);return}if(o.type==="ready"){if(p=o.payload,K=jt(o.payload.session),O(i,o.payload),O(E,o.payload.directory),O(A,o.payload.session),K)O(k,K);if(O(H,o.payload.connection),O(B,o.payload.settings),O(le,o.payload.item),o.payload.block)O(Oe,o.payload.block);Jt();return}if(o.type==="service-event"){O(ge,o.payload);return}if(o.type==="generate-late"){if(ee.size===0)Ye.push(o.payload);else O(ee,o.payload);return}if(o.type==="directory"){if(p)p={...p,directory:o.payload.directory};O(E,o.payload.directory);return}if(o.type==="session"){if(p)p={...p,session:o.payload.session};if(!o.payload.session)K=null;else if(K?.sessionId!==o.payload.session.id)K=jt(o.payload.session);O(A,o.payload.session);return}if(o.type==="session-lifecycle"){K=o.payload,O(k,o.payload);return}if(o.type==="connection"){if(p)p={...p,connection:o.payload.connection};O(H,o.payload.connection);return}if(o.type==="settings"){if(p)p={...p,settings:o.payload.settings};O(B,o.payload.settings);return}if(o.type==="item"){if(p)p={...p,item:o.payload.item};O(le,o.payload.item);return}if(o.type==="status-control-event"){O(xe,o.payload);return}if(o.type==="popover-closed"){O(Re,o.payload);return}if(o.type==="action"){let c=(h)=>{if(!V)N({channel:T,v:S,type:"action-result",id:o.id,payload:h})},m=ue;if(!m){c({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>m(o.payload)).then(()=>c({ok:!0}),(h)=>{let g=(h instanceof Error?h.message:String(h)).trim();c({ok:!1,error:(g||"Action failed.").slice(0,fe)})});return}if(o.type==="file-open"){let c=o.payload;if(Ee&&To(Ee,c))return;Ee=c,O(be,o.payload);return}if(o.type==="file-saved"){O(Ie,o.payload.version);return}if(o.type==="file-snapshot"){let c=(g)=>{if(!V)N({channel:T,v:S,type:"file-snapshot-result",id:o.id,payload:g})},m=(g)=>c({error:(g.trim()||"Could not read the edited file.").slice(0,fe)}),h=_e;if(!h){m("This extension does not edit files.");return}Promise.resolve().then(()=>h(o.payload.purpose)).then((g)=>{if(dt(g)>Me){m(`The file is over ${Me} ${"bytes"in g?"bytes":"characters"}.`);return}if(g.version.length>Ne){m(`The snapshot version is over ${Ne} characters.`);return}c({snapshot:"bytes"in g?{bytes:g.bytes,version:g.version}:{content:g.content,version:g.version}})},(g)=>m(g instanceof Error?g.message:String(g)));return}if(o.type==="resolve"){let c=(h)=>{N({channel:T,v:S,type:"resolve-result",id:o.id,payload:h})},m=pe;if(!m){c({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>m(o.payload)).then((h)=>c({item:h?ie(h):null}),(h)=>{let g=(h instanceof Error?h.message:String(h)).trim();c({error:(g||"Command failed.").slice(0,fe)})});return}let d=te.get(o.id);if(!d)return;if(clearTimeout(d.timer),te.delete(o.id),o.ok){d.resolve(o.payload);return}d.reject(new l(o.code,o.error))};r.addEventListener("message",Yt),N({channel:T,v:S,type:"hello"});let C=(t,o=a)=>{if(V||r.parent===r)return Promise.reject(new l("HOST_UNAVAILABLE","No host frame. This page is not in an iframe."));return new Promise((d,c)=>{let m=setTimeout(()=>{te.delete(t.id),c(new l("HOST_TIMEOUT","Host did not answer in time."))},o);te.set(t.id,{resolve:d,reject:c,timer:m}),N(t)})},y=(t)=>C(t).then(()=>{return}),R={channel:T,v:S},Ze=(t)=>{if(!V&&r.parent!==r)N(t)},Qt=()=>Ze({...R,type:"file-save"}),qe=()=>{if(!V&&r.parent!==r)N({...R,type:"microphone-close",id:_(u)})},dr=async()=>{if(G)throw new l("HOST_REJECTED","The microphone is already open in this frame.");if(p?.features?.microphone!==!0)throw new l("UNSUPPORTED","This OpenChamber cannot share the microphone with extensions.");let t=globalThis.AudioContext;if(typeof t!=="function")throw new l("UNSUPPORTED","This frame has no Web Audio.");let o=new t;if(o.sampleRate<st||o.sampleRate>it)throw o.close().catch(()=>{return}),new l("UNSUPPORTED",`Audio at ${o.sampleRate} Hz is not supported.`);let d=o.state==="suspended"?o.resume().catch(()=>{return}):void 0,c=io(Math.round(o.sampleRate/4)),m=o.createScriptProcessor(1024,1,1);m.onaudioprocess=(X)=>c.pull(X.outputBuffer.getChannelData(0));let h=o.createMediaStreamDestination();m.connect(h);let g=new Set,ne={queue:c,endedListeners:g,release:()=>{m.onaudioprocess=null,m.disconnect(),c.clear();for(let X of h.stream.getTracks())X.stop();o.close().catch(()=>{return})}};G=ne;try{let X=await C({...R,type:"microphone-open",id:_(u),payload:{sampleRate:o.sampleRate}},at);if(!X||!("opened"in X)||X.opened!==!0)throw new l("HOST_REJECTED","Host did not open the microphone.");if(await d,G!==ne)throw new l("DISCONNECTED","The microphone closed while it was opening.")}catch(X){if(G===ne)G=null;throw ne.release(),qe(),X}return{stream:h.stream,close:()=>{if(G!==ne)return;G=null,ne.release(),qe()},onEnded:(X)=>(g.add(X),()=>{g.delete(X)})}},Zt=(t)=>{if(!Xo(t)||!hr(t))return;t.preventDefault(),Qt()},qt=(t)=>{if(!Xo(t)||t.key!=="Escape"||p?.surface!=="popover"||!p.popover)return;t.preventDefault(),ro(p.popover.id,"escape").catch(()=>{return})},ke=()=>{let t=p?.surface==="popover"?p.popover:void 0;if(!t)return;let o=Te||Se;if(zt===o)return;zt=o,no(t.id,o).catch(()=>{return})},ye=()=>{if(p?.surface!=="popover"||Te)return;Te=!0,ke()},eo=(t)=>{if(p?.surface!=="popover"||t.relatedTarget!==null||!Te)return;Te=!1,ke()},to=()=>{if(p?.surface!=="popover"||Se)return;Se=!0,ke()},oo=()=>{if(p?.surface!=="popover"||!Se)return;Se=!1,ke()},F=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new l("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},et=async(t)=>{if(t.kind!=="projects")F(t.projectId);let o=await C({...R,type:"workspace-read",id:_(u),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new l("HOST_REJECTED","Host did not return workspace data.");return o},tt=async(t,o)=>{if(t.kind!=="projects")F(t.projectId);let d=_(u);oe.set(d,o);try{await y({...R,type:"workspace-subscribe",id:_(u),payload:{subscriptionId:d,query:t}})}catch(c){if(oe.delete(d),!V)N({...R,type:"workspace-unsubscribe",id:_(u),payload:{subscriptionId:d}});throw c}return()=>{if(!oe.delete(d)||V)return;N({...R,type:"workspace-unsubscribe",id:_(u),payload:{subscriptionId:d}})}},lr=async(t,o)=>{if(t.kind==="session")F(t.sessionId);if(t.kind==="project")F(t.projectId);let d=_(u);re.set(d,o);try{await y({...R,type:"shells-subscribe",id:_(u),payload:{subscriptionId:d,scope:t}})}catch(c){if(re.delete(d),!V)N({...R,type:"shells-unsubscribe",id:_(u),payload:{subscriptionId:d}});throw c}return()=>{if(!re.delete(d)||V)return;N({...R,type:"shells-unsubscribe",id:_(u),payload:{subscriptionId:d}})}},ve=async(t)=>{if("key"in t&&(t.key.length===0||t.key.length>rt))throw new l("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!se(t.value))throw new l("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>nt)throw new l("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&p?.features?.deviceStorage!==!0)throw new l("UNSUPPORTED","This host does not support device storage.");let o=await C({...R,type:"storage",id:_(u),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new l("HOST_REJECTED","Host did not return storage data.");return o},ro=(t,o)=>p?.features?.popovers!==!0&&!(p?.surface==="popover"&&p.popover?.id===t)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):y({...R,type:"popover-close",id:_(u),payload:o?{id:t,reason:o}:{id:t}}),no=(t,o)=>p?.features?.popovers!==!0&&!(p?.surface==="popover"&&p.popover?.id===t)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):y({...R,type:"popover-anchor",id:_(u),payload:{id:t,active:o}});return r.addEventListener("keydown",qt,!0),r.addEventListener("pointerover",ye),r.addEventListener("pointermove",ye),r.addEventListener("pointerout",eo),r.addEventListener("focus",to),r.addEventListener("blur",oo),{onAction:(t)=>(ue=t,()=>{if(ue===t)ue=null}),listProjects:async()=>{let t=await et({kind:"projects"});if(t.kind!=="projects")throw new l("HOST_REJECTED","Expected projects.");return t},listWorktrees:async(t)=>{let o=await et({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new l("HOST_REJECTED","Expected worktrees.");return o},listSessions:async(t)=>{let o=await et({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new l("HOST_REJECTED","Expected sessions.");return o},onProjects:(t)=>tt({kind:"projects"},(o)=>{if(o.kind==="projects")t(o)}),onWorktrees:(t,o)=>tt({kind:"worktrees",projectId:t},(d)=>{if(d.kind==="worktrees")o(d)}),onSessions:(t,o)=>tt({kind:"sessions",projectId:t},(d)=>{if(d.kind==="sessions")o(d)}),onRunningShells:(t,o)=>lr(t,o),readShellOutput:async(t,o)=>{F(t,Ce);let d=o?.cursor;if(d!==void 0&&(!Number.isInteger(d)||d<0))throw new l("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let c=o?.tailBytes;if(c!==void 0&&(!Number.isInteger(c)||c<1||c>Ue))throw new l("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${Ue}.`);let h=await C({...R,type:"shell-output",id:_(u),payload:{shellId:t,cursor:d,tailBytes:c}});if(!h||typeof h.output!=="string"||!Number.isFinite(h.cursor))throw new l("HOST_REJECTED","Host did not return shell output.");return h},stopShell:async(t)=>{if(F(t,Ce),(await C({...R,type:"shell-stop",id:_(u),payload:{shellId:t}}))?.stopped!==!0)throw new l("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async(t)=>{F(t),await y({...R,type:"open-session",id:_(u),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let d=Fe(o),c={op:"get",key:t};if(d)c.scope=d;let m=await ve(c);return m.op==="get"&&m.found?m.value:void 0},set:async(t,o,d)=>{let c=Fe(d),m={op:"set",key:t,value:o};if(c)m.scope=c;await ve(m)},delete:async(t,o)=>{let d=Fe(o),c={op:"delete",key:t};if(d)c.scope=d;await ve(c)},keys:async(t)=>{let o=Fe(t),d={op:"keys"};if(o)d.scope=o;let c=await ve(d);if(c.op!=="keys")throw new l("HOST_REJECTED","Expected storage keys.");return c.keys}},onReady:(t)=>{if(i.add(t),p)t(p);return()=>{i.delete(t)}},onDirectory:(t)=>{if(E.add(t),p)t(p.directory);return()=>{E.delete(t)}},onSession:(t)=>{if(A.add(t),p)t(p.session);return()=>{A.delete(t)}},onSessionLifecycle:(t)=>{if(k.add(t),K)t(K);return()=>{k.delete(t)}},onConnection:(t)=>{if(H.add(t),p)t(p.connection);return()=>{H.delete(t)}},onSettings:(t)=>{if(B.add(t),p)t(p.settings);return()=>{B.delete(t)}},onItem:(t)=>{if(le.add(t),p)t(p.item);return()=>{le.delete(t)}},onBlock:(t)=>{if(Oe.add(t),p?.block)t(p.block);return()=>{Oe.delete(t)}},onServiceEvent:(t)=>(ge.add(t),()=>{ge.delete(t)}),onStatusControl:(t)=>(xe.add(t),()=>{xe.delete(t)}),onPopoverClosed:(t)=>(Re.add(t),()=>{Re.delete(t)}),setStatusControls:(t)=>{if(p?.features?.statusControls!==!0)return Promise.reject(new l("UNSUPPORTED","This host does not support status controls."));if(!uo(t))return Promise.reject(new l("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options."));return y({...R,type:"status-controls",id:_(u),payload:{controls:t}})},openPopover:(t)=>{if(p?.features?.popovers!==!0)return Promise.reject(new l("UNSUPPORTED","This host does not support popovers."));if(!pt(t))return Promise.reject(new l("HOST_REJECTED","Popover requests need bounded geometry and JSON data."));return y({...R,type:"popover-open",id:_(u),payload:t})},closePopover:ro,setPopoverAnchorActive:no,onResolve:(t)=>(pe=t,()=>{if(pe===t)pe=null}),toast:(t)=>{let o=t.message.trim();if(!o||o.length>we)return Promise.reject(new l("HOST_REJECTED",`Toast message must contain 1 to ${we} characters.`));if(t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>Le))return Promise.reject(new l("HOST_REJECTED",`Toast copy text must contain 1 to ${Le} characters.`));return y({channel:T,v:S,type:"toast",id:_(u),payload:{...t,message:o}})},openUrl:(t)=>y({channel:T,v:S,type:"open-url",id:_(u),payload:{url:t}}),...Oo(y,()=>_(u),(t)=>Promise.reject(new l("HOST_REJECTED",t))),answerBlock:(t)=>y({channel:T,v:S,type:"block-answer",id:_(u),payload:{text:t.trim().slice(0,Et)}}),openSurface:(t)=>y({channel:T,v:S,type:"open-surface",id:_(u),payload:{surfaceId:t}}),writeClipboard:(t)=>y({channel:T,v:S,type:"clipboard-write",id:_(u),payload:{text:t}}),compose:(t)=>y({channel:T,v:S,type:"compose",id:_(u),payload:t}),attach:(t)=>y({channel:T,v:S,type:"attach",id:_(u),payload:ie(t)}),startSession:async(t)=>{if(t.projectId!==void 0)F(t.projectId);let o=t.worktree;if(o&&o!==!0)if(o.kind==="existing")F(o.directory);else{if(o.name!==void 0)F(o.name,200);if(o.baseBranch!==void 0)F(o.baseBranch,200)}let d=await C({channel:T,v:S,type:"start-session",id:_(u),payload:At(t)},e.requestTimeoutMs??180000);if(!Tt(d))throw new l("HOST_REJECTED","Host did not return a session.");return d},prompt:(t)=>C({channel:T,v:S,type:"prompt",id:_(u),payload:Ot(t)}).then((o)=>{if(!St(o))throw new l("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:(t)=>y({channel:T,v:S,type:"session-link",id:_(u),payload:ie(t)}),close:()=>y({channel:T,v:S,type:"close",id:_(u)}),oauthStart:()=>y({channel:T,v:S,type:"oauth-start",id:_(u)}),oauthDisconnect:()=>y({channel:T,v:S,type:"oauth-disconnect",id:_(u)}),request:(t)=>(Xe(t.path)?C({channel:T,v:S,type:"request",id:_(u),payload:t}):Vo()).then((o)=>{if(!Ve(o))throw new l("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:(t)=>(Xe(t.path)?C({channel:T,v:S,type:"service-request",id:_(u),payload:t}):Vo()).then((o)=>{if(!Ve(o))throw new l("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>C({channel:T,v:S,type:"service-status",id:_(u)}).then((t)=>{if(!Rt(t))throw new l("HOST_REJECTED","Host did not return service status.");return t}),readFile:(t)=>(ae(t)?C({channel:T,v:S,type:"file-read",id:_(u),payload:{path:t}}):$e()).then((o)=>{if(!bt(o))throw new l("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>{if(!ae(t))return $e();if(o.length>Ge)return Promise.reject(new l("FILE_TOO_LARGE",`Content is over ${Ge} characters.`));return C({channel:T,v:S,type:"file-write",id:_(u),payload:{path:t,content:o}}).then((d)=>{if(!It(d))throw new l("HOST_REJECTED","Host did not confirm the write.");return d})},listDir:(t)=>(ae(t)?C({channel:T,v:S,type:"file-list",id:_(u),payload:{path:t}}):$e()).then((o)=>{if(!kt(o))throw new l("HOST_REJECTED","Host did not return directory entries.");return o}),stat:(t)=>(ae(t)?C({channel:T,v:S,type:"file-stat",id:_(u),payload:{path:t}}):$e()).then((o)=>{if(!yt(o))throw new l("HOST_REJECTED","Host did not return file status.");return o}),generate:(t)=>{let o=t.prompt.trim(),d=t.system?.trim();if(o.length===0||o.length>De)return Promise.reject(new l("HOST_REJECTED",`Prompt must be 1 to ${De} characters.`));if(d!==void 0&&(d.length===0||d.length>He))return Promise.reject(new l("HOST_REJECTED",`System prompt must be 1 to ${He} characters.`));let c=t.maxOutputTokens===void 0?void 0:Math.min(mt,Math.max(1,Math.floor(t.maxOutputTokens)));if(c!==void 0&&!Number.isFinite(c))return Promise.reject(new l("HOST_REJECTED","maxOutputTokens must be a number."));let m={prompt:o};if(d!==void 0)m.system=d;if(c!==void 0)m.maxOutputTokens=c;return C({channel:T,v:S,type:"generate",id:_(u),payload:m},e.requestTimeoutMs??ht).then((h)=>{if(!vt(h))throw new l("HOST_REJECTED","Host did not return generated text.");return h})},onLateGenerateResult:(t)=>{ee.add(t);for(let o of Ye.splice(0))O([t],o);return Jt(),()=>{ee.delete(t)}},openMicrophone:dr,setBadge:(t)=>y({channel:T,v:S,type:"badge",id:_(u),payload:{count:gt(t)}}),setHeight:(t)=>y({channel:T,v:S,type:"resize",id:_(u),payload:{height:xt(t)}}),onFileOpen:(t)=>{if(be.add(t),!Qe)Qe=!0,r.addEventListener("keydown",Zt,!0);if(Ee)t(Ee);return()=>{be.delete(t)}},onFileSnapshot:(t)=>(_e=t,()=>{if(_e===t)_e=null}),onFileSaved:(t)=>(Ie.add(t),()=>{Ie.delete(t)}),reportFileChange:(t)=>Ze({...R,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:Qt,reportFileUnsupported:()=>Ze({...R,type:"file-unsupported"}),dispose:()=>{for(let t of oe.keys())N({...R,type:"workspace-unsubscribe",id:_(u),payload:{subscriptionId:t}});oe.clear();for(let t of re.keys())N({...R,type:"shells-unsubscribe",id:_(u),payload:{subscriptionId:t}});if(re.clear(),G)qe(),G.release(),G=null;if(V=!0,pe=null,ue=null,_e=null,be.clear(),Ie.clear(),Qe)r.removeEventListener("keydown",Zt,!0);r.removeEventListener("message",Yt),r.removeEventListener("keydown",qt,!0),r.removeEventListener("pointerover",ye),r.removeEventListener("pointermove",ye),r.removeEventListener("pointerout",eo),r.removeEventListener("focus",to),r.removeEventListener("blur",oo);for(let t of te.values())clearTimeout(t.timer),t.reject(new l("HOST_UNAVAILABLE","Host client was disposed."));te.clear(),i.clear(),E.clear(),A.clear(),k.clear(),H.clear(),B.clear(),le.clear(),Oe.clear(),ge.clear(),xe.clear(),Re.clear(),ee.clear(),Ye.length=0}}};var $o=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var fn=new Set($o);var Fo=["none","agent","user"];var hn=new Set(Fo);var Ar=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],Or=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],Bo=(e,r)=>{r.style.colorScheme=e.mode;for(let[n,a]of Ar)r.style.setProperty(n,e.tokens[a]);for(let[n,a,i]of Or){let E=e.tokens[i]??"";r.style.setProperty(n,E),r.style.setProperty(a,E)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size",e.tokens.fontSize??"0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},Mt=(e,r)=>{if(Bo(e.theme,r),r.dataset)r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode};var gr={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},x=(e,r)=>`var(--${e}, var(--oc-${gr[e]}, ${r}))`,z=x("surface-background","transparent"),Ke=x("surface-elevated","transparent"),ce=x("surface-elevated-foreground","inherit"),D=x("surface-foreground","inherit"),b=x("surface-muted-foreground","gray"),xr=x("surface-muted","transparent"),Q=x("interactive-border","currentColor"),w=x("interactive-hover","transparent"),Z=x("interactive-active","transparent"),Nt=x("interactive-selection","transparent"),wt=x("interactive-selection-foreground","inherit"),W=x("primary","currentColor"),Lt=x("primary-text","inherit"),Pt=x("error-text","inherit"),Rr=x("font-sans","inherit"),Gt=x("font-mono","monospace"),jo=x("radius","9px"),Dt=`calc(${jo} - 2px)`,Ko=`calc(${jo} - 4px)`,I=(e,r,n="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${n})`,Wo=`background-image: linear-gradient(${w}, ${w});`,Ht=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,Xt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",zo="box-shadow: var(--oc-sdk-lit);",Vt=`inset 0 0.5px 0 0 ${I(D,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,br=`
:root {
  --oc-sdk-edge: ${I(D,16)};
  --oc-sdk-field-bg: ${Ke};
  --oc-sdk-raised-bg: ${z};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${I(D,14)};
  --oc-sdk-field-bg: ${I(z,50,Ke)};
  --oc-sdk-raised-bg: ${Ke};
  --oc-sdk-field-lift: ${Vt};
  --oc-sdk-raised-lift: ${Vt};
  --oc-sdk-lit: ${Vt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Be=(e)=>{let r=x(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${x(`${e}-text`,"inherit")}; }`},s=(e)=>`calc(${e}rem / 14)`,Ir=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${s(8)}; height: ${s(32)}; padding: 0 ${s(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${s(6)}; height: ${s(28)}; padding: 0 ${s(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${s(4)}; height: ${s(24)}; padding: 0 ${s(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${s(14)}; height: ${s(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${s(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${s(32)}; padding: 0 ${s(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${s(8)} ${s(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${s(34)}; padding-right: ${s(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${s(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${s(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${s(24)}; height: ${s(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${s(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${s(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${s(28)}; padding: 0 ${s(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${s(2)}; min-width: ${s(160)}; max-width: calc(100vw - ${s(16)}); max-height: min(${s(320)}, calc(100vh - ${s(16)})); overflow: auto; padding: ${s(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${s(2)} ${s(2)} ${s(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${s(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${s(8)}; width: 100%; padding: ${s(6)} ${s(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${s(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${s(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${s(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${s(14)}; height: ${s(14)}; margin-top: ${s(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${s(36)}; height: ${s(20)}; --oc-sdk-thumb-travel: ${s(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${s(2)}; left: ${s(2)}; width: ${s(16)}; height: ${s(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${s(2)}; padding: ${s(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${s(6)}; height: ${s(28)}; padding: 0 ${s(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${s(1)} ${s(6)}; font-size: ${s(11)}; font-weight: 500; line-height: ${s(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${s(8)}; width: 100%; padding: ${s(6)} ${s(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${s(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${s(16)} ${s(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${s(4)}; padding: ${s(40)} ${s(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${s(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${s(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${s(16)}; height: ${s(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${s(12)}; height: ${s(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${s(12)}; padding: ${s(8)} ${s(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${s(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${s(8)}; width: 100%; margin: ${s(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${s(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${s(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${s(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${s(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${s(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${s(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${s(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${s(36)}; height: ${s(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${s(44)}; }
  .oc-sdk-check { min-height: ${s(36)}; padding: ${s(8)} 0; }
}
`,Jo=`${br}
.oc-sdk { color: ${D}; font-family: ${Rr}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Wo} }
.oc-sdk-mono { font-family: ${Gt}; }
.oc-sdk-muted { color: ${b}; }
${Be("success")}${Be("warning")}${Be("error")}${Be("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${W}; --oc-sdk-tone-text: ${Lt}; }

.oc-sdk-btn { border-radius: ${Dt}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Ko}; }
.oc-sdk-btn[data-variant="default"] { color: ${Lt}; background: ${I(W,10,z)}; border-color: ${I(W,12)}; ${zo} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${I(W,16,z)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${I(W,22,z)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${xr}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${w}, ${w}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${Z}, ${Z}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${ce}; ${Xt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${w}, ${w}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${Z}, ${Z}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${w}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${Z}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${x("status-error","red")}; color: ${Pt}; background: ${I("var(--oc-sdk-tone)",7,z)}; border-color: ${I("var(--oc-sdk-tone)",12)}; ${zo} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${I("var(--oc-sdk-tone)",9,z)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${I("var(--oc-sdk-tone)",11,z)}; box-shadow: none; }

.oc-sdk-field-note { color: ${b}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${Pt}; }
.oc-sdk-input { border-radius: ${Dt}; background: var(--oc-sdk-field-bg); color: ${ce}; ${Ht("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${b}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${w}, ${w}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Ht(I(D,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Ht(x("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Gt}; }

.oc-sdk-search-icon { color: ${b}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${W}; }
.oc-sdk-search-clear { border-radius: ${Ko}; color: ${b}; }
.oc-sdk-search-clear:hover { background: ${w}; color: ${D}; }

.oc-sdk-trigger { border-radius: ${Dt}; background: var(--oc-sdk-raised-bg); color: ${ce}; ${Xt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${w}, ${w}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${Z}, ${Z}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${b}; }
.oc-sdk-trigger-chevron { color: ${b}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${ce}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${Ke}; background-clip: padding-box; color: ${ce}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${w}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${Nt}; color: ${wt}; }
.oc-sdk-option-check { color: ${D}; }
.oc-sdk-option[data-destructive="true"] { color: ${Pt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${I(x("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${b}; }
.oc-sdk-popup-empty { color: ${b}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${Q}; border-radius: 4px; color: ${D}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${I(D,60,Q)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${Q}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${z}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${W}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Wo} }
.oc-sdk-check-desc { color: ${b}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${I(D,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${b}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${D}; }
.oc-sdk-tab[aria-selected="true"] { color: ${wt}; background: ${Nt}; border-color: ${Q}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${ce}; background: var(--oc-sdk-raised-bg); ${Xt} }
.oc-sdk-tab-count { color: ${b}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${I(D,6)}; color: ${b}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${I("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${w}; }
.oc-sdk-row[aria-selected="true"] { background: ${Nt}; color: ${wt}; }
.oc-sdk-row-lead { font-family: ${Gt}; color: ${b}; }
.oc-sdk-row-sub { color: ${b}; }
.oc-sdk-row-meta { color: ${b}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${b}; }

.oc-sdk-empty-body { color: ${b}; }

.oc-sdk-spinner { color: ${b}; }
.oc-sdk-spinner-ring { border-color: ${Q}; border-top-color: ${W}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${I("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${b}; }

.oc-sdk-separator { color: ${b}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${I(Q,40)}; }

.oc-sdk-progress-label { color: ${b}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${I(D,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${W}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${x("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${x("success-text","inherit")}; }

.oc-sdk-text a { color: ${Lt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${I(Q,60)}; }
`,U=`
${ot}
${Ir}
${Jo}`;var Ur={NO_SERVICE:{title:"Local service not allowed",message:"This extension reads mise through a local service. Allow it in Settings → Extensions.",settings:!0},DISABLED:{title:"Extension paused",message:"Resume the mise extension in Settings → Extensions.",settings:!0},SERVICE_FAILED:{title:"The mise service did not start",message:"The local service crashed or never became ready. Try again; if it keeps failing, check Settings → Extensions."},REQUEST_FAILED:{title:"No answer from the mise service",message:"The request was sent but no usable answer came back."},HOST_TIMEOUT:{title:"mise took too long",message:"OpenChamber stopped waiting for the mise service."},RESPONSE_TOO_LARGE:{title:"Too much output",message:"The mise service answered with more than OpenChamber accepts."}},Mr={"invalid-scope":"Nothing to inspect here","bad-request":"Nothing to inspect here","no-git":"git not found","no-mise":"mise not found",busy:"mise is busy",unauthorized:"Service refused the request","not-found":"Unknown operation"},Nr=(e)=>typeof e==="object"&&e!==null&&typeof e.error?.code==="string",wr=async(e,r)=>{let n;try{n=await e.serviceRequest(r)}catch(i){let E=i instanceof l?i.code:"HOST_UNAVAILABLE",A=Ur[E];return{ok:!1,problem:{code:E,...A??{title:"OpenChamber is unavailable",message:i instanceof Error?i.message:String(i)}}}}let a;try{a=JSON.parse(n.body)}catch{return{ok:!1,problem:{code:"bad-answer",title:"Unexpected answer",message:`The mise service answered HTTP ${n.status} with something that is not JSON.`}}}if(Nr(a)){let{code:i,message:E,searched:A}=a.error;return{ok:!1,problem:{code:i,title:Mr[i]??"mise service error",message:E,searched:A}}}return{ok:!0,data:a}},Yo=async(e,r,n)=>{let a=await wr(e,{method:"GET",path:"/inspect",query:{directory:r,parts:n.join(",")}});if(!a.ok)return a;let i=a.data;if(typeof i?.scope?.directory!=="string"||typeof i?.mise?.path!=="string")return{ok:!1,problem:{code:"bad-answer",title:"Unexpected answer",message:"The mise service answered in a shape this panel does not understand."}};return{ok:!0,data:i}},Qo=(e,r)=>{e.serviceRequest({method:"POST",path:"/pins-changed",body:JSON.stringify({directory:r})}).catch(()=>{return})};var v=(e,r=null,...n)=>{let a=document.createElement(e);if(r){if(r.class)a.className=r.class;if(r.title)a.title=r.title;if(r.text!==void 0)a.textContent=r.text;if(r.html!==void 0)a.innerHTML=r.html;for(let[i,E]of Object.entries(r.attrs??{}))if(E!==null&&E!==void 0&&E!==!1)a.setAttribute(i,E);for(let[i,E]of Object.entries(r.style??{}))a.style.setProperty(i,E);for(let[i,E]of Object.entries(r.on??{}))if(E)a.addEventListener(i,E)}for(let i of n){if(i===null||i===void 0||i===!1)continue;a.append(typeof i==="string"?document.createTextNode(i):i)}if(e==="button"&&!(r?.attrs&&("type"in r.attrs)))a.type="button";return a},Zo=(e,r)=>{let n=-1;new ResizeObserver(()=>{let a=Math.ceil(e.getBoundingClientRect().height);if(a===n)return;n=a,r(a)}).observe(e)};var M=(e,r="")=>`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${r}>${e}</svg>`,J={pin:M('<path d="M9 3.5h6l-.8 5.2 3.3 3.3v1.8h-11V12l3.3-3.3z"/><path d="M12 13.8V20.5"/>'),pinFilled:M('<path d="M9 3.5h6l-.8 5.2 3.3 3.3v1.8h-11V12l3.3-3.3z" fill="currentColor"/><path d="M12 13.8V20.5"/>'),refresh:M('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.5H15"/>'),branch:M('<circle cx="6.5" cy="5.5" r="2"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="7.5" r="2"/><path d="M6.5 7.5v9"/><path d="M17.5 9.5c0 4-3.5 5-11 7"/>'),shield:M('<path d="M12 3.2 19.5 6v5.6c0 4.6-3.2 7.9-7.5 9.2-4.3-1.3-7.5-4.6-7.5-9.2V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),search:M('<circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/>'),chevron:M('<path d="m9.5 6 6 6-6 6"/>'),alert:M('<path d="M12 4 21.5 20h-19z"/><path d="M12 10.5v4"/><path d="M12 17.5h.01"/>'),x:M('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),terminal:M('<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="m7.5 10 3 2.5-3 2.5"/><path d="M12.5 15.5h4"/>'),box:M('<path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z"/><path d="M4 7.6 12 12l8-4.4"/><path d="M12 12v8.8"/>'),layers:M('<path d="m12 3.5 9 4.7-9 4.7-9-4.7z"/><path d="m3 12.4 9 4.7 9-4.7"/><path d="m3 16.4 9 4.7 9-4.7" opacity=".55"/>'),folder:M('<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>'),open:M('<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4"/>'),knife:M('<path d="M20.5 3.5c.9 3.4-1.1 7-4.6 10.4l-2.6-2.6"/><path d="m13.3 11.3 7.2-7.8"/><path d="m12.1 12.5-7.6 7.6a1.5 1.5 0 0 1-2.1-2.1L10 10.4"/><path d="m10 10.4 2.1 2.1"/>')};var Lr=(e)=>{let r=2166136261;for(let n=0;n<e.length;n++)r=Math.imul(r^e.charCodeAt(n),16777619);return(r>>>0).toString(36)},Ft=(e)=>`pins:v1:${Lr(e)}`,qo=40,Pr=(e,r)=>{if(e===void 0)return[];let n=e;if(!n||n.v!==1||!Array.isArray(n.tasks))return null;if(n.directory!==r)return[];return n.tasks.filter((a)=>typeof a==="string"&&a.length>0&&a.length<=200).slice(0,qo)};class Bt{host;chain=Promise.resolve();constructor(e){this.host=e}async read(e){try{let r=Pr(await this.host.storage.get(Ft(e)),e);return r?{ok:!0,pins:r}:{ok:!1,message:"Saved pins for this checkout are unreadable."}}catch{return{ok:!1,message:"Could not read pins from extension storage."}}}update(e,r){let n=this.chain.then(async()=>{let a=await this.read(e);if(!a.ok)throw Error(a.message);let i=[...new Set(r(a.pins))].slice(0,qo);if(i.length)await this.host.storage.set(Ft(e),{v:1,directory:e,tasks:i});else await this.host.storage.delete(Ft(e));return Qo(this.host,e),i});return this.chain=n.catch(()=>{return}),n}toggle(e,r){return this.update(e,(n)=>n.includes(r)?n.filter((a)=>a!==r):[...n,r])}remove(e,r){return this.update(e,(n)=>n.filter((a)=>a!==r))}}var er=`
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; background: var(--oc-bg); color: var(--oc-fg); }
body { font-family: var(--oc-font, system-ui, sans-serif); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--oc-focus, var(--oc-primary)); outline-offset: 1px; border-radius: 6px; }

/* Where a value came from. --k fills, --kt is readable text on neutral surfaces. */
.k-global   { --k: var(--oc-muted);   --kt: var(--oc-muted); }
.k-parent   { --k: var(--oc-info);    --kt: var(--oc-info-text); }
.k-root     { --k: var(--oc-primary); --kt: var(--oc-primary-text); }
.k-local    { --k: var(--oc-success); --kt: var(--oc-success-text); }
.k-other    { --k: var(--oc-warning); --kt: var(--oc-warning-text); }
.k-computed { --k: var(--oc-syntax-type, var(--oc-muted)); --kt: var(--oc-syntax-type, var(--oc-muted)); }
.dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--k, var(--oc-muted));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--k, var(--oc-muted)) 16%, transparent); }

.mono { font-family: var(--oc-mono, ui-monospace, monospace); font-variant-ligatures: none; }
.muted { color: var(--oc-muted); }
.trunc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }

.iconbtn { width: 26px; height: 26px; flex: none; display: inline-grid; place-items: center; border: 0; border-radius: 8px;
  background: transparent; color: var(--oc-muted); cursor: pointer; transition: background .12s, color .12s; }
.iconbtn:hover { background: var(--oc-hover); color: var(--oc-fg); }
.iconbtn svg { width: 15px; height: 15px; }
.iconbtn[disabled] { opacity: .45; cursor: default; }
.spin svg { animation: oc-spin .9s linear infinite; }
@keyframes oc-spin { to { transform: rotate(360deg); } }

.btn { height: 28px; padding: 0 12px; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;
  border: 1px solid var(--oc-border); background: var(--oc-elevated); font-size: .78em; font-weight: 550; cursor: pointer; }
.btn:hover { background: var(--oc-hover); }
.btn svg { width: 13px; height: 13px; }
.btn.ghost { border-color: transparent; background: transparent; color: var(--oc-muted); padding: 0 8px; }
.btn.ghost:hover { color: var(--oc-fg); background: var(--oc-hover); }

.chip { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 7px; border-radius: 6px; max-width: 100%;
  font-size: .72em; font-weight: 520; white-space: nowrap; background: var(--oc-muted-surface); color: var(--oc-fg); }
.chip svg { width: 12px; height: 12px; flex: none; }
.chip.t-warning { background: color-mix(in srgb, var(--oc-warning) 14%, transparent); color: var(--oc-warning-text); }
.chip.t-success { background: color-mix(in srgb, var(--oc-success) 14%, transparent); color: var(--oc-success-text); }
.chip.t-info    { background: color-mix(in srgb, var(--oc-info) 14%, transparent);    color: var(--oc-info-text); }
.chip.t-primary { background: color-mix(in srgb, var(--oc-primary) 14%, transparent); color: var(--oc-primary-text); }

.badge { display: inline-flex; align-items: center; height: 17px; padding: 0 6px; border-radius: 5px; font-size: .64em;
  font-weight: 650; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap;
  background: color-mix(in srgb, var(--k, var(--oc-muted)) 13%, transparent); color: var(--kt, var(--oc-muted)); }
.badge.warn { --k: var(--oc-warning); --kt: var(--oc-warning-text); }
.badge.ok { --k: var(--oc-success); --kt: var(--oc-success-text); }

.problem { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; padding: 10px 11px; border-radius: 10px;
  font-size: .78em; line-height: 1.45; background: color-mix(in srgb, var(--oc-warning) 10%, transparent); }
.problem > svg { width: 15px; height: 15px; margin-top: 1px; color: var(--oc-warning-text); }
.problem.error { background: color-mix(in srgb, var(--oc-error) 10%, transparent); }
.problem.error > svg { color: var(--oc-error-text); }
.problem b { display: block; font-weight: 620; margin-bottom: 1px; }
.problem pre { margin: 6px 0 0; font-family: var(--oc-mono, monospace); font-size: .92em; white-space: pre-wrap; word-break: break-word; color: var(--oc-muted); }

.skel { border-radius: 8px; background: linear-gradient(90deg, var(--oc-muted-surface) 0%,
  color-mix(in srgb, var(--oc-muted-surface) 35%, transparent) 50%, var(--oc-muted-surface) 100%);
  background-size: 200% 100%; animation: oc-shimmer 1.4s ease-in-out infinite; }
@keyframes oc-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
@media (prefers-reduced-motion: reduce) { .skel, .spin svg { animation: none; } }
`;var tr=`
body { background: transparent; }
.status { display: grid; gap: 2px; padding: 4px 6px 6px; }
.srow { display: grid; grid-template-columns: 14px auto minmax(0, 1fr) auto; gap: 8px; align-items: center; height: 28px;
  padding: 0 4px 0 6px; border-radius: 8px; cursor: pointer; }
.srow:hover { background: var(--oc-hover); }
.srow > svg { width: 13px; height: 13px; color: var(--oc-primary-text); }
.srow .name { font-size: .78em; font-weight: 560; }
.srow .desc { font-size: .74em; color: var(--oc-muted); }
.srow .tail { display: flex; align-items: center; gap: 4px; }
.srow .dot { width: 6px; height: 6px; box-shadow: none; }
.srow .iconbtn { width: 20px; height: 20px; opacity: 0; }
.srow .iconbtn svg { width: 12px; height: 12px; }
.srow:hover .iconbtn, .srow .iconbtn:focus-visible { opacity: 1; }
.srow.missing > svg, .srow.missing .name { color: var(--oc-muted); }
.snote { display: flex; align-items: center; gap: 8px; min-height: 28px; padding: 2px 6px; font-size: .76em; color: var(--oc-muted); }
.snote svg { width: 13px; height: 13px; flex: none; }
.snote.warn svg { color: var(--oc-warning-text); }
.snote .btn { margin-left: auto; height: 22px; padding: 0 8px; font-size: .95em; }
.sfoot { display: flex; align-items: center; gap: 6px; padding: 2px 6px 0; font-size: .7em; color: var(--oc-muted); }
.sfoot .btn { margin-left: auto; height: 22px; padding: 0 6px; font-size: 1em; }
`,or=(...e)=>{let r=document.createElement("style");r.textContent=e.join(`
`),document.head.append(r)};var Y=Ut(),Wt=new Bt(Y);or(er,tr);var sr=document.querySelector("#root"),Ae=null,rr=!1,Kt=0,f={kind:"loading"},ir=async()=>{let e=Ae,r=++Kt;if(!e){f={kind:"empty"},q();return}if(f.kind!=="ready")f={kind:"loading"},q();let n=await Yo(Y,e,["tasks"]);if(r!==Kt||e!==Ae)return;if(!n.ok){f={kind:"problem",problem:n.problem},q();return}let{scope:a,tasks:i}=n.data,E=await Wt.read(a.directory);if(r!==Kt||e!==Ae)return;f={kind:"ready",scope:a,tasks:i?.ok?i.data:null,tasksError:i&&!i.ok?i.error.message:null,pins:E.ok?E.pins:[],pinsError:E.ok?null:E.message},q()},ar=async()=>{if(f.kind!=="ready")return;let e=f.scope.directory,r=await Wt.read(e);if(f.kind!=="ready"||f.scope.directory!==e)return;f={...f,pins:r.ok?r.pins:f.pins,pinsError:r.ok?null:r.message},q()},cr=()=>{Y.openSurface("plugin:mise-inspector").catch(()=>{return})},Gr=(e)=>{if(f.kind!=="ready")return;let r=f.scope.directory;f={...f,pins:f.pins.filter((n)=>n!==e)},q(),Wt.remove(r,e).catch(()=>{ar(),Y.toast({kind:"error",message:"Could not unpin the task."})})},he=(e,r,n="",a)=>v("div",{class:`snote ${n}`.trim()},v("span",{html:e,style:{display:"contents"}}),v("span",{class:"trunc"},r),a??null),nr=(e)=>v("button",{class:"btn ghost",on:{click:cr}},e),q=()=>{let e;if(f.kind==="empty")e=he(J.folder,"Open a project to see its pinned mise tasks.");else if(f.kind==="loading")e=v("div",{class:"status"},...[60,45].map((r)=>v("div",{class:"skel",style:{height:"14px",width:`${r}%`,margin:"7px 6px"}})));else if(f.kind==="problem"){let r=f.problem.code==="invalid-scope";e=he(r?J.folder:J.alert,r?"No git checkout or mise project here.":`${f.problem.title}. ${f.problem.message}`,r?"":"warn",r?void 0:v("button",{class:"btn",on:{click:()=>{ir()}}},"Retry"))}else if(f.pinsError)e=he(J.alert,f.pinsError,"warn");else if(!f.pins.length)e=he(J.pin,`Nothing pinned in ${f.scope.name}.`,"",nr("Open mise"));else{let{tasks:r,pins:n,scope:a,tasksError:i}=f,E=new Map((r??[]).map((A)=>[A.name,A]));e=v("div",{class:"status"},...n.map((A)=>{let k=E.get(A),H=r!==null&&!k;return v("div",{class:`srow ${H?"missing":""}`.trim(),title:H?`${A} is no longer defined in ${a.name}`:`${A} — open in the mise panel`,on:{click:cr}},v("span",{html:J.pinFilled,style:{display:"contents"}}),v("span",{class:"name mono"},A),v("span",{class:"desc trunc"},H?"not defined here":k?.description??""),v("span",{class:"tail"},k?v("span",{class:`dot k-${k.source.kind}`,title:k.source.label??"computed"}):null,v("button",{class:"iconbtn",title:`Unpin ${A}`,attrs:{"aria-label":`Unpin ${A}`},html:J.x,on:{click:(B)=>{B.stopPropagation(),Gr(A)}}})))}),i?he(J.alert,`Tasks not read: ${i}`,"warn"):null,v("div",{class:"sfoot"},v("span",{class:"trunc mono"},a.branch?`${a.name} · ${a.branch}`:a.name),nr("Open mise")))}sr.replaceChildren(e)};Y.onReady((e)=>{Mt(e,document.documentElement)});Y.onDirectory((e)=>{if(rr&&e===Ae)return;rr=!0,Ae=e,f={kind:"loading"},ir()});Y.onServiceEvent((e)=>{if(e.topic!=="pins"||f.kind!=="ready")return;if(e.data?.directory===f.scope.directory)ar()});Zo(sr,(e)=>{Y.setHeight(Math.max(28,e)).catch(()=>{return})});q();})();
